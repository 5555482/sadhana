import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaApple, FaFacebook } from 'react-icons/fa'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </g>
    </svg>
  )
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await authApi.login(email, password)
      setAuth(user)
      navigate('/', { replace: true })
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 50%, #ccfbf1 100%)' }}
    >
      {/* Pastel blobs */}
      <div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[260px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, transparent 70%)' }}
      />

      {/* Glass card */}
      <div
        className="relative w-full max-w-sm rounded-3xl px-8 py-10 flex flex-col gap-5"
        style={{
          background: 'rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow: '0 8px 40px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        {/* Headline */}
        <div className="mb-1 text-center">
          <img src="/logo.png" alt="Sadhana Pro" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-3xl font-serif font-light text-base-content leading-tight">
            Welcome to your<br />daily practice.
          </h1>
          <p className="text-sm text-base-content/50 mt-3">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        {/* Email + password form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-wider">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full h-12 px-4 rounded-xl text-base-content placeholder:text-base-content/30 text-sm focus:outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(0,0,0,0.10)',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/50 uppercase tracking-wider">{t('auth.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full h-12 px-4 pr-16 rounded-xl text-base-content text-sm focus:outline-none transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(0,0,0,0.10)',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.10)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-primary font-medium hover:text-primary/70 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-error text-center">{error}</p>
          )}

          <div className="text-center -mt-1">
            <Link to="/reset" className="text-sm text-base-content/40 hover:text-primary transition-colors">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Sign in — teal pill */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)',
              color: '#134e4a',
              boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
            }}
          >
            {loading && <span className="loading loading-spinner loading-sm" />}
            {t('auth.signIn')}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-base-content/10" />
          <span className="text-xs text-base-content/30">or</span>
          <div className="flex-1 h-px bg-base-content/10" />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => { /* TODO: wire OAuth */ }}
            className="flex items-center w-full h-12 rounded-full text-white text-sm font-medium transition-all px-5 gap-4 hover:opacity-90"
            style={{ background: '#000', border: '1px solid rgba(0,0,0,0.8)' }}
          >
            <FaApple className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-center pr-5">Sign in with Apple</span>
          </button>

          <button
            type="button"
            onClick={() => { /* TODO: wire OAuth */ }}
            className="flex items-center w-full h-12 rounded-full text-base-content text-sm font-medium transition-all px-5 gap-4 hover:bg-white/80"
            style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.10)' }}
          >
            <GoogleIcon />
            <span className="flex-1 text-center pr-5">Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={() => { /* TODO: wire OAuth */ }}
            className="flex items-center w-full h-12 rounded-full text-base-content text-sm font-medium transition-all px-5 gap-4 hover:bg-white/80"
            style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.10)' }}
          >
            <FaFacebook className="w-5 h-5 shrink-0 text-[#1877F2]" />
            <span className="flex-1 text-center pr-5">Sign in with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  )
}
