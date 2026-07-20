import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'

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
      <div className="fixed inset-0 bg-black/30 -z-10 pointer-events-none" />

      <TopBar />
      <main className="pt-14 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
