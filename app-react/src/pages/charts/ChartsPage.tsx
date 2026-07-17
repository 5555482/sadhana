import { useTranslation } from 'react-i18next'

export function ChartsPage() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-64 text-text-muted">
      {t('nav.charts')} — coming in Phase 2
    </div>
  )
}
