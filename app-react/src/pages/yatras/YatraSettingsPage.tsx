import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FaCog, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { LuHash, LuTimer, LuClock, LuType, LuToggleRight, LuX } from 'react-icons/lu'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, color: string, bg: string, label: string }> = {
  Bool:     { icon: LuToggleRight, color: '#01a386', bg: 'rgba(1,163,134,0.10)',   label: 'Yes/No'   },
  Int:      { icon: LuHash,        color: '#6366f1', bg: 'rgba(99,102,241,0.10)',  label: 'Count'    },
  Duration: { icon: LuTimer,       color: '#d97706', bg: 'rgba(245,158,11,0.10)',  label: 'Duration' },
  Time:     { icon: LuClock,       color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  label: 'Time'     },
  Text:     { icon: LuType,        color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Text'     },
}

export function YatraSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState<'members' | 'practices'>('members')

  const { data, isLoading } = useQuery({
    queryKey: ['yatra', id],
    queryFn: () => yatrasApi.getYatra(id!),
  })

  const leave = useMutation({
    mutationFn: () => yatrasApi.leaveYatra(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['yatras'] })
      navigate('/yatras', { replace: true })
    },
  })

  if (isLoading) return <Spinner />
  if (!data) return null

  const initial = data.name.charAt(0).toUpperCase()

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
        {/* Header */}
        <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
            }}
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-gray-800 leading-tight truncate">{data.name}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {data.member_count} member{data.member_count === 1 ? '' : 's'} · {data.practices.length} practice{data.practices.length === 1 ? '' : 's'}
            </p>
          </div>
          <Link
            to="/yatras"
            aria-label="Close"
            className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
          >
            <LuX className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab bar */}
        <div className="rounded-2xl flex overflow-hidden" style={glass}>
          {(['members', 'practices'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 h-11 text-sm font-semibold transition-all"
              style={{
                background: tab === t ? '#01a386' : 'transparent',
                color: tab === t ? 'white' : '#6b7280',
                border: 'none',
              }}
            >
              {t === 'members' ? `Members (${data.members.length})` : `Practices (${data.practices.length})`}
            </button>
          ))}
        </div>

        {/* Members tab */}
        {tab === 'members' && (
          <div className="flex flex-col gap-2">
            {data.members.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                style={glass}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
                >
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 text-sm font-semibold text-gray-800">{m.name}</span>
              </div>
            ))}
            {data.members.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No members yet</p>
            )}
          </div>
        )}

        {/* Practices tab */}
        {tab === 'practices' && (
          <div className="flex flex-col gap-2">
            {data.practices.map((p) => {
              const meta = TYPE_META[p.data_type] ?? TYPE_META.Text
              const TypeIcon = meta.icon
              return (
                <div
                  key={p.id}
                  className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
                  style={glass}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.bg }}
                  >
                    <TypeIcon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-gray-800">{p.practice}</span>
                  <span className="text-xs font-medium flex-shrink-0" style={{ color: meta.color }}>{meta.label}</span>
                </div>
              )
            })}
            {data.practices.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No practices yet</p>
            )}
          </div>
        )}

        {/* Admin settings link */}
        {data.is_admin && (
          <Link
            to={`/yatra/${id}/admin/settings`}
            className="rounded-2xl px-4 py-4 flex items-center gap-3 no-underline transition-all"
            style={glass}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(99,102,241,0.10)' }}
            >
              <FaCog className="w-4 h-4" style={{ color: '#6366f1' }} />
            </div>
            <span className="flex-1 text-sm font-semibold text-gray-800">Admin settings</span>
            <FaChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#d1d5db' }} />
          </Link>
        )}

        {/* Leave button */}
        <button
          onClick={() => (document.getElementById('leave-modal') as HTMLDialogElement)?.showModal()}
          className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'rgba(225,29,72,0.08)',
            color: '#e11d48',
            border: '1px solid rgba(225,29,72,0.20)',
          }}
        >
          <FaSignOutAlt className="w-3.5 h-3.5" />
          Leave yatra
        </button>
      </div>

      <ConfirmModal
        id="leave-modal"
        title="Leave yatra?"
        message={`Leave "${data.name}"? You can rejoin later.`}
        confirmLabel="Leave"
        onConfirm={() => leave.mutate()}
      />
    </>
  )
}
