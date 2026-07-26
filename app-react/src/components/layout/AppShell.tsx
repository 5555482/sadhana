import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { AuthBackground } from './AuthBackground'

export function AppShell() {
  return (
    <div className="relative">
      <AuthBackground />
      {/* Light white overlay — airy watercolor wash over the photo */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      />
      <TopBar />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  )
}
