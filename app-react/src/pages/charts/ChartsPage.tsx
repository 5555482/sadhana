import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaPlus, FaChartLine, FaTrash, FaTh } from 'react-icons/fa'
import { LuCopy, LuCheck, LuChevronDown, LuChevronUp, LuX, LuChartLine } from 'react-icons/lu'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { chartsApi } from '../../api/charts'
import type { Report, ReportDefinition, TraceType, PracticeTrace, ReportDuration } from '../../api/charts'
import { practicesApi } from '../../api/practices'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { useAuthStore } from '../../store/authStore'
import type { UserPractice } from '../../types/api'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const ACCENT = '#01a386'
const TRACE_COLORS = ['#01a386', '#6366f1', '#d97706', '#e11d48', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981']

const DURATIONS: { label: string; value: ReportDuration }[] = [
  { label: '1W', value: 'Week' },
  { label: '1M', value: 'Month' },
  { label: '3M', value: 'Quarter' },
  { label: '6M', value: 'HalfYear' },
  { label: '1Y', value: 'Year' },
  { label: 'All', value: 'AllData' },
]

const ALL_PRACTICES_ID = '__all__'

function isGrid(def: ReportDefinition): def is { Grid: { practices: string[] } } {
  return 'Grid' in def
}

function traceLabel(type_: TraceType): string {
  if (type_ === 'Bar') return 'Bar'
  if (type_ === 'Dot') return 'Dot'
  if (typeof type_ === 'object' && 'Line' in type_) return 'Line'
  return '?'
}

function TraceTypeBadge({ type_ }: { type_: TraceType }) {
  const label = traceLabel(type_)
  const color = label === 'Bar' ? '#6366f1' : label === 'Dot' ? '#d97706' : ACCENT
  return (
    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: `${color}18`, color }}>
      {label}
    </span>
  )
}

function valueToNumber(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') return raw
  if (typeof raw === 'boolean') return raw ? 1 : 0
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if ('Int' in obj) return obj.Int as number
    if ('Bool' in obj) return (obj.Bool as boolean) ? 1 : 0
    if ('Duration' in obj) return obj.Duration as number
    if ('Time' in obj) {
      const t = obj.Time as { h: number; m: number }
      return t.h * 60 + t.m
    }
  }
  return null
}

function shortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

type ChartDataRow = { date: string; [key: string]: number | null | string }

function buildChartData(
  rawValues: { cob_date: string; practice: string; value: unknown }[],
  practiceNames: string[],
): ChartDataRow[] {
  const dateMap = new Map<string, ChartDataRow>()
  for (const entry of rawValues) {
    const date = shortDate(entry.cob_date)
    if (!dateMap.has(date)) dateMap.set(date, { date })
    const row = dateMap.get(date)!
    if (practiceNames.includes(entry.practice)) {
      row[entry.practice] = valueToNumber(entry.value)
    }
  }
  return Array.from(dateMap.values())
}

// ─── Main chart panel ───────────────────────────────────────────────────────

interface ChartPanelProps {
  report: Report | null  // null = show all practices
  practices: UserPractice[]
  practiceMap: Record<string, string>
}

function ChartPanel({ report, practices, practiceMap }: ChartPanelProps) {
  const [duration, setDuration] = useState<ReportDuration>('Month')
  const todayCob = new Date().toISOString().slice(0, 10)

  const { data: rawValues = [], isLoading } = useQuery({
    queryKey: ['report-data', todayCob, duration],
    queryFn: () => chartsApi.getReportData(todayCob, duration),
  })

  // Build traces for "all practices" (every active practice as a Line)
  const activePractices = practices.filter(p => p.is_active)

  const traces: { name: string; type_: TraceType; color: string }[] = report === null
    ? activePractices.map((p, i) => ({
        name: p.practice,
        type_: { Line: { style: 'Regular' as const } },
        color: TRACE_COLORS[i % TRACE_COLORS.length],
      }))
    : isGrid(report.definition)
      ? report.definition.Grid.practices.map((pid, i) => ({
          name: practiceMap[pid] ?? pid,
          type_: { Line: { style: 'Regular' as const } } as TraceType,
          color: TRACE_COLORS[i % TRACE_COLORS.length],
        }))
      : report.definition.Graph.traces.map((t, i) => ({
          name: practiceMap[t.practice] ?? t.practice,
          type_: t.type_,
          color: TRACE_COLORS[i % TRACE_COLORS.length],
        }))

  const practiceNames = traces.map(t => t.name)
  const chartData = buildChartData(rawValues, practiceNames)
  const isGridReport = report !== null && isGrid(report.definition)

  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      {/* Duration strip */}
      <div className="px-4 pt-3 pb-2 flex gap-1.5 flex-wrap items-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <span className="text-xs font-semibold text-gray-400 mr-1">Duration</span>
        {DURATIONS.map(d => (
          <button
            key={d.value}
            onClick={() => setDuration(d.value)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: duration === d.value ? ACCENT : 'rgba(0,0,0,0.05)',
              color: duration === d.value ? 'white' : '#6b7280',
              border: 'none',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Chart body */}
      <div className="px-2 py-4">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : chartData.length === 0 || practiceNames.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2">
            <p className="text-sm text-gray-400">No data for this period</p>
          </div>
        ) : isGridReport ? (
          <GridTable chartData={chartData} practiceNames={practiceNames} />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              {traces.map(({ name, type_, color }) => {
                const label = traceLabel(type_)
                if (label === 'Bar') {
                  return <Bar key={name} dataKey={name} fill={color} radius={[2, 2, 0, 0]} maxBarSize={20} />
                }
                if (label === 'Dot') {
                  return (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke="none"
                      strokeWidth={0}
                      dot={{ r: 4, fill: color, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: color }}
                      name={name}
                    />
                  )
                }
                const isSquare = typeof type_ === 'object' && 'Line' in type_ && type_.Line.style === 'Square'
                return (
                  <Line
                    key={name}
                    type={isSquare ? 'stepAfter' : 'monotone'}
                    dataKey={name}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name={name}
                  />
                )
              })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

function GridTable({ chartData, practiceNames }: { chartData: ChartDataRow[]; practiceNames: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className="text-left px-2 py-1.5 font-semibold" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Date</th>
            {practiceNames.map(name => (
              <th key={name} className="text-right px-2 py-1.5 font-semibold" style={{ color: '#9ca3af', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chartData.slice(-14).map((row, i) => (
            <tr key={row.date} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
              <td className="px-2 py-1.5 text-gray-500">{row.date}</td>
              {practiceNames.map(name => (
                <td key={name} className="px-2 py-1.5 text-right text-gray-700">
                  {row[name] == null ? '—' : String(row[name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Report picker dropdown ──────────────────────────────────────────────────

function ReportPicker({
  reports,
  selectedId,
  onSelect,
}: {
  reports: Report[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOut)
    return () => document.removeEventListener('mousedown', onClickOut)
  }, [])

  const selectedLabel = selectedId === ALL_PRACTICES_ID
    ? 'All practices'
    : reports.find(r => r.id === selectedId)?.name ?? 'All practices'

  const options = [
    { id: ALL_PRACTICES_ID, label: 'All practices', icon: <FaChartLine className="w-3.5 h-3.5" /> },
    ...reports.map(r => ({
      id: r.id,
      label: r.name,
      icon: isGrid(r.definition)
        ? <FaTh className="w-3.5 h-3.5" />
        : <FaChartLine className="w-3.5 h-3.5" />,
    })),
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs font-semibold transition-all"
        style={{
          background: 'rgba(0,0,0,0.05)',
          color: '#374151',
          border: 'none',
          maxWidth: 150,
        }}
      >
        <LuChartLine className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
        <span className="truncate">{selectedLabel}</span>
        {open ? <LuChevronUp className="w-3 h-3 flex-shrink-0 ml-0.5" /> : <LuChevronDown className="w-3 h-3 flex-shrink-0 ml-0.5" />}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 rounded-2xl overflow-hidden min-w-44"
          style={{ ...glass, boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}
        >
          {options.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id); setOpen(false) }}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors"
              style={{
                background: selectedId === opt.id ? 'rgba(1,163,134,0.06)' : 'transparent',
                color: selectedId === opt.id ? ACCENT : '#374151',
                border: 'none',
                borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                fontWeight: selectedId === opt.id ? 600 : 400,
              }}
            >
              <span style={{ color: selectedId === opt.id ? ACCENT : '#9ca3af' }}>{opt.icon}</span>
              <span className="truncate">{opt.label}</span>
              {selectedId === opt.id && <LuCheck className="w-3.5 h-3.5 ml-auto flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Manage report card ──────────────────────────────────────────────────────

function ReportCard({
  report,
  practiceMap,
  practices,
}: {
  report: Report
  practiceMap: Record<string, string>
  practices: UserPractice[]
}) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [addPracticeId, setAddPracticeId] = useState('')
  const [addTraceType, setAddTraceType] = useState<'Line' | 'Bar' | 'Dot'>('Line')
  const isGridType = isGrid(report.definition)

  const updateMutation = useMutation({
    mutationFn: (def: ReportDefinition) => chartsApi.updateReport(report.id, report.name, def),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })

  function removeItem(itemId: string) {
    let newDef: ReportDefinition
    if (isGrid(report.definition)) {
      newDef = { Grid: { practices: report.definition.Grid.practices.filter(p => p !== itemId) } }
    } else {
      newDef = { Graph: { ...report.definition.Graph, traces: report.definition.Graph.traces.filter(t => t.practice !== itemId) } }
    }
    updateMutation.mutate(newDef)
  }

  function addItem() {
    if (!addPracticeId) return
    let newDef: ReportDefinition
    if (isGrid(report.definition)) {
      if (report.definition.Grid.practices.includes(addPracticeId)) return
      newDef = { Grid: { practices: [...report.definition.Grid.practices, addPracticeId] } }
    } else {
      if (report.definition.Graph.traces.some(t => t.practice === addPracticeId)) return
      const type_: TraceType = addTraceType === 'Line'
        ? { Line: { style: 'Regular' } }
        : addTraceType === 'Bar' ? 'Bar' : 'Dot'
      const newTrace: PracticeTrace = { label: null, type_, practice: addPracticeId, y_axis: null, show_average: true }
      newDef = { Graph: { ...report.definition.Graph, traces: [...report.definition.Graph.traces, newTrace] } }
    }
    updateMutation.mutate(newDef)
    setAddPracticeId('')
  }

  const currentIds = isGrid(report.definition)
    ? report.definition.Grid.practices
    : report.definition.Graph.traces.map(t => t.practice)
  const currentTraces = isGrid(report.definition) ? [] : report.definition.Graph.traces

  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isGridType ? 'rgba(99,102,241,0.10)' : 'rgba(1,163,134,0.10)' }}
        >
          {isGridType
            ? <FaTh className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
            : <FaChartLine className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{report.name}</p>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
            {isGridType ? 'Grid' : 'Graph'} · {currentIds.length} practice{currentIds.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={() => (document.getElementById(`del-report-${report.id}`) as HTMLDialogElement)?.showModal()}
          className="w-7 h-7 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'rgba(225,29,72,0.07)', color: 'rgba(225,29,72,0.55)', border: 'none' }}
        >
          <FaTrash className="w-3 h-3" />
        </button>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-7 h-7 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: '#6b7280', border: 'none' }}
        >
          {open ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {currentIds.length > 0 ? (
            <div className="px-4 py-2 flex flex-col gap-1">
              {isGrid(report.definition)
                ? report.definition.Grid.practices.map(pid => (
                    <div key={pid} className="flex items-center gap-2 py-0.5">
                      <span className="flex-1 text-xs text-gray-600">{practiceMap[pid] ?? pid}</span>
                      <button onClick={() => removeItem(pid)} className="w-5 h-5 flex items-center justify-center rounded-lg" style={{ background: 'rgba(0,0,0,0.05)', color: '#9ca3af', border: 'none' }}>
                        <LuX className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                : currentTraces.map(trace => (
                    <div key={trace.practice} className="flex items-center gap-2 py-0.5">
                      <TraceTypeBadge type_={trace.type_} />
                      <span className="flex-1 text-xs text-gray-600">{practiceMap[trace.practice] ?? trace.practice}</span>
                      <button onClick={() => removeItem(trace.practice)} className="w-5 h-5 flex items-center justify-center rounded-lg" style={{ background: 'rgba(0,0,0,0.05)', color: '#9ca3af', border: 'none' }}>
                        <LuX className="w-3 h-3" />
                      </button>
                    </div>
                  ))
              }
            </div>
          ) : (
            <p className="px-4 py-2 text-xs text-gray-400">No practices added yet</p>
          )}

          <div className="px-4 pb-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.625rem' }}>
            <select
              value={addPracticeId}
              onChange={e => setAddPracticeId(e.target.value)}
              className="flex-1 text-sm rounded-xl px-3 h-9 focus:outline-none"
              style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: addPracticeId ? '#1f2937' : '#9ca3af' }}
            >
              <option value="">+ Practice…</option>
              {practices.filter(p => p.is_active && !currentIds.includes(p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.practice}</option>
              ))}
            </select>
            {!isGridType && (
              <select
                value={addTraceType}
                onChange={e => setAddTraceType(e.target.value as 'Line' | 'Bar' | 'Dot')}
                className="text-sm rounded-xl px-2 h-9 focus:outline-none flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: '#374151' }}
              >
                <option value="Line">Line</option>
                <option value="Bar">Bar</option>
                <option value="Dot">Dot</option>
              </select>
            )}
            <button
              onClick={addItem}
              disabled={!addPracticeId || updateMutation.isPending}
              className="h-9 px-4 rounded-xl text-sm font-semibold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)', color: 'white', border: 'none', opacity: addPracticeId ? 1 : 0.4 }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        id={`del-report-${report.id}`}
        title="Delete report?"
        message={`Delete "${report.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => chartsApi.deleteReport(report.id).then(() => qc.invalidateQueries({ queryKey: ['reports'] }))}
      />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ChartsPage() {
  const user = useAuthStore(s => s.user)
  const { data: reports = [], isLoading: reportsLoading } = useQuery({ queryKey: ['reports'], queryFn: chartsApi.getReports })
  const { data: practices = [] } = useQuery({ queryKey: ['practices'], queryFn: practicesApi.getUserPractices })
  const [selectedId, setSelectedId] = useState(ALL_PRACTICES_ID)
  const [shareCopied, setShareCopied] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)

  const practiceMap = Object.fromEntries(practices.map(p => [p.id, p.practice]))
  const selectedReport = selectedId === ALL_PRACTICES_ID ? null : (reports.find(r => r.id === selectedId) ?? null)

  function copyShareLink() {
    if (!user) return
    navigator.clipboard.writeText(`${window.location.origin}/shared/${user.id}`)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  if (reportsLoading) return <Spinner />

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-3 pb-24">
        {/* Header */}
        <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={glass}>
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)', boxShadow: '0 4px 16px rgba(1,163,134,0.30)' }}
          >
            <FaChartLine className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-gray-800 leading-tight">Charts</h1>
          </div>
          {/* Report picker */}
          <ReportPicker reports={reports} selectedId={selectedId} onSelect={setSelectedId} />
          {/* Share */}
          <button
            onClick={copyShareLink}
            className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: shareCopied ? 'rgba(1,163,134,0.12)' : 'rgba(0,0,0,0.05)', color: shareCopied ? ACCENT : '#6b7280', border: 'none' }}
          >
            {shareCopied ? <LuCheck className="w-3.5 h-3.5" /> : <LuCopy className="w-3.5 h-3.5" />}
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {/* Chart panel */}
        <ChartPanel
          report={selectedReport}
          practices={practices}
          practiceMap={practiceMap}
        />

        {/* Manage reports section */}
        {reports.length > 0 && (
          <div className="rounded-2xl overflow-hidden" style={glass}>
            <button
              onClick={() => setManageOpen(o => !o)}
              className="w-full px-4 py-3 flex items-center gap-2 text-left"
              style={{ background: 'transparent', border: 'none' }}
            >
              <span className="text-xs font-semibold text-gray-500 flex-1">Manage reports ({reports.length})</span>
              {manageOpen ? <LuChevronUp className="w-4 h-4 text-gray-400" /> : <LuChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {manageOpen && (
              <div className="px-3 pb-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                {reports.map(r => (
                  <ReportCard key={r.id} report={r} practiceMap={practiceMap} practices={practices} />
                ))}
              </div>
            )}
          </div>
        )}

        {reports.length === 0 && (
          <p className="text-xs text-center" style={{ color: '#9ca3af' }}>
            No custom reports yet —{' '}
            <Link to="/charts/new" style={{ color: ACCENT }}>create one</Link>
          </p>
        )}
      </div>

      <Link
        to="/charts/new"
        aria-label="New report"
        className="fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)', boxShadow: '0 4px 24px rgba(45,212,191,0.45)' }}
      >
        <FaPlus className="w-5 h-5 text-white" />
      </Link>
    </>
  )
}
