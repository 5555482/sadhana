import React from 'react'
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaChevronLeft } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { navItems } from './navItems'
import { HomeHeaderActions } from './HomeHeaderActions'
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

  const renderNavItem = ({ to, navKey, exact }: (typeof navItems)[number]) => (
    <NavLink
      key={to}
      to={to}
      end={exact}
      onClick={navKey === 'settings' ? (e) => { e.preventDefault(); openSettings() } : undefined}
      aria-label={t(`nav.${navKey}`)}
      className={`h-9 inline-flex items-center px-3 rounded-full text-sm font-medium transition-colors ${navKey === 'charts' ? 'lg:hidden' : ''}`}
    >
      {({ isActive }) => (
        <span
          style={{
            color: isActive ? '#1f2937' : 'rgba(31,41,55,0.62)',
            fontWeight: isActive ? 600 : 500,
          }}
        >
          {t(`nav.${navKey}`)}
        </span>
      )}
    </NavLink>
  )

  // Desktop nav: Yatras is reachable via the Yatras ▾ menu, so drop it here.
  const desktopNav = navItems.filter(({ navKey }) => navKey !== 'yatras')
  const homeItem = desktopNav.find(({ navKey }) => navKey === 'home')
  const restItems = desktopNav.filter(({ navKey }) => navKey !== 'home')

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-14 items-center px-4 z-40 gap-3 ${showBack || showClose ? 'flex' : 'hidden sm:flex'}`}
      style={{
        // Transparent over the backdrop (Giga-style) — a faint top scrim keeps
        // the nav/logo legible over the photo.
        background: 'linear-gradient(180deg, rgba(244,245,247,0.88) 0%, rgba(244,245,247,0) 100%)',
      }}
    >
      {showClose ? (
        <button onClick={() => navigate(-1)} aria-label="Close" className="btn btn-ghost btn-sm btn-circle text-base-content/70">
          <LuX className="w-5 h-5" />
        </button>
      ) : showBack ? (
        <button onClick={() => navigate(-1)} aria-label="Go back" className="btn btn-ghost btn-sm btn-circle text-base-content/80">
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <Link to="/" className="flex items-center no-underline">
          <img src="/logo.png" className="h-[35px] w-[35px] object-contain" style={{ filter: 'brightness(0)' }} alt="Sadhana" />
        </Link>
      )}

      {(showBack || showClose) && title && (
        <h1 className="font-serif font-semibold text-base text-base-content flex-1">{title}</h1>
      )}

      {!showBack && !showClose && (
        <nav className="ml-auto hidden sm:flex items-center gap-2" aria-label="Main navigation">
          {homeItem && renderNavItem(homeItem)}
          {location.pathname === '/' && <HomeHeaderActions />}
          {restItems.map(renderNavItem)}
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
