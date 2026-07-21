import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FaEdit } from 'react-icons/fa'
import { LuX } from 'react-icons/lu'
import { practicesApi } from '../../api/practices'
import { PracticeForm } from '../../components/PracticeForm'
import { Spinner } from '../../components/ui/Spinner'

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function PracticeEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['practices'],
    queryFn: practicesApi.getUserPractices,
  })

  const practice = data?.find((p) => p.id === id)

  if (isLoading) return <Spinner />
  if (!practice) return <p className="p-4 text-error">Not found</p>

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4">
      {/* Page header card with inline close button */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={cardStyle}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <FaEdit className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800 leading-tight truncate">{practice.practice}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Edit practice</p>
        </div>
        <Link
          to="/user/practices"
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      <PracticeForm
        mode={{ type: 'user' }}
        initialValues={{
          name: practice.practice,
          dataType: practice.data_type,
          isRequired: practice.is_required,
          dropdownVariants: practice.dropdown_variants,
          id: practice.id,
        }}
        onSuccess={() => navigate('/user/practices')}
      />
    </div>
  )
}
