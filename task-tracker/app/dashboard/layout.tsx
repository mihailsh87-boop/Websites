import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const roleLabel = session.user.role === 'developer' ? 'Разработчик' : 'Заказчик'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Task Tracker</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {session.user.name || session.user.email}
              <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {roleLabel}
              </span>
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
