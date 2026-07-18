import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { useTranslation } from 'react-i18next'

export function YatrasPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['yatras'], queryFn: yatrasApi.getYatras })

  if (isLoading) return <Spinner />

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {data.length === 0 && (
        <p className="text-center text-base-content/50 py-8">{t('yatras.empty')}</p>
      )}
      {data.map((y) => (
        <Link
          key={y.id}
          to={y.is_member ? `/yatra/${y.id}/settings` : `/yatra/${y.id}/join`}
          className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="card-body p-4 flex-row items-center gap-3">
            <div className="flex-1">
              <h3 className="font-semibold">{y.name}</h3>
              <p className="text-xs text-base-content/50">
                {y.member_count} members · {y.practices.length} practices
              </p>
            </div>
            {y.is_member && <span className="badge badge-success badge-sm">Member</span>}
          </div>
        </Link>
      ))}
    </div>
  )
}
