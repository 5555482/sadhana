import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSlidersH, FaPlus } from 'react-icons/fa'
import { navItems } from './navItems'

function Tab({ to, navKey, icon: Icon, exact }: (typeof navItems)[number]) {
  const { t } = useTranslation()
  return (
    <NavLink
      to={to}
      end={exact}
      aria-label={t(`nav.${navKey}`)}
      className="flex-1 flex items-center justify-center min-h-[56px] no-underline"
    >
      {({ isActive }) => (
        <Icon
          className="w-6 h-6 transition-colors"
          style={{ color: isActive ? '#01a386' : 'rgba(0,0,0,0.40)' }}
        />
      )}
    </NavLink>
  )
}

/**
 * Mobile-only bottom navigation. Same four destinations as the desktop TopBar,
 * moved to the bottom on small screens. Matches the app's existing glass/teal
 * aesthetic. Rendered by AppShell only on the top-level routes; `sm:hidden` so
 * desktop keeps the top nav.
 */
export function BottomNav() {
  const { t } = useTranslation()
  const [home, charts, yatras, settings] = navItems
  const { pathname } = useLocation()

  // Center button is context-aware: on Charts it adds a new report;
  // elsewhere it opens practice editing.
  const onCharts = pathname === '/charts'
  const centerTo = onCharts ? '/charts/new' : '/user/practices'
  const centerLabel = onCharts ? t('charts.newReport') : 'Edit practices'
  const CenterIcon = onCharts ? FaPlus : FaSlidersH

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden flex items-stretch"
      style={{
        background: 'rgba(255, 255, 255, 0.70)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <Tab {...home} />
      <Tab {...charts} />

      {/* Center — context-aware: New report on Charts, else Edit practices */}
      <div className="flex-1 flex justify-center items-start">
        <Link
          to={centerTo}
          aria-label={centerLabel}
          className="flex items-center justify-center rounded-full no-underline"
          style={{
            width: '52px',
            height: '52px',
            marginTop: '-14px',
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 20px rgba(1,163,134,0.40)',
          }}
        >
          <CenterIcon className="w-5 h-5 text-white" />
        </Link>
      </div>

      <Tab {...yatras} />
      <Tab {...settings} />
    </nav>
  )
}
