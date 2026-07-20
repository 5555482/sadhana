import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaSeedling } from 'react-icons/fa'
import { PracticeForm } from '../../components/PracticeForm'
import { TopBar } from '../../components/layout/TopBar'

export function PracticeNewPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <>
      <TopBar />
      <div className="px-4 py-6 flex flex-col gap-4">
        {/* Page header — matches the visual weight of the week calendar on home */}
        <div
          className="rounded-2xl px-5 py-5 flex items-center gap-4"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.80)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
            }}
          >
            <FaSeedling className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">{t('practice.new')}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{t('practice.newSubtitle')}</p>
          </div>
        </div>

        <PracticeForm
          mode={{ type: 'user' }}
          onSuccess={() => navigate('/user/practices')}
        />
      </div>
    </>
  )
}
