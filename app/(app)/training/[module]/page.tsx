import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getTrainingProgress } from '@/lib/training/actions'
import { TRAINING_MODULES } from '@/lib/training/modules'
import ModuleViewer from '@/components/training/ModuleViewer'

interface ModulePageProps {
  params: Promise<{ module: string }>
}

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { module: moduleParam } = await params
  const modNum = parseInt(moduleParam, 10)
  const mod = TRAINING_MODULES.find((m) => m.module_number === modNum)

  return {
    title: mod ? `Module ${mod.module_number}: ${mod.title}` : 'Training Module',
  }
}

export default async function TrainingModulePage({ params }: ModulePageProps) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { module: moduleParam } = await params
  const modNum = parseInt(moduleParam, 10)

  if (isNaN(modNum) || modNum < 1 || modNum > TRAINING_MODULES.length) {
    notFound()
  }

  const currentModule = TRAINING_MODULES.find((m) => m.module_number === modNum)
  if (!currentModule) notFound()

  const progressResult = await getTrainingProgress()
  const completedIds = progressResult.data?.completedModuleIds || []

  const allModulesSummary = TRAINING_MODULES.map((m) => ({
    id: String(m.module_number),
    module_number: m.module_number,
    title: m.title,
  }))

  return (
    <ModuleViewer
      currentModule={currentModule}
      allModules={allModulesSummary}
      completedModuleIds={completedIds}
      isCertified={session.user.training_completed}
    />
  )
}
