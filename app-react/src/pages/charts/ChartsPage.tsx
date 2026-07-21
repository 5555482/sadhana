import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaShare, FaChartLine } from 'react-icons/fa'
import { LuCopy, LuCheck } from 'react-icons/lu'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { chartsApi } from '../../api/charts'
import { Spinner } from '../../components/ui/Spinner'
import { useTranslation } from 'react-i18next'
import type { ChartReport } from '../../types/api'

const MOCK_DATA = Array.from({ length: 14 }, (_, i) => ({ v: Math.sin(i * 0.7) * 30 + 50 }))

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

function ChartCard({ chart }: { chart: ChartReport }) {
  const [copied, setCopied] = useState(false)

  function share() {
    if (!chart.share_id) return
    navigator.clipboard.writeText(`${window.location.origin}/shared/${chart.share_id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      {/* Sparkline */}
      <div style={{ height: 64, background: 'linear-gradient(180deg, rgba(1,163,134,0.06) 0%, rgba(1,163,134,0.02) 100%)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#01a386"
              dot={false}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Info row */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{chart.name}</p>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            {chart.date_from} – {chart.date_to}
          </p>
        </div>
        {chart.share_id && (
          <button
            onClick={share}
            className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-colors"
            style={{ background: 'rgba(1,163,134,0.08)', color: '#01a386' }}
            aria-label="Copy share link"
          >
            {copied ? <LuCheck className="w-3.5 h-3.5" /> : <LuCopy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}

export function ChartsPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['charts'], queryFn: chartsApi.getCharts })

  if (isLoading) return <Spinner />

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-3 pb-24">
      {/* Page header */}
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
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-tight">{t('charts.title') || 'Charts'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {data.length > 0
              ? `${data.length} report${data.length === 1 ? '' : 's'}`
              : 'No reports yet'}
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-sm" style={{ color: '#9ca3af' }}>{t('charts.empty')}</p>
          <Link
            to="/charts/new"
            className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
            }}
          >
            {t('charts.create')}
          </Link>
        </div>
      ) : (
        data.map((c) => <ChartCard key={c.id} chart={c} />)
      )}

      {/* FAB */}
      <Link
        to="/charts/new"
        aria-label="New chart"
        className="fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
          boxShadow: '0 4px 24px rgba(45,212,191,0.45)',
        }}
      >
        <FaPlus className="w-5 h-5 text-white" />
      </Link>
    </div>
  )
}
