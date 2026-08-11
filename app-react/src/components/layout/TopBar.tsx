import React from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { navItems } from './navItems'
import { ACCENT, SURFACE_GLASS, TEXT_FAINT, BORDER } from '../../theme/tokens'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showClose?: boolean
  right?: React.ReactNode
}

export const TopBar = React.memo(function TopBar({ title, showBack, showClose, right }: TopBarProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-14 items-center px-4 z-40 gap-3 ${showBack || showClose ? 'flex' : 'hidden sm:flex'}`}
      style={{
        background: SURFACE_GLASS,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      {showClose ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Close"
          className="btn btn-ghost btn-sm btn-circle text-base-content/70"
        >
          <LuX className="w-5 h-5" />
        </button>
      ) : showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn btn-ghost btn-sm btn-circle text-base-content/80"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <Link to="/" className="flex items-center no-underline">
          <img
            src="/logo.png"
            className="h-8 w-8 object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
            alt="Sadhana"
          />
        </Link>
      )}

      {(showBack || showClose) && title && (
        <h1 className="font-serif font-semibold text-base text-base-content flex-1">{title}</h1>
      )}

      {!showBack && !showClose && (
        <nav className="ml-auto hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {navItems.map(({ to, navKey, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              aria-label={t(`nav.${navKey}`)}
              className="flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors text-sm font-medium"
            >
              {({ isActive }) => (
                <>
                  {/* Below sm: icon only */}
                  <Icon
                    className="w-4 h-4 sm:hidden transition-colors"
                    style={{ color: isActive ? ACCENT : TEXT_FAINT }}
                  />
                  {/* sm and above: text label */}
                  <span
                    className="hidden sm:inline transition-colors"
                    style={{
                      color: isActive ? ACCENT : TEXT_FAINT,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  >
                    {t(`nav.${navKey}`)}
                  </span>
                  {/* Active dot */}
                  <span
                    className="w-1 h-1 rounded-full transition-all"
                    style={{ background: isActive ? ACCENT : 'transparent' }}
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
