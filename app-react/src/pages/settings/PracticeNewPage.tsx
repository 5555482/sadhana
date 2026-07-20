import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PracticeForm } from '../../components/PracticeForm'
import { TopBar } from '../../components/layout/TopBar'

export function PracticeNewPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <>
      <TopBar showBack title={t('practice.new')} />
      <PracticeForm
        mode={{ type: 'user' }}
        onSuccess={() => navigate('/user/practices')}
      />
    </>
  )
}
