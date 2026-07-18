import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash, FaLink, FaCheck } from 'react-icons/fa'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'

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

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <div className="card bg-base-100 shadow-sm p-4 flex-row items-center gap-3">
        {editingName ? (
          <>
            <input
              className="input input-bordered flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-primary btn-sm btn-circle" onClick={() => updateName.mutate()}>
              <FaCheck className="w-3 h-3" />
            </button>
          </>
        ) : (
          <>
            <h2 className="font-semibold flex-1">{data.name}</h2>
            <button
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => { setName(data.name); setEditingName(true) }}
            >
              <FaEdit className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <button className="btn btn-outline btn-sm gap-2" onClick={copyInvite}>
        <FaLink className="w-4 h-4" />
        {copied ? 'Copied!' : 'Copy invite link'}
      </button>

      <h3 className="font-semibold">Members</h3>
      {data.members.map((m) => (
        <div key={m.id} className="card bg-base-100 shadow-sm p-3 flex-row items-center gap-3">
          <span className="flex-1">{m.name}</span>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => (document.getElementById(`del-member-${m.id}`) as HTMLDialogElement)?.showModal()}
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

      <h3 className="font-semibold">Practices</h3>
      {data.practices.map((p) => (
        <div key={p.id} className="card bg-base-100 shadow-sm p-3 flex-row items-center gap-3">
          <span className="flex-1">{p.practice}</span>
          <span className="badge badge-ghost badge-sm">{p.data_type}</span>
          <Link to={`/yatra/${id}/practice/${p.id}/edit`} className="btn btn-ghost btn-xs btn-circle">
            <FaEdit className="w-3 h-3" />
          </Link>
          <button
            className="btn btn-ghost btn-xs btn-circle text-error"
            onClick={() => (document.getElementById(`del-practice-${p.id}`) as HTMLDialogElement)?.showModal()}
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
      ))}

      <Link to={`/yatra/${id}/practice/new`} className="btn btn-primary w-full">
        + Add practice
      </Link>
    </div>
  )
}
