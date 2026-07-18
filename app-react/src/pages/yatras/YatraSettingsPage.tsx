import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { ConfirmModal } from '../../components/ui/ConfirmModal'

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

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <h2 className="font-bold text-lg">{data.name}</h2>

      <div className="tabs tabs-bordered">
        <button
          className={`tab ${tab === 'members' ? 'tab-active' : ''}`}
          onClick={() => setTab('members')}
        >
          Members ({data.members.length})
        </button>
        <button
          className={`tab ${tab === 'practices' ? 'tab-active' : ''}`}
          onClick={() => setTab('practices')}
        >
          Practices ({data.practices.length})
        </button>
      </div>

      {tab === 'members' && (
        <div className="flex flex-col gap-2">
          {data.members.map((m) => (
            <div key={m.id} className="card bg-base-100 shadow-sm p-3 flex-row items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8">
                  <span className="text-xs">{m.name[0]?.toUpperCase()}</span>
                </div>
              </div>
              <span>{m.name}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'practices' && (
        <div className="flex flex-col gap-2">
          {data.practices.map((p) => (
            <div key={p.id} className="card bg-base-100 shadow-sm p-3 flex-row items-center gap-3">
              <span className="flex-1">{p.practice}</span>
              <span className="badge badge-ghost badge-sm">{p.data_type}</span>
            </div>
          ))}
        </div>
      )}

      {data.is_admin && (
        <Link to={`/yatra/${id}/admin/settings`} className="btn btn-outline btn-sm">
          Admin settings →
        </Link>
      )}

      <button
        className="btn btn-error btn-outline w-full mt-4"
        onClick={() => (document.getElementById('leave-modal') as HTMLDialogElement)?.showModal()}
      >
        Leave yatra
      </button>

      <ConfirmModal
        id="leave-modal"
        title="Leave yatra?"
        message={`Leave "${data.name}"? You can rejoin later.`}
        confirmLabel="Leave"
        onConfirm={() => leave.mutate()}
      />
    </div>
  )
}
