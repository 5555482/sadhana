import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { FaChartBar, FaChartLine, FaTh } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { practicesApi } from '../../api/practices'
import { chartsApi } from '../../api/charts'
import { Spinner } from '../../components/ui/Spinner'
import { useTranslation } from 'react-i18next'
import type { ChartReport } from '../../types/api'

type ChartType = 'Line' | 'Bar' | 'Grid'

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

const CHART_TYPES: { value: ChartType; icon: React.ElementType; label: string; desc: string }[] = [
  { value: 'Line', icon: FaChartLine, label: 'Line',  desc: 'Track trends over time'      },
  { value: 'Bar',  icon: FaChartBar,  label: 'Bar',   desc: 'Compare values by day'       },
  { value: 'Grid', icon: FaTh,        label: 'Grid',  desc: 'See activity heatmap'        },
]

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}
function today() { return new Date().toISOString().split('T')[0] }

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.95rem',
  color: '#1f2937',
  padding: '0.625rem 0.875rem',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

function onInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#01a386'
  e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)'
}
function onInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(0,0,0,0.10)'
  e.target.style.boxShadow = 'none'
}

export function NewChartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep]         = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState(daysAgo(30))
  const [dateTo, setDateTo]     = useState(today())
  const [chartType, setChartType] = useState<ChartType>('Line')
  const [name, setName]         = useState('')

  const { data: practices = [], isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })

  const mutation = useMutation({
    mutationFn: () => chartsApi.createChart({
      name,
      practices: selected,
      date_from: dateFrom,
      date_to: dateTo,
      chart_type: chartType,
    } as Omit<ChartReport, 'id' | 'share_id'>),
    onSuccess: () => navigate('/charts'),
  })

  if (isLoading) return <Spinner />

  const STEP_LABELS = [t('charts.pickMetrics'), t('charts.dateRange'), t('charts.chartType')]

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <FaChartLine className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800 leading-tight">{t('charts.create') || 'New Chart'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEP_LABELS.length}</p>
        </div>
        <Link
          to="/charts"
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 px-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col gap-1.5">
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#01a386' : 'rgba(0,0,0,0.10)' }}
            />
            <span className="text-xs font-medium truncate" style={{ color: i === step ? '#01a386' : '#9ca3af' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 0 — pick practices */}
      {step === 0 && (
        <div className="flex flex-col gap-2">
          {practices.filter((p) => p.is_active).map((p) => {
            const active = selected.includes(p.practice)
            return (
              <label
                key={p.id}
                className="rounded-2xl px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all"
                style={{
                  ...glass,
                  border: active ? '1px solid rgba(1,163,134,0.45)' : '1px solid rgba(255,255,255,0.80)',
                  boxShadow: active ? '0 4px 16px rgba(1,163,134,0.10)' : '0 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: active ? '#01a386' : 'rgba(0,0,0,0.06)',
                    border: active ? 'none' : '1.5px solid rgba(0,0,0,0.15)',
                  }}
                >
                  {active && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={active}
                  onChange={(e) =>
                    setSelected(e.target.checked
                      ? [...selected, p.practice]
                      : selected.filter((s) => s !== p.practice))
                  }
                />
                <span className="text-sm font-semibold text-gray-800">{p.practice}</span>
              </label>
            )
          })}

          <button
            onClick={() => setStep(1)}
            disabled={selected.length === 0}
            className="w-full h-12 rounded-full text-sm font-semibold mt-2 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              opacity: selected.length === 0 ? 0.45 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 1 — date range */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          {/* Presets */}
          <div className="rounded-2xl px-5 py-4 flex flex-col gap-3" style={glass}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Quick select</span>
            <div className="flex gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setDateFrom(daysAgo(p.days)); setDateTo(today()) }}
                  className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: dateFrom === daysAgo(p.days) && dateTo === today()
                      ? 'rgba(1,163,134,0.12)' : 'rgba(0,0,0,0.04)',
                    color: dateFrom === daysAgo(p.days) && dateTo === today()
                      ? '#01a386' : '#6b7280',
                    border: dateFrom === daysAgo(p.days) && dateTo === today()
                      ? '1.5px solid rgba(1,163,134,0.30)' : '1.5px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date range */}
          <div className="rounded-2xl px-5 py-4 flex flex-col gap-3" style={glass}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Custom range</span>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={inputStyle}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(0)}
              className="flex-1 h-12 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#374151', border: 'none' }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 h-12 rounded-full text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — chart type + name */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          {/* Chart type */}
          <div className="rounded-2xl p-5 flex flex-col gap-3" style={glass}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Chart type</span>
            <div className="flex flex-col gap-2">
              {CHART_TYPES.map(({ value, icon: Icon, label, desc }) => {
                const active = chartType === value
                return (
                  <button
                    key={value}
                    onClick={() => setChartType(value)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                    style={{
                      background: active ? 'rgba(1,163,134,0.08)' : 'rgba(0,0,0,0.03)',
                      border: active ? '1.5px solid rgba(1,163,134,0.40)' : '1.5px solid rgba(0,0,0,0.07)',
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? '#01a386' : '#9ca3af' }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: active ? '#01a386' : '#374151' }}>{label}</div>
                      <div className="text-xs" style={{ color: '#9ca3af' }}>{desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Report name */}
          <div className="rounded-2xl px-5 py-4 flex flex-col gap-2" style={glass}>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Report name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My weekly report"
              style={inputStyle}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-12 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#374151', border: 'none' }}
            >
              ← Back
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!name || mutation.isPending}
              className="flex-1 h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
                opacity: !name || mutation.isPending ? 0.55 : 1,
              }}
            >
              {mutation.isPending && <span className="loading loading-spinner loading-xs" />}
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
