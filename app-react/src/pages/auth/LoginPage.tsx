import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { Card } from '../../components/ui/Card'

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
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 flex flex-col gap-5">
        <h1 className="font-serif text-2xl text-gold text-center">Sadhana Pro</h1>
        <h2 className="font-semibold text-text-primary text-center text-lg">{t('auth.login')}</h2>
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
        <div className="text-center text-sm text-text-secondary flex flex-col gap-2">
          <Link to="/reset" className="text-teal hover:underline">{t('auth.forgotPassword')}</Link>
          <span>
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-teal hover:underline">{t('auth.signUp')}</Link>
          </span>
        </div>
      </Card>
    </div>
  )
}
