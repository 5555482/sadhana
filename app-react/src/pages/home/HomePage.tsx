import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { FaPlus, FaSlidersH } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { practicesApi } from '../../api/practices'
import { PracticeCard } from './PracticeCard'
import { WeekCalendar } from './WeekCalendar'
import { TopBar } from '../../components/layout/TopBar'
import useNetworkStatus from '../../hooks/useNetworkStatus'
import type { PracticeDataType } from '../../types/api'

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

const STARTER_PRACTICES: { practice: string; data_type: PracticeDataType }[] = [
  { practice: 'Wake up time',    data_type: 'Time'     },
  { practice: 'Go to sleep time', data_type: 'Time'    },
  { practice: 'Reading',         data_type: 'Bool'     },
  { practice: 'Meditation',      data_type: 'Duration' },
  { practice: 'Yoga',            data_type: 'Duration' },
]

export function HomePage() {
  const { t } = useTranslation()
  const [date, setDate] = useState(new Date())
  const isOnline = useNetworkStatus()
  const qc = useQueryClient()

  const dateStr = toDateStr(date)

  const practicesQuery = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })
  const diaryQuery = useQuery({
    queryKey: ['diary', dateStr],
    queryFn: () => practicesApi.getDiaryEntries(dateStr),
  })

  const seedMutation = useMutation({
    mutationFn: async () => {
      for (const p of STARTER_PRACTICES) {
        await practicesApi.createUserPractice(p).catch(() => {})
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['practices'] }),
  })

  const activePractices = (practicesQuery.data ?? []).filter((p) => p.is_active)
  const valueMap = Object.fromEntries(
    (diaryQuery.data ?? []).map((e) => [e.practice, e.value]),
  )

  return (
    <>
      <TopBar />

      <div className="px-4 py-4 pb-28 max-w-lg mx-auto flex flex-col gap-3">
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

        {/* Week calendar */}
        <WeekCalendar date={date} onDateChange={setDate} />

        {/* Practice cards — skeletons hold layout while loading to prevent jump */}
        <div className="flex flex-col gap-3">
          {(practicesQuery.isLoading || diaryQuery.isLoading) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl px-4 min-h-[60px] flex items-center gap-3 animate-pulse"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
              >
                <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: 'rgba(0,0,0,0.07)' }} />
                <div className="h-3.5 rounded-full flex-1" style={{ background: 'rgba(0,0,0,0.07)', maxWidth: '55%' }} />
                <div className="w-12 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(0,0,0,0.07)' }} />
              </div>
            ))
          ) : (
            <>
              {activePractices.map((p) => (
                <PracticeCard
                  key={p.id + '-' + dateStr}
                  practice={p}
                  date={dateStr}
                  currentValue={valueMap[p.practice]}
                />
              ))}
            </>
          )}

          {/* Empty state */}
          {!practicesQuery.isLoading && activePractices.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm">{t('home.noPractices')}</p>

              {/* Seed defaults */}
              <button
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
                }}
              >
                {seedMutation.isPending && <span className="loading loading-spinner loading-xs" />}
                {t('home.addStarters')}
              </button>

              <Link
                to="/user/practice/new"
                className="text-sm font-medium"
                style={{ color: '#01a386' }}
              >
                {t('home.addCustom')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* FABs */}
      <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-3 items-center">
        <Link
          to="/user/practices"
          aria-label="Edit practices"
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.90)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.80)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            color: '#01a386',
          }}
        >
          <FaSlidersH className="w-5 h-5" />
        </Link>
        <Link
          to="/user/practice/new"
          aria-label="Add practice"
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 24px rgba(45,212,191,0.45)',
          }}
        >
          <FaPlus className="w-5 h-5 text-white" />
        </Link>
      </div>
    </>
  )
}
