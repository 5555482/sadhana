import { useTranslation } from 'react-i18next'
import { useUiStore } from '../../store/uiStore'
import { HeaderMenu, type HeaderMenuItem } from './HeaderMenu'

export function HomeHeaderActions() {
  const { t } = useTranslation()
  const requestYatraCreate = useUiStore((s) => s.requestYatraCreate)

  const practices: HeaderMenuItem[] = [
    { label: t('home.addPractice'), to: '/user/practice/new' },
    { label: t('home.editPractices'), to: '/user/practices' },
  ]
  const yatras: HeaderMenuItem[] = [
    { label: t('yatras.createNewYatra'), onClick: requestYatraCreate },
    { label: t('home.viewYatras'), to: '/yatras' },
  ]
  const reports: HeaderMenuItem[] = [
    { label: t('charts.newReport'), to: '/charts/new' },
    { label: t('charts.manage'), to: '/charts' },
  ]

  return (
    <div className="flex items-center gap-2">
      <HeaderMenu label={t('home.practicesMenu')} items={practices} />
      <HeaderMenu label={t('nav.yatras')} items={yatras} />
      <HeaderMenu label={t('home.reportsMenu')} items={reports} />
    </div>
  )
}
