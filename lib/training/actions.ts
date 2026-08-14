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

async function ensureQuizSeeded(supabase: ReturnType<typeof createServiceClient>) {
  const { count } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true })

  if (!count || count < 20) {
    for (const q of QUIZ_QUESTION_BANK) {
      await supabase.from('quiz_questions').upsert(
        {
          id: q.id.length === 36 ? q.id : undefined,
          question: q.question,
          question_type: 'multiple_choice',
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          version: 1,
          is_active: true,
        }
      )
    }
  }
}

export async function getTrainingProgress(): Promise<ActionResult<{
  completedModuleIds: string[]
  totalModules: number
  completionPercent: number
}>> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Get all published modules
  const { data: modules } = await supabase
    .from('training_modules')
    .select('id')
    .eq('is_published', true)
    .order('module_number', { ascending: true })

  const totalModules = modules?.length || TRAINING_MODULES.length

  // Get user progress
  const { data: progress } = await supabase
    .from('training_progress')
    .select('module_id')
    .eq('user_id', session.user.id)
    .eq('completed', true)

  const completedModuleIds: string[] = progress?.map((p: { module_id: string }) => p.module_id) || []
  const completionPercent =
    totalModules > 0 ? Math.round((completedModuleIds.length / totalModules) * 100) : 0

  return {
    success: true,
    data: { completedModuleIds, totalModules, completionPercent },
  }
}

export async function markModuleComplete(moduleId: string): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const supabase = createServiceClient()
  await ensureModulesSeeded(supabase)

  // Verify module exists or match by ID / module_number
  let targetId = moduleId
  const { data: module } = await supabase
    .from('training_modules')
    .select('id')
    .or(`id.eq.${moduleId},module_number.eq.${isNaN(parseInt(moduleId)) ? 0 : parseInt(moduleId)}`)
    .eq('is_published', true)
    .single()

  if (module) {
    targetId = module.id
  }

  const { error } = await supabase
    .from('training_progress')
    .upsert(
      {
        user_id: session.user.id,
        module_id: targetId,
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

  // Score against db questions or fallback bank
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

  // Record attempt
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

  // Get active questions from DB or bank
  const { data: dbQuestions } = await supabase
    .from('quiz_questions')
    .select('id, question, options')
    .eq('is_active', true)

  if (dbQuestions && dbQuestions.length >= 20) {
    const shuffled = [...dbQuestions].sort(() => Math.random() - 0.5).slice(0, 20)
    return { success: true, data: shuffled }
  }

  // Fallback to randomized bank of 20 questions
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
