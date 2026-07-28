import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TopBar } from './TopBar'
import { ToastContainer } from '../ui/Toast'
import { PageTransition } from './PageTransition'

export function AppShell() {
  const location = useLocation()
  return (
    <div className="relative min-h-screen" style={{ background: '#f8fafb' }}>
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
