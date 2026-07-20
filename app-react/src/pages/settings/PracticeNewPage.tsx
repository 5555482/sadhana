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
      <TopBar showBack />
      <div className="px-4 pt-6 pb-2 max-w-lg mx-auto flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)', boxShadow: '0 4px 16px rgba(1,163,134,0.30)' }}
        >
          <FaSeedling className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight">{t('practice.new')}</h1>
          <p className="text-xs text-gray-400">{t('practice.newSubtitle')}</p>
        </div>
      </div>
      <PracticeForm
        mode={{ type: 'user' }}
        onSuccess={() => navigate('/user/practices')}
      />
    </>
  )
}
