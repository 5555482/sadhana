import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { Button } from '../../components/ui/Button'

export function YatraJoinPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['yatra', id],
    queryFn: () => yatrasApi.getYatra(id!),
  })

  const join = useMutation({
    mutationFn: () => yatrasApi.joinYatra(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['yatras'] })
      navigate(`/yatra/${id}/settings`, { replace: true })
    },
  })

  if (isLoading) return <Spinner />
  if (!data) return <p className="p-4 text-error">Not found</p>

  return (
    <div className="px-4 py-4">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-4">
          <h2 className="card-title">{data.name}</h2>
          {data.description && <p className="text-base-content/70">{data.description}</p>}
          <p className="text-sm text-base-content/60">
            {data.member_count} members · {data.practices.length} practices
          </p>
          {data.practices.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Practices</p>
              {data.practices.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-sm">{p.practice}</span>
                  <span className="badge badge-ghost badge-xs">{p.data_type}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="primary" loading={join.isPending} onClick={() => join.mutate()} className="w-full">
              Join
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)} className="w-full">
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
