import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaApple, FaGoogle } from 'react-icons/fa'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-sm w-full max-w-sm">
        <div className="card-body flex flex-col gap-5">
          <h1 className="font-serif text-2xl text-primary text-center font-bold">Sadhana Pro</h1>
          <h2 className="font-semibold text-center text-lg">{t('auth.login')}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label={t('auth.password')}
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <ErrorBanner message={error} />
            <Button variant="primary" type="submit" loading={loading} className="w-full">
              {t('auth.signIn')}
            </Button>
          </form>

          <div className="divider text-sm text-base-content/50">or</div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { /* TODO: wire OAuth */ }}
              className="btn btn-outline w-full gap-2"
            >
              <FaApple className="w-5 h-5" /> Continue with Apple
            </button>
            <button
              type="button"
              onClick={() => { /* TODO: wire OAuth */ }}
              className="btn btn-outline w-full gap-2"
            >
              <FaGoogle className="w-5 h-5" /> Continue with Google
            </button>
          </div>

          <div className="text-center text-sm flex flex-col gap-2">
            <Link to="/reset" className="link link-primary">{t('auth.forgotPassword')}</Link>
            <span className="text-base-content/60">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="link link-primary">{t('auth.signUp')}</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
