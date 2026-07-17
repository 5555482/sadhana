import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { Card } from '../../components/ui/Card'
import { Spinner } from '../../components/ui/Spinner'

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
    if (!id) return
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

  if (loadingDetails) return <Spinner />
  if (expired) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-6 text-center">
          <p className="text-danger">{t('auth.confirmationExpired')}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 flex flex-col gap-5">
        <h1 className="font-serif text-2xl text-gold text-center">Sadhana Pro</h1>
        <h2 className="font-semibold text-text-primary text-center text-lg">{t('auth.register')}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label={t('auth.email')} name="email" type="email" value={email} onChange={() => {}} />
          <Input label={t('auth.name')} name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <Input label={t('auth.password')} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <Input label={t('auth.confirmPassword')} name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
          <ErrorBanner message={error} />
          <Button variant="primary" type="submit" loading={loading} className="w-full">{t('auth.register')}</Button>
        </form>
      </Card>
    </div>
  )
}
