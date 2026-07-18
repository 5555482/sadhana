import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FaSync, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { practicesApi } from '../../api/practices'
import { PracticeCard } from './PracticeCard'
import { Spinner } from '../../components/ui/Spinner'
import { TopBar } from '../../components/layout/TopBar'
import useNetworkStatus from '../../hooks/useNetworkStatus'

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

function displayDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function HomePage() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date())
  const isOnline = useNetworkStatus()

  const dateStr = toDateStr(date)

  const practicesQuery = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })
  const diaryQuery = useQuery({
    queryKey: ['diary', dateStr],
    queryFn: () => practicesApi.getDiaryEntries(dateStr),
  })

  const activePractices = (practicesQuery.data ?? []).filter((p) => p.is_active)
  const valueMap = Object.fromEntries(
    (diaryQuery.data ?? []).map((e) => [e.practice, e.value])
  )

  const prev = () => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d) }
  const next = () => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d) }

  return (
    <>
      <TopBar
        right={
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => diaryQuery.refetch()}
          >
            <FaSync className="w-4 h-4" />
          </button>
        }
      />

      <div className="px-4 py-4 flex flex-col gap-4">
        {!isOnline && (
          <div className="alert alert-warning text-sm">{t('home.offline')}</div>
        )}

        <div className="flex items-center justify-center gap-4">
          <button className="btn btn-ghost btn-sm" onClick={prev}>←</button>
          <span className="font-semibold">{displayDate(date)}</span>
          <button className="btn btn-ghost btn-sm" onClick={next}>→</button>
        </div>

        {(practicesQuery.isLoading || diaryQuery.isLoading) && <Spinner />}

        <div className="flex flex-col gap-3">
          {activePractices.map((p) => (
            <PracticeCard
              key={p.id}
              practice={p}
              date={dateStr}
              currentValue={valueMap[p.practice]}
            />
          ))}
          {!practicesQuery.isLoading && activePractices.length === 0 && (
            <div className="text-center text-base-content/50 py-12 flex flex-col gap-4">
              <p>{t('home.noPractices')}</p>
              <Link to="/user/practice/new" className="btn btn-primary mx-auto">
                {t('home.addFirst')}
              </Link>
            </div>
          )}
        </div>
      </div>

      <Link
        to="/user/practice/new"
        className="btn btn-primary btn-circle btn-lg fixed bottom-20 right-4 shadow-lg z-30"
      >
        <FaPlus className="w-6 h-6" />
      </Link>
    </>
  )
}
