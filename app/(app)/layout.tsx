import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="app-shell">
      <Sidebar user={session.user} />
      <main className="app-main">{children}</main>
    </div>
  )
}
