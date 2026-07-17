import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  title?: string
  showBack?: boolean
}

export function AppShell({ title, showBack }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-0">
      <TopBar title={title} showBack={showBack} />
      <main className="pt-14 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
