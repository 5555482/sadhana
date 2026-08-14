import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaPlus, FaSlidersH } from 'react-icons/fa'
import { ACCENT, ACCENT_GRADIENT } from '../../theme/tokens'
import { CurtainReveal } from '../../components/layout/CurtainReveal'
import { DashboardPanel } from './DashboardPanel'
import { YatrasPage } from '../yatras/YatrasPage'

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <p className="text-xs font-semibold uppercase tracking-widest flex-shrink-0"
         style={{ color: '#fbbf24' }}>
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.20)' }} />
    </div>
  )
}

export function DateContextLabel({ dateStr }: { dateStr: string }) {
  const todayStr = toDateStr(new Date())
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000))
  const tomorrow  = toDateStr(new Date(Date.now() + 86_400_000))
  const { t, i18n } = useTranslation()
  const locale = i18n.language || 'en'

  let label: string
  if (dateStr === todayStr)        label = t('home.today')
  else if (dateStr === yesterday)  label = t('home.yesterday')
  else if (dateStr === tomorrow)   label = t('home.tomorrow')
  else {
    const d = new Date(dateStr + 'T00:00:00')
    label = d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <p className="text-[11px] font-semibold font-serif uppercase tracking-widest px-1"
       style={{ color: '#fbbf24' }}>
      {label}
    </p>
  )
}

export function HomePage() {
  const { t } = useTranslation()

  return (
    <CurtainReveal
      base={<DashboardPanel />}
      overlay={<YatrasPage embedded />}
      fab={
        <div className="fixed left-4 bottom-6 z-30 hidden sm:flex flex-col gap-3">
          <Link
            to="/user/practices"
            aria-label={t('settings.myPractices')}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <FaSlidersH className="w-5 h-5" style={{ color: ACCENT }} />
          </Link>
          <Link
            to="/user/practice/new"
            aria-label={t('practice.new')}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: ACCENT_GRADIENT, boxShadow: '0 4px 24px rgba(200,114,74,0.45)' }}
          >
            <FaPlus className="w-5 h-5 text-white" />
          </Link>
        </div>
      }
    />
  )
}
