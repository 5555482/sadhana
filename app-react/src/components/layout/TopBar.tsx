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
        <Link to="/" className="flex items-center no-underline">
          <img
            src="/logo.png"
            className="h-8 w-8 object-contain"
            alt="Sadhana"
          />
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
              className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors text-sm font-medium"
            >
              {({ isActive }) => (
                <>
                  {/* Below sm: icon only */}
                  <Icon
                    className="w-4 h-4 sm:hidden transition-colors"
                    style={{ color: isActive ? '#01a386' : 'rgba(0,0,0,0.40)' }}
                  />
                  {/* sm and above: text label */}
                  <span
                    className="hidden sm:inline transition-colors"
                    style={{
                      color: isActive ? '#01a386' : 'rgba(0,0,0,0.40)',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {label}
                  </span>
                  {/* Active dot */}
                  <span
                    className="w-1 h-1 rounded-full transition-all"
                    style={{ background: isActive ? '#01a386' : 'transparent' }}
                  />
                </>
              )}
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
