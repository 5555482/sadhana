import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { yatrasApi } from '../../api/yatras'
import { PracticeForm } from '../../components/PracticeForm'
import { Spinner } from '../../components/ui/Spinner'

export function YatraPracticeEditPage() {
  const { id, practice_id } = useParams<{ id: string; practice_id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['yatra', id],
    queryFn: () => yatrasApi.getYatra(id!),
  })

  const practice = data?.practices.find((p) => p.id === practice_id)

  if (isLoading) return <Spinner />
  if (!practice) return <p className="p-4 text-error">Not found</p>

  return (
    <PracticeForm
      mode={{ type: 'yatra', yatraId: id! }}
      initialValues={{
        name: practice.practice,
        dataType: practice.data_type,
        dropdownVariants: practice.dropdown_variants,
        id: practice.id,
      }}
      onSuccess={() => navigate(`/yatra/${id}/admin/settings`)}
    />
  )
}
