import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { practicesApi } from '../../api/practices'
import { PracticeForm } from '../../components/PracticeForm'
import { Spinner } from '../../components/ui/Spinner'
import { TopBar } from '../../components/layout/TopBar'

export function PracticeEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data, isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })

  const practice = data?.find((p) => p.id === id)

  if (isLoading) return <Spinner />
  if (!practice) return <p className="p-4 text-error">Not found</p>

  return (
    <>
      <TopBar showBack title={practice.practice} />
      <PracticeForm
        mode={{ type: 'user' }}
        initialValues={{
          name: practice.practice,
          dataType: practice.data_type,
          dropdownVariants: practice.dropdown_variants,
          id: practice.id,
        }}
        onSuccess={() => navigate('/user/practices')}
      />
    </>
  )
}
