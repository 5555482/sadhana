import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaUsers, FaPlus, FaCog } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { yatrasApi } from '../../api/yatras'
import { TopBar } from '../../components/layout/TopBar'
import { Spinner } from '../../components/ui/Spinner'
import type { UserYatraDataRow } from '../../types/api'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const SELECTED_YATRA_KEY = 'selected_yatra'

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'object') {
    const v = val as Record<string, unknown>
    if ('Bool' in v) return (v.Bool as boolean) ? '✓' : '✗'
    if ('Int' in v) return String(v.Int)
    if ('Duration' in v) {
      const min = v.Duration as number
      if (min === 0) return '—'
      if (min < 60) return `${min}m`
      const h = Math.floor(min / 60), m = min % 60
      return m === 0 ? `${h}h` : `${h}h ${m}m`
    }
    if ('Time' in v) {
      const t = v.Time as { h: number; m: number }
      return `${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}`
    }
    if ('Text' in v) return (v.Text as string) || '—'
  }
  return String(val)
}

function trendSymbol(arrow: UserYatraDataRow['trend_arrow']): string {
  if (arrow === 'Up') return '↑'
  if (arrow === 'Down') return '↓'
  if (arrow === 'Flat') return '→'
  return '—'
}

function trendColor(arrow: UserYatraDataRow['trend_arrow']): string {
  if (arrow === 'Up') return '#16a34a'
  if (arrow === 'Down') return '#dc2626'
  return '#9ca3af'
}

export function YatrasPage() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const today = todayStr()

  const [selectedId, setSelectedId] = useState<string | null>(
    () => localStorage.getItem(SELECTED_YATRA_KEY),
  )

  const yatraListQuery = useQuery({
    queryKey: ['yatras'],
    queryFn: yatrasApi.getYatras,
  })
  const yatras = yatraListQuery.data ?? []

  const selectedYatra = yatras.find(y => y.id === selectedId) ?? yatras[0] ?? null

  useEffect(() => {
    if (selectedYatra && selectedYatra.id !== selectedId) {
      setSelectedId(selectedYatra.id)
      localStorage.setItem(SELECTED_YATRA_KEY, selectedYatra.id)
    }
  }, [selectedYatra?.id])

  const dataQuery = useQuery({
    queryKey: ['yatra-data', selectedYatra?.id, today],
    queryFn: () => yatrasApi.getYatraData(selectedYatra!.id, today),
    enabled: !!selectedYatra,
  })

  const createMutation = useMutation({
    mutationFn: yatrasApi.createYatra,
    onSuccess: (newYatra) => {
      qc.invalidateQueries({ queryKey: ['yatras'] })
      setSelectedId(newYatra.id)
      localStorage.setItem(SELECTED_YATRA_KEY, newYatra.id)
    },
  })

  const handleCreate = () => {
    const name = window.prompt('New yatra name:')?.trim()
    if (name) createMutation.mutate(name)
  }

  const handleSelect = (id: string) => {
    setSelectedId(id)
    localStorage.setItem(SELECTED_YATRA_KEY, id)
  }

  const data = dataQuery.data
  const showStability = selectedYatra?.show_stability_metrics ?? false

  return (
    <>
      <TopBar />
      <div className="px-4 py-4 pb-28 max-w-2xl mx-auto flex flex-col gap-3">

        {/* Header card: icon + selector + settings + create */}
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={glass}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              boxShadow: '0 4px 12px rgba(1,163,134,0.28)',
            }}
          >
            <FaUsers className="w-4 h-4 text-white" />
          </div>

          {yatras.length > 0 ? (
            <select
              value={selectedYatra?.id ?? ''}
              onChange={e => handleSelect(e.target.value)}
              className="flex-1 text-sm font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
            >
              {yatras.map(y => (
                <option key={y.id} value={y.id}>{y.name}</option>
              ))}
            </select>
          ) : (
            <span className="flex-1 text-sm text-gray-400">No yatras yet</span>
          )}

          {selectedYatra && (
            <Link
              to={`/yatra/${selectedYatra.id}/settings`}
              className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ color: '#01a386', background: 'rgba(1,163,134,0.08)' }}
            >
              <FaCog className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleCreate}
            className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
            style={{ color: '#01a386', background: 'rgba(1,163,134,0.08)', border: 'none' }}
          >
            <FaPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Loading */}
        {(yatraListQuery.isLoading || dataQuery.isLoading) && (
          <div className="flex justify-center py-10"><Spinner /></div>
        )}

        {/* Empty state */}
        {!yatraListQuery.isLoading && yatras.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(1,163,134,0.08)' }}
            >
              <FaUsers className="w-7 h-7" style={{ color: '#01a386' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {t('yatras.empty') || 'No yatras yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Join or create a group practice circle</p>
            </div>
            <Link
              to="/yatra/join"
              className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              }}
            >
              Join a Yatra
            </Link>
            <button
              onClick={handleCreate}
              className="text-sm font-medium"
              style={{ color: '#01a386', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              or create new
            </button>
          </div>
        )}

        {/* Data grid */}
        {data && !dataQuery.isLoading && (
          <div className="rounded-2xl overflow-hidden" style={glass}>
            <div className="overflow-x-auto">
              <table className="text-sm" style={{ minWidth: 'max-content', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.01)' }}>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: '#9ca3af' }}>
                      Sadhaka
                    </th>
                    {showStability && (
                      <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: '#9ca3af' }}>
                        Trend
                      </th>
                    )}
                    {data.practices.map(p => (
                      <th
                        key={p.id}
                        className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                        style={{ color: '#9ca3af' }}
                      >
                        {p.practice}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.data.length === 0 && (
                    <tr>
                      <td
                        colSpan={data.practices.length + (showStability ? 2 : 1)}
                        className="px-4 py-10 text-center text-sm text-gray-400"
                      >
                        No entries for today yet
                      </td>
                    </tr>
                  )}
                  {data.data.map((row, i) => (
                    <tr
                      key={row.user_id}
                      style={{ borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : undefined }}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        {row.user_name}
                      </td>
                      {showStability && (
                        <td
                          className="px-3 py-3 text-center font-bold text-base"
                          style={{ color: trendColor(row.trend_arrow) }}
                        >
                          {trendSymbol(row.trend_arrow)}
                        </td>
                      )}
                      {row.row.map((val, j) => (
                        <td key={j} className="px-3 py-3 text-center" style={{ color: '#374151' }}>
                          {formatValue(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Statistics */}
        {data && data.statistics.length > 0 && (
          <div className="rounded-2xl px-4 py-4 flex flex-col gap-1" style={glass}>
            <span className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>
              Statistics
            </span>
            {data.statistics.map((stat, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-1.5"
                style={{ borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : undefined }}
              >
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className="text-sm font-bold text-gray-800">
                  {stat.value !== null ? formatValue(stat.value) : '—'}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* FAB — Join a yatra */}
      <Link
        to="/yatra/join"
        aria-label="Join yatra"
        className="fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
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
