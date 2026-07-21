import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSeedling } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { PracticeForm } from '../../components/PracticeForm'

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function PracticeNewPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4">
      {/* Page header with close button */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={cardStyle}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <FaSeedling className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800 leading-tight">{t('practice.new')}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t('practice.newSubtitle')}</p>
        </div>
        <Link
          to="/"
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      <PracticeForm
        mode={{ type: 'user' }}
        onSuccess={() => navigate('/')}
      />
    </div>
  )
}
