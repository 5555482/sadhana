import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center h-64 text-text-muted">
      {t('nav.home')} — coming in Phase 2
    </div>
  )
}
