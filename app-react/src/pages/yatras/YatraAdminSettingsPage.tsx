import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FaEdit, FaTrash, FaPlus, FaShieldAlt } from 'react-icons/fa'
import { LuCheck, LuCopy, LuLink, LuHash, LuTimer, LuClock, LuType, LuToggleRight, LuX } from 'react-icons/lu'
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

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  fontSize: '0.9rem',
  color: '#1f2937',
  padding: '0.5rem 0.875rem',
  flex: 1,
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, color: string, bg: string, label: string }> = {
  Bool:     { icon: LuToggleRight, color: '#01a386', bg: 'rgba(1,163,134,0.10)',   label: 'Yes/No'   },
  Int:      { icon: LuHash,        color: '#6366f1', bg: 'rgba(99,102,241,0.10)',  label: 'Count'    },
  Duration: { icon: LuTimer,       color: '#d97706', bg: 'rgba(245,158,11,0.10)',  label: 'Duration' },
  Time:     { icon: LuClock,       color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  label: 'Time'     },
  Text:     { icon: LuType,        color: '#6b7280', bg: 'rgba(107,114,128,0.10)', label: 'Text'     },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: '#9ca3af' }}>
      {children}
    </span>
  )
}

export function YatraAdminSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['yatra', id],
    queryFn: () => yatrasApi.getYatra(id!),
  })

  const updateName = useMutation({
    mutationFn: () => yatrasApi.updateYatra(id!, name),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['yatra', id] }); setEditingName(false) },
  })

  const removeMember = useMutation({
    mutationFn: (mId: string) => yatrasApi.removeMember(id!, mId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['yatra', id] }),
  })

  const deletePractice = useMutation({
    mutationFn: (pId: string) => yatrasApi.deleteYatraPractice(id!, pId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['yatra', id] }),
  })

  if (isLoading) return <Spinner />
  if (!data) return null

  function copyInvite() {
    navigator.clipboard.writeText(`${window.location.origin}/yatra/${id}/join`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initial = data.name.charAt(0).toUpperCase()

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
            boxShadow: '0 4px 16px rgba(124,58,237,0.28)',
          }}
        >
          <FaShieldAlt className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800 leading-tight truncate">{data.name}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Admin settings</p>
        </div>
        <Link
          to={`/yatra/${id}/settings`}
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      {/* Yatra name */}
      <SectionLabel>Yatra name</SectionLabel>
      <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={glass}>
        {editingName ? (
          <>
            <input
              style={inputStyle}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = '#01a386'; e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.10)'; e.target.style.boxShadow = 'none' }}
              onKeyDown={(e) => { if (e.key === 'Enter') updateName.mutate(); if (e.key === 'Escape') setEditingName(false) }}
            />
            <button
              onClick={() => updateName.mutate()}
              disabled={updateName.isPending}
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
              style={{ background: '#01a386', color: 'white', border: 'none' }}
            >
              <LuCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingName(false)}
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#6b7280', border: 'none' }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)' }}
            >
              {initial}
            </div>
            <span className="flex-1 text-sm font-semibold text-gray-800">{data.name}</span>
            <button
              onClick={() => { setName(data.name); setEditingName(true) }}
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
              style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)', border: 'none' }}
            >
              <FaEdit className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Invite link */}
      <SectionLabel>Invite</SectionLabel>
      <button
        onClick={copyInvite}
        className="rounded-2xl px-4 py-3.5 flex items-center gap-3 w-full text-left transition-all"
        style={glass}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: copied ? 'rgba(1,163,134,0.10)' : 'rgba(0,0,0,0.05)' }}
        >
          <LuLink className="w-4 h-4" style={{ color: copied ? '#01a386' : '#6b7280' }} />
        </div>
        <span className="flex-1 text-sm font-semibold text-gray-800">
          {copied ? 'Invite link copied!' : 'Copy invite link'}
        </span>
        {copied
          ? <LuCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#01a386' }} />
          : <LuCopy className="w-4 h-4 flex-shrink-0" style={{ color: '#d1d5db' }} />
        }
      </button>

      {/* Members */}
      <SectionLabel>Members ({data.members.length})</SectionLabel>
      <div className="flex flex-col gap-2">
        {data.members.map((m) => (
          <div key={m.id} className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={glass}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' }}
            >
              {m.name.charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 text-sm font-semibold text-gray-800">{m.name}</span>
            <button
              onClick={() => (document.getElementById(`del-member-${m.id}`) as HTMLDialogElement)?.showModal()}
              className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
              style={{ background: 'rgba(225,29,72,0.07)', color: 'rgba(225,29,72,0.55)', border: 'none' }}
            >
              <FaTrash className="w-3 h-3" />
            </button>
            <ConfirmModal
              id={`del-member-${m.id}`}
              title="Remove member?"
              message={`Remove ${m.name} from the yatra?`}
              confirmLabel="Remove"
              onConfirm={() => removeMember.mutate(m.id)}
            />
          </div>
        ))}
        {data.members.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">No members yet</p>
        )}
      </div>

      {/* Practices */}
      <SectionLabel>Practices ({data.practices.length})</SectionLabel>
      <div className="flex flex-col gap-2">
        {data.practices.map((p) => {
          const meta = TYPE_META[p.data_type] ?? TYPE_META.Text
          const TypeIcon = meta.icon
          return (
            <div key={p.id} className="rounded-2xl px-4 py-3.5 flex items-center gap-3" style={glass}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: meta.bg }}
              >
                <TypeIcon className="w-3.5 h-3.5" style={{ color: meta.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-gray-800 block truncate">{p.practice}</span>
                <span className="text-xs font-medium" style={{ color: meta.color }}>{meta.label}</span>
              </div>
              <Link
                to={`/yatra/${id}/practice/${p.id}/edit`}
                className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
                style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
              >
                <FaEdit className="w-3 h-3" />
              </Link>
              <button
                onClick={() => (document.getElementById(`del-practice-${p.id}`) as HTMLDialogElement)?.showModal()}
                className="w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors"
                style={{ background: 'rgba(225,29,72,0.07)', color: 'rgba(225,29,72,0.55)', border: 'none' }}
              >
                <FaTrash className="w-3 h-3" />
              </button>
              <ConfirmModal
                id={`del-practice-${p.id}`}
                title="Delete practice?"
                message={`Delete "${p.practice}"?`}
                confirmLabel="Delete"
                onConfirm={() => deletePractice.mutate(p.id)}
              />
            </div>
          )
        })}
      </div>

      {/* Add practice FAB */}
      <Link
        to={`/yatra/${id}/practice/new`}
        aria-label="Add practice"
        className="fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          boxShadow: '0 4px 24px rgba(124,58,237,0.35)',
        }}
      >
        <FaPlus className="w-5 h-5 text-white" />
      </Link>
    </div>
  )
}
