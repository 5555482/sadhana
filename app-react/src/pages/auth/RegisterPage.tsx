import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'

export function RegisterPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.sendConfirmationLink(email, 'Registration')
      setSent(true)
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="card bg-base-100 shadow-sm w-full max-w-sm">
          <div className="card-body text-center flex flex-col gap-4">
            <h1 className="font-serif text-2xl text-primary font-bold">Sadhana Pro</h1>
            <p>{t('auth.checkEmail')}</p>
            <Link to="/login" className="link link-primary text-sm">{t('auth.signIn')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-sm w-full max-w-sm">
        <div className="card-body flex flex-col gap-5">
          <h1 className="font-serif text-2xl text-primary text-center font-bold">Sadhana Pro</h1>
          <h2 className="font-semibold text-center text-lg">{t('auth.register')}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <ErrorBanner message={error} />
            <Button variant="primary" type="submit" loading={loading} className="w-full">
              {t('auth.sendLink')}
            </Button>
          </form>
          <p className="text-center text-sm text-base-content/60">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="link link-primary">{t('auth.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
