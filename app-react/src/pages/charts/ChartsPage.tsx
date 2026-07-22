import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaPlus, FaChartLine, FaTrash, FaTh } from 'react-icons/fa'
import { LuCopy, LuCheck, LuChevronDown, LuChevronUp, LuX } from 'react-icons/lu'
import { chartsApi } from '../../api/charts'
import type { Report, ReportDefinition, TraceType, PracticeTrace } from '../../api/charts'
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
    <span
      className="text-xs font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  )
}

function ReportCard({
  report,
  practiceMap,
  practices,
}: {
  report: Report
  practiceMap: Record<string, string>  // id → name
  practices: UserPractice[]
}) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  // add-trace form state
  const [addPracticeId, setAddPracticeId] = useState('')
  const [addTraceType, setAddTraceType] = useState<'Line' | 'Bar' | 'Dot'>('Line')

  const isGridType = isGrid(report.definition)

  const updateMutation = useMutation({
    mutationFn: (def: ReportDefinition) => chartsApi.updateReport(report.id, report.name, def),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })

  // Remove a trace / practice from the report
  function removeItem(itemId: string) {
    let newDef: ReportDefinition
    if (isGrid(report.definition)) {
      newDef = { Grid: { practices: report.definition.Grid.practices.filter(p => p !== itemId) } }
    } else {
      newDef = { Graph: { ...report.definition.Graph, traces: report.definition.Graph.traces.filter(t => t.practice !== itemId) } }
    }
    updateMutation.mutate(newDef)
  }

  // Add a trace / practice to the report
  function addItem() {
    if (!addPracticeId) return
    let newDef: ReportDefinition
    if (isGrid(report.definition)) {
      if (report.definition.Grid.practices.includes(addPracticeId)) return
      newDef = { Grid: { practices: [...report.definition.Grid.practices, addPracticeId] } }
    } else {
      const alreadyHas = report.definition.Graph.traces.some(t => t.practice === addPracticeId)
      if (alreadyHas) return
      const type_: TraceType = addTraceType === 'Line'
        ? { Line: { style: 'Regular' } }
        : addTraceType === 'Bar' ? 'Bar' : 'Dot'
      const newTrace: PracticeTrace = { label: null, type_, practice: addPracticeId, y_axis: null, show_average: true }
      newDef = { Graph: { ...report.definition.Graph, traces: [...report.definition.Graph.traces, newTrace] } }
    }
    updateMutation.mutate(newDef)
    setAddPracticeId('')
  }

  // Collect current practice IDs for display
  const currentIds = isGrid(report.definition)
    ? report.definition.Grid.practices
    : report.definition.Graph.traces.map(t => t.practice)
  const currentTraces = isGrid(report.definition) ? [] : report.definition.Graph.traces

  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      {/* Header row */}
      <div className="px-4 py-3.5 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isGridType ? 'rgba(99,102,241,0.10)' : 'rgba(1,163,134,0.10)' }}
        >
          {isGridType
            ? <FaTh className="w-4 h-4" style={{ color: '#6366f1' }} />
            : <FaChartLine className="w-4 h-4" style={{ color: ACCENT }} />
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
          className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'rgba(225,29,72,0.07)', color: 'rgba(225,29,72,0.55)', border: 'none' }}
        >
          <FaTrash className="w-3 h-3" />
        </button>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: '#6b7280', border: 'none' }}
        >
          {open ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {/* Trace / practice list */}
          {currentIds.length > 0 ? (
            <div className="px-4 pt-3 pb-2 flex flex-col gap-1.5">
              {isGrid(report.definition)
                ? report.definition.Grid.practices.map(pid => (
                    <div key={pid} className="flex items-center gap-2 py-1">
                      <span className="flex-1 text-sm text-gray-700">{practiceMap[pid] ?? pid}</span>
                      <button
                        onClick={() => removeItem(pid)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.05)', color: '#9ca3af', border: 'none' }}
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                : currentTraces.map(trace => (
                    <div key={trace.practice} className="flex items-center gap-2 py-1">
                      <TraceTypeBadge type_={trace.type_} />
                      <span className="flex-1 text-sm text-gray-700">{practiceMap[trace.practice] ?? trace.practice}</span>
                      <button
                        onClick={() => removeItem(trace.practice)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg"
                        style={{ background: 'rgba(0,0,0,0.05)', color: '#9ca3af', border: 'none' }}
                      >
                        <LuX className="w-3 h-3" />
                      </button>
                    </div>
                  ))
              }
            </div>
          ) : (
            <p className="px-4 py-3 text-xs text-gray-400">No practices added yet</p>
          )}

          {/* Add trace row */}
          <div className="px-4 pb-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem' }}>
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
              className="h-9 px-4 rounded-xl text-sm font-semibold flex-shrink-0 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                border: 'none',
                opacity: addPracticeId ? 1 : 0.4,
              }}
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

export function ChartsPage() {
  const user = useAuthStore(s => s.user)
  const { data: reports = [], isLoading: reportsLoading } = useQuery({ queryKey: ['reports'], queryFn: chartsApi.getReports })
  const { data: practices = [] } = useQuery({ queryKey: ['practices'], queryFn: practicesApi.getUserPractices })
  const [shareCopied, setShareCopied] = useState(false)

  // Build id→name map
  const practiceMap = Object.fromEntries(practices.map(p => [p.id, p.practice]))

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
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-gray-800 leading-tight">Charts</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {reports.length > 0 ? `${reports.length} report${reports.length === 1 ? '' : 's'}` : 'No reports yet'}
            </p>
          </div>
          {/* Share my charts link */}
          <button
            onClick={copyShareLink}
            className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-all"
            style={{
              background: shareCopied ? 'rgba(1,163,134,0.12)' : 'rgba(0,0,0,0.05)',
              color: shareCopied ? ACCENT : '#6b7280',
              border: 'none',
            }}
            title="Copy link to share your reports"
          >
            {shareCopied ? <LuCheck className="w-3.5 h-3.5" /> : <LuCopy className="w-3.5 h-3.5" />}
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-sm" style={{ color: '#9ca3af' }}>No reports yet — create your first one</p>
            <Link
              to="/charts/new"
              className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              }}
            >
              Create report
            </Link>
          </div>
        ) : (
          reports.map(r => (
            <ReportCard key={r.id} report={r} practiceMap={practiceMap} practices={practices} />
          ))
        )}
      </div>

      {/* FAB */}
      <Link
        to="/charts/new"
        aria-label="New report"
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
