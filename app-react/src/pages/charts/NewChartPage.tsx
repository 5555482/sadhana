import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { practicesApi } from '../../api/practices'
import { chartsApi } from '../../api/charts'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'
import { useTranslation } from 'react-i18next'
import type { ChartReport } from '../../types/api'

type ChartType = 'Line' | 'Bar' | 'Grid'

const PRESETS = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
]

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function today() {
  return new Date().toISOString().split('T')[0]
}

export function NewChartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState(daysAgo(30))
  const [dateTo, setDateTo] = useState(today())
  const [chartType, setChartType] = useState<ChartType>('Line')
  const [name, setName] = useState('')

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

  return (
    <div className="px-4 py-4 flex flex-col gap-6">
      <ul className="steps steps-horizontal w-full">
        {[t('charts.pickMetrics'), t('charts.dateRange'), t('charts.chartType')].map((s, i) => (
          <li key={s} className={`step ${i <= step ? 'step-primary' : ''}`}>{s}</li>
        ))}
      </ul>

      {step === 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">{t('charts.pickMetrics')}</h2>
          {practices.filter((p) => p.is_active).map((p) => (
            <label key={p.id} className="flex items-center gap-3 card bg-base-100 shadow-sm p-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={selected.includes(p.practice)}
                onChange={(e) =>
                  setSelected(e.target.checked
                    ? [...selected, p.practice]
                    : selected.filter((s) => s !== p.practice))
                }
              />
              <span>{p.practice}</span>
            </label>
          ))}
          <Button variant="primary" disabled={selected.length === 0} onClick={() => setStep(1)} className="w-full">
            Next →
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">{t('charts.dateRange')}</h2>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className="btn btn-sm btn-outline"
                onClick={() => { setDateFrom(daysAgo(p.days)); setDateTo(today()) }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="label text-sm">From</label>
              <input type="date" className="input input-bordered w-full" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="label text-sm">To</label>
              <input type="date" className="input input-bordered w-full" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(0)} className="flex-1">← Back</Button>
            <Button variant="primary" onClick={() => setStep(2)} className="flex-1">Next →</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">{t('charts.chartType')}</h2>
          {(['Line', 'Bar', 'Grid'] as ChartType[]).map((ct) => (
            <button
              key={ct}
              onClick={() => setChartType(ct)}
              className={`card bg-base-100 shadow-sm p-4 text-left border-2 transition-colors ${chartType === ct ? 'border-primary' : 'border-transparent'}`}
            >
              <span className="font-semibold">{ct}</span>
            </button>
          ))}
          <div className="flex flex-col gap-2 mt-2">
            <label className="label text-sm">Report name</label>
            <input
              className="input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My report"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Back</Button>
            <Button
              variant="primary"
              loading={mutation.isPending}
              disabled={!name}
              onClick={() => mutation.mutate()}
              className="flex-1"
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
