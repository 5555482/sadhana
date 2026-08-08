import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { navItems } from './navItems'
import { AuthBackground } from './AuthBackground'
import { ToastContainer } from '../ui/Toast'
import { PageTransition } from './PageTransition'

export function AppShell() {
  const location = useLocation()
  // Bottom nav shows only on the top-level destinations; sub-pages (which use
  // back/close) don't get it.
  const showBottomNav = navItems.some((n) => n.to === location.pathname)
  return (
    <div className="relative">
      <AuthBackground />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      />
      <TopBar />
      <main
        className={
          'pt-14' +
          (showBottomNav ? ' pb-[calc(64px+env(safe-area-inset-bottom))] sm:pb-0' : '')
        }
      >
        <AnimatePresence>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      {showBottomNav && <BottomNav />}
      <ToastContainer />
    </div>
  )
}
