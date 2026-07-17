import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa'

const tabs = [
  { to: '/', label: 'Home', icon: FaHome, exact: true },
  { to: '/charts', label: 'Charts', icon: FaChartBar, exact: false },
  { to: '/yatras', label: 'Yatras', icon: FaUsers, exact: false },
  { to: '/settings', label: 'Settings', icon: FaCog, exact: false },
]

export const BottomNav = React.memo(function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-1 border-t border-white/10 flex items-center justify-around z-40 pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ to, label, icon: Icon, exact }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          aria-label={label}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors ${
              isActive ? 'text-gold' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
})
