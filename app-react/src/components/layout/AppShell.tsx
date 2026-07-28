import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TopBar } from './TopBar'
import { AuthBackground } from './AuthBackground'
import { ToastContainer } from '../ui/Toast'
import { PageTransition } from './PageTransition'

export function AppShell() {
  const location = useLocation()
  return (
    <div className="relative">
      <AuthBackground />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      />
      <TopBar />
      <main className="pt-14">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <ToastContainer />
    </div>
  )
}
