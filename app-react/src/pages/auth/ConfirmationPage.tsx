import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import i18n from '../../i18n'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { AuthBackground } from '../../components/layout/AuthBackground'

const glassCard: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.60)',
  backdropFilter: 'blur(36px)',
  WebkitBackdropFilter: 'blur(36px)',
  border: '1px solid rgba(255, 255, 255, 0.80)',
  boxShadow: '0 12px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.9)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(0,0,0,0.10)',
}

function GlassShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <AuthBackground />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="relative w-full max-w-sm rounded-3xl px-8 py-10 flex flex-col gap-5" style={glassCard}>
        {children}
      </div>
    </div>
  )
}

function FieldInput({
  label, type = 'text', value, onChange, placeholder, autoComplete, readOnly,
}: {
  label: string
  type?: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autoComplete?: string
  readOnly?: boolean
}) {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-base-content/50 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={isPassword && showPwd ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          className="w-full h-12 px-4 rounded-xl text-base-content placeholder:text-base-content/30 text-sm focus:outline-none transition-colors disabled:opacity-60"
          style={{ ...inputStyle, paddingRight: isPassword ? '3.5rem' : undefined }}
          onFocus={e => { if (!readOnly) e.target.style.borderColor = 'rgba(99,102,241,0.5)' }}
          onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#c8724a' }}
          >
            {showPwd ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

export function ConfirmationPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!id) { setExpired(true); setLoadingDetails(false); return }
    authApi.getConfirmationDetails(id)
      .then((c) => setEmail(c.email))
      .catch(() => setExpired(true))
      .finally(() => setLoadingDetails(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) { setError(t('auth.passwordMismatch')); return }
    setError(null)
    setLoading(true)
    try {
      const lang = (i18n.resolvedLanguage || 'en').slice(0, 2)
      const user = await authApi.register(id!, email, password, name, lang)
      setAuth(user)
      navigate('/', { replace: true })
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (loadingDetails) {
    return (
      <GlassShell>
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-md" style={{ color: '#c8724a' }} />
        </div>
      </GlassShell>
    )
  }

  if (expired) {
    return (
      <GlassShell>
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm text-error">{t('auth.confirmationExpired')}</p>
          <Link to="/register" className="text-sm font-medium hover:underline" style={{ color: '#c8724a' }}>
            {t('auth.signUp')}
          </Link>
        </div>
      </GlassShell>
    )
  }

  return (
    <GlassShell>
      <div className="mb-1 text-center">
        <h1 className="text-xl font-serif font-extralight text-base-content leading-snug tracking-wide">
          Create your<br />account.
        </h1>
        <p className="text-xs text-base-content/50 mt-2">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FieldInput
          label={t('auth.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
        <FieldInput
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <FieldInput
          label={t('auth.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        {error && <p className="text-sm text-error text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #d68a63 0%, #c8724a 100%)',
            color: '#0b0b0d',
            boxShadow: '0 4px 20px rgba(200,114,74,0.35)',
          }}
        >
          {loading && <span className="loading loading-spinner loading-sm" />}
          {t('auth.register')}
        </button>
      </form>
    </GlassShell>
  )
}
