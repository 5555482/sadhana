import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { LuWifiOff } from 'react-icons/lu'
import { FaPlus, FaSlidersH } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { practicesApi } from '../../api/practices'
import { ACCENT, ACCENT_GRADIENT } from '../../theme/tokens'
import { PracticeCard } from './PracticeCard'
import { ChartsPage } from '../charts/ChartsPage'
import { YatrasPage } from '../yatras/YatrasPage'
import { WeekCalendar, getWeekDays } from './WeekCalendar'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
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

export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <p className="text-xs font-semibold uppercase tracking-widest flex-shrink-0"
         style={{ color: '#fbbf24' }}>
        {label}
      </p>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.20)' }} />
    </div>
  )
}

export function DateContextLabel({ dateStr }: { dateStr: string }) {
  const todayStr = toDateStr(new Date())
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000))
  const tomorrow  = toDateStr(new Date(Date.now() + 86_400_000))
  const { t, i18n } = useTranslation()
  const locale = i18n.language || 'en'

  let label: string
  if (dateStr === todayStr)        label = t('home.today')
  else if (dateStr === yesterday)  label = t('home.yesterday')
  else if (dateStr === tomorrow)   label = t('home.tomorrow')
  else {
    const d = new Date(dateStr + 'T00:00:00')
    label = d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <p className="text-[11px] font-semibold font-serif uppercase tracking-widest px-1"
       style={{ color: '#fbbf24' }}>
      {label}
    </p>
  )
}

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

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') {
        qc.invalidateQueries({ queryKey: ['diary', dateStr] })
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [qc, dateStr])

  useEffect(() => {
    const week = getWeekDays(date)
    for (const day of week) {
      const ds = toDateStr(day)
      if (ds !== dateStr) {
        qc.prefetchQuery({
          queryKey: ['diary', ds],
          queryFn: () => practicesApi.getDiaryEntries(ds),
          staleTime: 60_000,
        })
      }
    }
  }, [date, qc, dateStr])

  const required = activePractices.filter((p) => p.is_required)
  const optional = activePractices.filter((p) => !p.is_required)

  return (
    <>
      {/* Desktop: practices (1/3) alongside charts (2/3). Mobile: practices only. */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start lg:max-w-[1400px] lg:mx-auto lg:px-6 lg:py-4">
      <div className="px-4 py-4 max-w-lg mx-auto w-full lg:max-w-none lg:mx-0 lg:px-0 lg:py-0 lg:col-span-1 flex flex-col gap-3">
        {/* Offline banner */}
        {!isOnline && (
          <div
            className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{
              background: 'rgba(251,191,36,0.10)',
              border: '1px solid rgba(251,191,36,0.25)',
              color: '#fbbf24',
            }}
          >
            <LuWifiOff className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
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
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                }}
              >
                <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="h-3.5 rounded-full flex-1" style={{ background: 'rgba(255,255,255,0.08)', maxWidth: '55%' }} />
                <div className="w-12 h-6 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
              </div>
            ))
          ) : (diaryQuery.isError || practicesQuery.isError) ? (
            <ErrorBanner message={t('common.error')} />
          ) : (
            <>
              {required.map((p) => (
                <PracticeCard key={p.id + '-' + dateStr} practice={p} date={dateStr} currentValue={valueMap[p.practice]} />
              ))}
              {optional.map((p) => (
                <PracticeCard key={p.id + '-' + dateStr} practice={p} date={dateStr} currentValue={valueMap[p.practice]} />
              ))}
            </>
          )}

          {/* Empty state */}
          {!practicesQuery.isLoading && !practicesQuery.isError && activePractices.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <p className="text-base-content/60 text-sm">{t('home.noPractices')}</p>

              {/* Seed defaults */}
              <button
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
                style={{
                  background: ACCENT_GRADIENT,
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(200,114,74,0.35)',
                }}
              >
                {seedMutation.isPending && <span className="loading loading-spinner loading-xs" />}
                {t('home.addStarters')}
              </button>

              <Link
                to="/user/practice/new"
                className="text-sm font-medium"
                style={{ color: ACCENT }}
              >
                {t('home.addCustom')}
              </Link>
            </div>
          )}
        </div>
      </div>

        {/* Charts (2/3) — desktop only; top-aligned with the practices column */}
        <div className="hidden lg:block lg:col-span-2">
          <ChartsPage embedded />
        </div>
      </div>

      {/* Yatras — scroll down to see (all sizes) */}
      <div className="px-4 pb-8 max-w-lg mx-auto w-full lg:max-w-[1400px] lg:px-6 mt-2">
        <YatrasPage embedded />
      </div>

      {/* Desktop FABs — manage & add practices, bottom-LEFT (mobile uses the bottom nav) */}
      <div className="fixed left-4 bottom-6 z-30 hidden sm:flex flex-col gap-3">
        <Link
          to="/user/practices"
          aria-label={t('settings.myPractices')}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          <FaSlidersH className="w-5 h-5" style={{ color: ACCENT }} />
        </Link>
        <Link
          to="/user/practice/new"
          aria-label={t('practice.new')}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: ACCENT_GRADIENT, boxShadow: '0 4px 24px rgba(200,114,74,0.45)' }}
        >
          <FaPlus className="w-5 h-5 text-white" />
        </Link>
      </div>
    </>
  )
}
