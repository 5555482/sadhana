import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { FaChevronLeft, FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa'

interface TopBarProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

const navItems = [
  { to: '/', label: 'Home', icon: FaHome, exact: true },
  { to: '/charts', label: 'Charts', icon: FaChartBar, exact: false },
  { to: '/yatras', label: 'Yatras', icon: FaUsers, exact: false },
  { to: '/settings', label: 'Settings', icon: FaCog, exact: false },
]

export const TopBar = React.memo(function TopBar({ title, showBack, right }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-40 gap-3"
      style={{
        background: 'rgba(255, 255, 255, 0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn btn-ghost btn-sm btn-circle text-gray-700"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <span className="font-serif text-lg text-gray-800 font-bold">Sadhana Pro</span>
      )}

      {showBack && title && (
        <h1 className="font-semibold text-base text-gray-800 flex-1">{title}</h1>
      )}

      {!showBack && (
        <nav className="ml-auto flex items-center gap-1" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              aria-label={label}
              style={({ isActive }) => ({
                color: isActive ? '#01a386' : 'rgba(0,0,0,0.40)',
                textDecoration: isActive ? 'underline' : 'none',
                textUnderlineOffset: '3px',
              })}
              className="flex items-center px-2 py-1 rounded transition-colors text-sm font-medium"
            >
              {/* Below sm: icon only */}
              <Icon className="w-4 h-4 sm:hidden" />
              {/* sm and above: text label */}
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {right && (
        <div className={showBack ? 'ml-auto' : 'ml-2'}>
          {right}
        </div>
      )}
    </header>
  )
})
