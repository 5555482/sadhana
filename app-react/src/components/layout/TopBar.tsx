import React from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { FaChevronLeft, FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showClose?: boolean
  right?: React.ReactNode
}

const navItems = [
  { to: '/', label: 'Home', icon: FaHome, exact: true },
  { to: '/charts', label: 'Charts', icon: FaChartBar, exact: false },
  { to: '/yatras', label: 'Yatras', icon: FaUsers, exact: false },
  { to: '/settings', label: 'Settings', icon: FaCog, exact: false },
]

export const TopBar = React.memo(function TopBar({ title, showBack, showClose, right }: TopBarProps) {
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
      {showClose ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="btn btn-ghost btn-sm btn-circle text-gray-500"
        >
          <LuX className="w-5 h-5" />
        </button>
      ) : showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn btn-ghost btn-sm btn-circle text-gray-700"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
            src="/logo.png"
            className="h-8 w-8 object-contain"
            alt="Sadhana logo"
            style={{
              filter: 'invert(42%) sepia(99%) saturate(431%) hue-rotate(131deg) brightness(93%) contrast(101%)',
              mixBlendMode: 'multiply',
            }}
          />
          <span className="font-serif text-xl font-bold" style={{ color: '#01a386' }}>Sadhana</span>
        </Link>
      )}

      {(showBack || showClose) && title && (
        <h1 className="font-semibold text-base text-gray-800 flex-1">{title}</h1>
      )}

      {!showBack && !showClose && (
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
        <div className={(showBack || showClose) ? 'ml-auto' : 'ml-2'}>
          {right}
        </div>
      )}
    </header>
  )
})
