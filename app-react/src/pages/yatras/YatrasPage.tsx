import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaUsers, FaPlus, FaChevronRight } from 'react-icons/fa'
import { yatrasApi } from '../../api/yatras'
import { Spinner } from '../../components/ui/Spinner'
import { useTranslation } from 'react-i18next'
import type { Yatra } from '../../types/api'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

function YatraCard({ y }: { y: Yatra }) {
  const to = y.is_member ? `/yatra/${y.id}/settings` : `/yatra/${y.id}/join`

  return (
    <Link
      to={to}
      className="rounded-2xl px-4 py-4 flex items-center gap-3 transition-all no-underline"
      style={glass}
    >
      {/* Avatar circle */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-base font-bold"
        style={{
          background: y.is_member
            ? 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)'
            : 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          boxShadow: y.is_member
            ? '0 4px 12px rgba(1,163,134,0.28)'
            : '0 4px 12px rgba(124,58,237,0.24)',
        }}
      >
        {y.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{y.name}</p>
        <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
          {y.member_count} member{y.member_count === 1 ? '' : 's'} · {y.practices.length} practice{y.practices.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Badge + chevron */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {y.is_member && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(1,163,134,0.10)', color: '#01a386' }}
          >
            Member
          </span>
        )}
        {y.is_admin && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.10)', color: '#6366f1' }}
          >
            Admin
          </span>
        )}
        <FaChevronRight className="w-3 h-3" style={{ color: '#d1d5db' }} />
      </div>
    </Link>
  )
}

export function YatrasPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['yatras'], queryFn: yatrasApi.getYatras })

  if (isLoading) return <Spinner />

  return (
    <>
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-3 pb-24">
        {/* Page header */}
        <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
              boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
            }}
          >
            <FaUsers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">{t('yatras.title') || 'Yatras'}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {data.length > 0
                ? `${data.length} group${data.length === 1 ? '' : 's'}`
                : 'Group practice circles'}
            </p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ background: 'rgba(1,163,134,0.08)' }}
            >
              <FaUsers className="w-7 h-7" style={{ color: '#01a386' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">{t('yatras.empty') || 'No yatras yet'}</p>
              <p className="text-xs text-gray-400 mt-1">Join or create a group practice circle</p>
            </div>
            <Link
              to="/yatra/join"
              className="px-6 h-11 rounded-full text-sm font-semibold flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
              }}
            >
              Join a Yatra
            </Link>
          </div>
        ) : (
          data.map((y) => <YatraCard key={y.id} y={y} />)
        )}
      </div>

      {/* FAB */}
      <Link
        to="/yatra/join"
        aria-label="Join yatra"
        className="fixed bottom-6 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
          boxShadow: '0 4px 24px rgba(45,212,191,0.45)',
        }}
      >
        <FaPlus className="w-5 h-5 text-white" />
      </Link>
    </>
  )
}
