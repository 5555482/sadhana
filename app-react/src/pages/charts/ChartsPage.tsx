import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaShare } from 'react-icons/fa'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { chartsApi } from '../../api/charts'
import { Spinner } from '../../components/ui/Spinner'
import { useTranslation } from 'react-i18next'
import type { ChartReport } from '../../types/api'

const MOCK_DATA = Array.from({ length: 7 }, (_, i) => ({ v: Math.sin(i) * 40 + 50 }))

function ChartCard({ chart }: { chart: ChartReport }) {
  const [copied, setCopied] = useState(false)

  function share() {
    if (!chart.share_id) return
    navigator.clipboard.writeText(`${window.location.origin}/shared/${chart.share_id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{chart.name}</h3>
          {chart.share_id && (
            <button className="btn btn-ghost btn-xs gap-1" onClick={share}>
              <FaShare className="w-3 h-3" />
              {copied ? 'Copied!' : ''}
            </button>
          )}
        </div>
        <p className="text-xs text-base-content/50">{chart.date_from} – {chart.date_to}</p>
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={MOCK_DATA}>
            <Line type="monotone" dataKey="v" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ChartsPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['charts'], queryFn: chartsApi.getCharts })

  if (isLoading) return <Spinner />

  return (
    <div className="px-4 py-4 flex flex-col gap-3 pb-20">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-base-content/50">{t('charts.empty')}</p>
          <Link to="/charts/new" className="btn btn-primary">{t('charts.create')}</Link>
        </div>
      ) : (
        data.map((c) => <ChartCard key={c.id} chart={c} />)
      )}

      <Link
        to="/charts/new"
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-4 shadow-lg z-30"
      >
        <FaPlus className="w-6 h-6" />
      </Link>
    </div>
  )
}
