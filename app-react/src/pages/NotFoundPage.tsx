import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LuCompass } from 'react-icons/lu'
import { ACCENT_GRADIENT, SURFACE_2, BORDER } from '../theme/tokens'

const glass: React.CSSProperties = {
  background: SURFACE_2,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `1px solid ${BORDER}`,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
}

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl px-8 py-12 flex flex-col items-center gap-5 text-center" style={glass}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(200,114,74,0.10)' }}
        >
          <LuCompass className="w-8 h-8" style={{ color: '#c8724a' }} />
        </div>
        <div>
          <p className="text-5xl font-bold text-gray-200">404</p>
          <p className="text-base font-semibold text-base-content mt-2">{t('notFound.title')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('notFound.message')}</p>
        </div>
        <Link
          to="/"
          className="px-8 h-11 rounded-full text-sm font-semibold flex items-center no-underline"
          style={{
            background: ACCENT_GRADIENT,
            color: 'white',
            boxShadow: '0 4px 20px rgba(200,114,74,0.35)',
          }}
        >
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  )
}
