import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FaSync, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { practicesApi } from '../../api/practices'
import { PracticeCard } from './PracticeCard'
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
    (diaryQuery.data ?? []).map((e) => [e.practice, e.value]),
  )

  const prev = () => {
    const d = new Date(date)
    d.setDate(d.getDate() - 1)
    setDate(d)
  }
  const next = () => {
    const d = new Date(date)
    d.setDate(d.getDate() + 1)
    setDate(d)
  }

  return (
    <>
      <TopBar
        right={
          <button
            className="btn btn-ghost btn-sm btn-circle text-base-content/70"
            onClick={() => diaryQuery.refetch()}
            aria-label="Refresh"
          >
            <FaSync className="w-4 h-4" />
          </button>
        }
      />

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Offline banner */}
        {!isOnline && (
          <div
            className="rounded-xl px-4 py-3 text-sm text-base-content"
            style={{
              background: 'rgba(255,255,255,0.40)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.30)',
            }}
          >
            {t('home.offline')}
          </div>
        )}

        {/* Date navigator */}
        <div className="flex items-center justify-center gap-4 py-1">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors text-lg"
            onClick={prev}
            aria-label="Previous day"
          >
            ←
          </button>
          <span className="font-serif font-extralight text-white text-base tracking-wide min-w-[80px] text-center">
            {displayDate(date)}
          </span>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors text-lg"
            onClick={next}
            aria-label="Next day"
          >
            →
          </button>
        </div>

        {/* Loading */}
        {(practicesQuery.isLoading || diaryQuery.isLoading) && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md" style={{ color: '#01a386' }} />
          </div>
        )}

        {/* Practice cards */}
        <div className="flex flex-col gap-3">
          {activePractices.map((p) => (
            <PracticeCard
              key={p.id}
              practice={p}
              date={dateStr}
              currentValue={valueMap[p.practice]}
            />
          ))}

          {/* Empty state */}
          {!practicesQuery.isLoading && activePractices.length === 0 && (
            <div className="text-center py-16 flex flex-col gap-5">
              <p className="text-white/70 text-sm">{t('home.noPractices')}</p>
              <Link
                to="/user/practice/new"
                className="mx-auto px-6 h-11 rounded-full text-sm font-semibold flex items-center justify-center transition-all"
                style={{
                  background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                  color: '#134e4a',
                  boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
                }}
              >
                {t('home.addFirst')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <Link
        to="/user/practice/new"
        aria-label="Add practice"
        className="fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
          boxShadow: '0 4px 24px rgba(45,212,191,0.45)',
        }}
      >
        <FaPlus className="w-5 h-5 text-white" />
      </Link>
    </>
  )
}
