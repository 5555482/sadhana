import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'

export function AppShell() {
  return (
    <div className="relative">
      {/* Fixed photo background — avoids iOS background-attachment:fixed bug */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/login-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
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
