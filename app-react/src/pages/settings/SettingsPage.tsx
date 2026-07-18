import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import { useAuthStore } from '../../store/authStore'

function MenuItem({ label, to }: { label: string; to: string }) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between py-3 px-4 hover:bg-base-200 transition-colors">
        <span>{label}</span>
        <FaChevronRight className="w-3 h-3 text-base-content/40" />
      </Link>
    </li>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      <ul className="menu bg-base-100 rounded-box shadow-sm p-0 divide-y divide-base-200">
        <li className="menu-title px-4 pt-3 pb-1 text-xs text-base-content/50 uppercase tracking-wider">
          {t('settings.account')}
        </li>
        <MenuItem label={t('settings.editProfile')} to="/settings/edit-user" />
        <MenuItem label={t('settings.changePassword')} to="/settings/edit-password" />
        <li className="menu-title px-4 pt-3 pb-1 text-xs text-base-content/50 uppercase tracking-wider">
          {t('settings.practices')}
        </li>
        <MenuItem label={t('settings.myPractices')} to="/user/practices" />
        <li className="menu-title px-4 pt-3 pb-1 text-xs text-base-content/50 uppercase tracking-wider">
          {t('settings.data')}
        </li>
        <MenuItem label={t('settings.import')} to="/settings/import" />
        <li className="menu-title px-4 pt-3 pb-1 text-xs text-base-content/50 uppercase tracking-wider">
          {t('settings.app')}
        </li>
        <MenuItem label={t('settings.language')} to="/settings/language" />
        <MenuItem label={t('settings.help')} to="/help" />
      </ul>

      <button
        className="btn btn-error btn-outline w-full"
        onClick={() => { logout(); navigate('/login', { replace: true }) }}
      >
        {t('auth.logout')}
      </button>
    </div>
  )
}
