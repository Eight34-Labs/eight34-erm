'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth/session'
import type { ActionResult } from '@/types'
import { TRAINING_MODULES } from '@/lib/training/modules'
import { QUIZ_QUESTION_BANK } from '@/lib/training/quizData'

async function ensureModulesSeeded(supabase: ReturnType<typeof createServiceClient>) {
  const { count } = await supabase
    .from('training_modules')
    .select('*', { count: 'exact', head: true })

  if (!count || count === 0) {
    for (const mod of TRAINING_MODULES) {
      await supabase.from('training_modules').upsert(
        {
          module_number: mod.module_number,
          title: mod.title,
          description: mod.description,
          content: mod.content as any,
          version: 1,
          is_published: true,
        },
        { onConflict: 'module_number' }
      )
    }
  }
}

export async function getTrainingProgress(): Promise<ActionResult<{
  completedModuleIds: string[]
  completedModuleNumbers: number[]
  totalModules: number
  completionPercent: number
}>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Get all published modules with their IDs and module_numbers
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id, module_number')
    .eq('is_published', true)
    .order('module_number', { ascending: true })

  const totalModules = modules && modules.length > 0 ? modules.length : TRAINING_MODULES.length

  const idToNumber = new Map<string, number>()
  if (modules) {
    for (const m of modules) {
      idToNumber.set(m.id, m.module_number)
    }
  }

  // Get user progress
  const { data: progress } = await supabase
    .from('training_progress')
    .select('module_id')
    .eq('user_id', session.user.id)
    .eq('completed', true)

  const completedModuleIds: string[] = []
  const completedModuleNumbers: number[] = []

  if (progress) {
    for (const p of progress) {
      completedModuleIds.push(p.module_id)
      const num = idToNumber.get(p.module_id)
      if (num !== undefined) {
        completedModuleNumbers.push(num)
        completedModuleIds.push(String(num))
      }
    }
  }

  const uniqueCompletedCount = new Set(completedModuleNumbers).size
  const completionPercent =
    totalModules > 0 ? Math.round((uniqueCompletedCount / totalModules) * 100) : 0

  return {
    success: true,
    data: {
      completedModuleIds: Array.from(new Set(completedModuleIds)),
      completedModuleNumbers: Array.from(new Set(completedModuleNumbers)),
      totalModules,
      completionPercent,
    },
  }
}

export async function markModuleComplete(moduleIdentifier: string | number): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Find target module UUID
  let targetModuleId: string | null = null
  const modNum = typeof moduleIdentifier === 'number' ? moduleIdentifier : parseInt(String(moduleIdentifier), 10)

  if (!isNaN(modNum) && modNum > 0) {
    const { data: modByNum } = await supabase
      .from('training_modules')
      .select('id')
      .eq('module_number', modNum)
      .maybeSingle()

    if (modByNum) {
      targetModuleId = modByNum.id
    }
  }

  if (!targetModuleId && typeof moduleIdentifier === 'string' && moduleIdentifier.length === 36) {
    const { data: modById } = await supabase
      .from('training_modules')
      .select('id')
      .eq('id', moduleIdentifier)
      .maybeSingle()

    if (modById) {
      targetModuleId = modById.id
    }
  }

  if (!targetModuleId) {
    // Fallback: seed and query again
    const { data: allMods } = await supabase
      .from('training_modules')
      .select('id, module_number')
      .order('module_number', { ascending: true })

    const found = allMods?.find((m: { id: string; module_number: number }) =>
      m.module_number === modNum || m.id === String(moduleIdentifier)
    )

    if (found) {
      targetModuleId = found.id
    }
  }

  if (!targetModuleId) {
    return { success: false, error: `Module ${moduleIdentifier} not found` }
  }

  const { error } = await supabase
    .from('training_progress')
    .upsert(
      {
        user_id: session.user.id,
        module_id: targetModuleId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' }
    )

  if (error) {
    console.error('Error marking module complete:', error)
    return { success: false, error: 'Failed to mark module complete' }
  }

  revalidatePath('/training')
  revalidatePath(`/training/${modNum}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function submitQuiz(answers: Record<string, string>): Promise<ActionResult<{
  score: number
  total: number
  passed: boolean
  incorrectAnswers: Array<{ questionId: string; correct: string; explanation: string }>
}>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { user } = session
  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Verify all training modules are completed
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id')
    .eq('is_published', true)

  const { data: progress } = await supabase
    .from('training_progress')
    .select('module_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedIds = new Set(progress?.map((p: { module_id: string }) => p.module_id) || [])
  const allComplete = (modules && modules.length > 0)
    ? modules.every((m: { id: string }) => completedIds.has(m.id))
    : true

  if (!allComplete) {
    return { success: false, error: 'All training modules must be completed before taking the quiz' }
  }

  const questionIds = Object.keys(answers)
  if (questionIds.length === 0) {
    return { success: false, error: 'No answers submitted' }
  }

  // Fetch questions from DB or bank
  const { data: dbQuestions } = await supabase
    .from('quiz_questions')
    .select('id, question, correct_answer, explanation')
    .in('id', questionIds)

  let score = 0
  const incorrectAnswers: Array<{ questionId: string; correct: string; explanation: string }> = []

  for (const qId of questionIds) {
    const userAnswer = answers[qId]
    const dbQ = dbQuestions?.find((q: { id: string }) => q.id === qId)
    const bankQ = QUIZ_QUESTION_BANK.find((q) => q.id === qId || q.question === qId)

    const correctAnswer = dbQ?.correct_answer || bankQ?.correct_answer
    const explanation = dbQ?.explanation || bankQ?.explanation || 'Please review the relevant training module.'

    if (correctAnswer && userAnswer === correctAnswer) {
      score++
    } else if (correctAnswer) {
      incorrectAnswers.push({
        questionId: qId,
        correct: correctAnswer,
        explanation,
      })
    }
  }

  const total = questionIds.length
  const passed = score >= Math.ceil(total * 0.8) // 16/20 (80%)

  try {
    await supabase.from('quiz_attempts').insert({
      user_id: user.id,
      score,
      total_questions: total,
      passed,
      answers,
      training_version: 1,
      completed_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Failed to log quiz attempt:', err)
  }

  // Update user's certification status
  if (passed) {
    await supabase
      .from('users')
      .update({
        training_completed: true,
        training_version: 1,
        quiz_score: score,
        training_completed_at: new Date().toISOString(),
      })
      .eq('id', user.id)
  } else {
    // Reset progress on failure
    await supabase
      .from('users')
      .update({
        training_completed: false,
        training_version: null,
        quiz_score: score,
        training_completed_at: null,
      })
      .eq('id', user.id)

    await supabase
      .from('training_progress')
      .update({ completed: false, completed_at: null })
      .eq('user_id', user.id)
  }

  revalidatePath('/training')
  revalidatePath('/dashboard')
  revalidatePath('/leads/new')

  return {
    success: true,
    data: { score, total, passed, incorrectAnswers },
  }
}

export async function getQuizQuestions(): Promise<ActionResult<Array<{
  id: string
  question: string
  options: string[]
}>>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Verify training is complete
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id')
    .eq('is_published', true)

  const { data: progress } = await supabase
    .from('training_progress')
    .select('module_id')
    .eq('user_id', session.user.id)
    .eq('completed', true)

  const completedIds = new Set(progress?.map((p: { module_id: string }) => p.module_id) || [])
  const allComplete = (modules && modules.length > 0)
    ? modules.every((m: { id: string }) => completedIds.has(m.id))
    : true

  if (!allComplete) {
    return { success: false, error: 'Complete all training modules first' }
  }

  const { data: dbQuestions } = await supabase
    .from('quiz_questions')
    .select('id, question, options')
    .eq('is_active', true)

  if (dbQuestions && dbQuestions.length >= 20) {
    const shuffled = [...dbQuestions].sort(() => Math.random() - 0.5).slice(0, 20)
    return { success: true, data: shuffled }
  }

  const shuffledBank = [...QUIZ_QUESTION_BANK]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20)
    .map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }))

  return { success: true, data: shuffledBank }
}
