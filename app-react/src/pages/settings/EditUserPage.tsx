import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { LuUser, LuCheck } from 'react-icons/lu'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.9rem',
  color: '#1f2937',
  padding: '0.625rem 0.875rem',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#01a386'
  e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)'
}
function onBlurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(0,0,0,0.10)'
  e.target.style.boxShadow = 'none'
}

export function EditUserPage() {
  const { t } = useTranslation()
  const user = useAuthStore(s => s.user)
  const [name, setName] = useState(user?.name ?? '')
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.updateUser(name),
    onSuccess: () => setSuccess(true),
  })

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            boxShadow: '0 4px 16px rgba(1,163,134,0.30)',
          }}
        >
          <LuUser className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800">{t('settings.editProfile')}</h1>
          <p className="text-xs text-gray-400 mt-0.5">Update your display name</p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl px-5 py-5 flex flex-col gap-4" style={glass}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t('auth.name')}</label>
          <input
            value={name}
            onChange={e => { setName(e.target.value); setSuccess(false) }}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlurInput}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t('auth.email')}</label>
          <input
            value={user?.email ?? ''}
            readOnly
            style={{ ...inputStyle, background: 'rgba(0,0,0,0.03)', color: '#9ca3af', cursor: 'default' }}
          />
        </div>

        {mutation.isError && (
          <p className="text-sm rounded-xl px-3 py-2.5" style={{ background: 'rgba(225,29,72,0.07)', color: '#e11d48' }}>
            {t('common.error')}
          </p>
        )}
      </div>

      <button
        onClick={() => { setSuccess(false); mutation.mutate() }}
        disabled={mutation.isPending || !name.trim()}
        className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-opacity"
        style={{
          background: success
            ? 'rgba(1,163,134,0.12)'
            : 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
          color: success ? '#01a386' : 'white',
          border: success ? '1px solid rgba(1,163,134,0.30)' : 'none',
          boxShadow: success ? 'none' : '0 4px 20px rgba(45,212,191,0.35)',
          opacity: mutation.isPending || !name.trim() ? 0.55 : 1,
        }}
      >
        {mutation.isPending && <span className="loading loading-spinner loading-xs" />}
        {success ? <><LuCheck className="w-4 h-4" /> {t('settings.saved')}</> : t('common.save')}
      </button>
    </div>
  )
}
