import { useNavigate } from 'react-router-dom'
import { PracticeForm } from '../../components/PracticeForm'

export function PracticeNewPage() {
  const navigate = useNavigate()
  return (
    <PracticeForm
      mode={{ type: 'user' }}
      onSuccess={() => navigate('/user/practices')}
    />
  )
}
