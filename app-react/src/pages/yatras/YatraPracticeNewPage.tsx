import { useParams, useNavigate } from 'react-router-dom'
import { PracticeForm } from '../../components/PracticeForm'

export function YatraPracticeNewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  return (
    <PracticeForm
      mode={{ type: 'yatra', yatraId: id! }}
      onSuccess={() => navigate(`/yatra/${id}/admin/settings`)}
    />
  )
}
