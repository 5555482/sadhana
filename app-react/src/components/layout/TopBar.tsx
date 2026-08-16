import React from 'react'
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { navItems } from './navItems'
import { HomeHeaderActions } from './HomeHeaderActions'
import { ACCENT } from '../../theme/tokens'
import { useUiStore } from '../../store/uiStore'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showClose?: boolean
  right?: React.ReactNode
}

export const TopBar = React.memo(function TopBar({ title, showBack, showClose, right }: TopBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const openSettings = useUiStore((s) => s.openSettings)

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-14 items-center px-4 z-40 gap-3 ${showBack || showClose ? 'flex' : 'hidden sm:flex'}`}
      style={{
        // Transparent over the backdrop (Giga-style) — no solid bar; a faint
        // top scrim keeps the nav/logo legible over the photo.
        background: 'linear-gradient(180deg, rgba(30,43,69,0.55) 0%, rgba(30,43,69,0) 100%)',
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
            className="h-[35px] w-[35px] object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
            alt="Sadhana"
          />
        </Link>
      )}

      {(showBack || showClose) && title && (
        <h1 className="font-serif font-semibold text-base text-base-content flex-1">{title}</h1>
      )}

      {!showBack && !showClose && (
        <div className="ml-auto hidden sm:flex items-center gap-2">
          {location.pathname === '/' && <HomeHeaderActions />}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {navItems
              .filter(({ navKey }) => navKey !== 'yatras')
              .map(({ to, navKey, icon: Icon, exact }) => {
                const iconOnly = navKey === 'settings'
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={exact}
                    onClick={navKey === 'settings' ? (e) => { e.preventDefault(); openSettings() } : undefined}
                    aria-label={t(`nav.${navKey}`)}
                    className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg transition-colors text-sm font-medium ${navKey === 'charts' ? 'lg:hidden' : ''}`}
                  >
                    {({ isActive }) => (
                      <>
                        {/* icon: always for Settings, otherwise only below sm */}
                        <Icon
                          className={`w-4 h-4 transition-colors ${iconOnly ? '' : 'sm:hidden'}`}
                          style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
                        />
                        {/* text label: sm+ for non-Settings items */}
                        {!iconOnly && (
                          <span
                            className="hidden sm:inline transition-colors"
                            style={{
                              color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                              fontWeight: isActive ? 600 : 500,
                            }}
                          >
                            {t(`nav.${navKey}`)}
                          </span>
                        )}
                        {/* Active dot */}
                        <span
                          className="w-1 h-1 rounded-full transition-all"
                          style={{ background: isActive ? ACCENT : 'transparent' }}
                        />
                      </>
                    )}
                  </NavLink>
                )
              })}
          </nav>
        </div>
      )}

      {right && (
        <div className={(showBack || showClose) ? 'ml-auto' : 'ml-2'}>
          {right}
        </div>
      )}
    </header>
  )
})
