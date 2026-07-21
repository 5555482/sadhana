import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { FaCog, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { LuUser, LuLock, LuLayers, LuUpload, LuGlobe, LuHelpCircle } from 'react-icons/lu'
import { useAuthStore } from '../../store/authStore'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

function MenuItem({
  label,
  to,
  icon: Icon,
  last = false,
}: {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  last?: boolean
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors"
      style={{
        borderTop: last ? undefined : '1px solid rgba(0,0,0,0.05)',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#01a386' }} />
      <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
      <FaChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#d1d5db' }} />
    </Link>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={glass}>
      <div className="px-4 pt-4 pb-2">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9ca3af' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Page header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <FaCog className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-tight">{t('settings.title') || 'Settings'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Account & preferences</p>
        </div>
      </div>

      {/* Account */}
      <SectionCard title={t('settings.account')}>
        <MenuItem label={t('settings.editProfile')}    to="/settings/edit-user"     icon={LuUser}  last />
        <MenuItem label={t('settings.changePassword')} to="/settings/edit-password" icon={LuLock}  />
      </SectionCard>

      {/* Practices */}
      <SectionCard title={t('settings.practices')}>
        <MenuItem label={t('settings.myPractices')} to="/user/practices" icon={LuLayers} last />
      </SectionCard>

      {/* Data */}
      <SectionCard title={t('settings.data')}>
        <MenuItem label={t('settings.import')} to="/settings/import" icon={LuUpload} last />
      </SectionCard>

      {/* App */}
      <SectionCard title={t('settings.app')}>
        <MenuItem label={t('settings.language')} to="/settings/language" icon={LuGlobe} last />
        <MenuItem label={t('settings.help')}     to="/help"              icon={LuHelpCircle} />
      </SectionCard>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login', { replace: true }) }}
        className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
        style={{
          background: 'rgba(225,29,72,0.08)',
          color: '#e11d48',
          border: '1px solid rgba(225,29,72,0.20)',
        }}
      >
        <FaSignOutAlt className="w-3.5 h-3.5" />
        {t('auth.logout')}
      </button>
    </div>
  )
}
