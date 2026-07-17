import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { Card } from '../../components/ui/Card'

export function PwdResetRequestPage() {
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
      await authApi.sendConfirmationLink(email, 'PasswordReset')
      setSent(true)
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm p-6 text-center flex flex-col gap-4">
          <h1 className="font-serif text-2xl text-gold">Sadhana Pro</h1>
          <p className="text-text-primary">{t('auth.resetSent')}</p>
          <Link to="/login" className="text-teal hover:underline text-sm">{t('auth.signIn')}</Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6 flex flex-col gap-5">
        <h1 className="font-serif text-2xl text-gold text-center">Sadhana Pro</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label={t('auth.email')} name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <ErrorBanner message={error} />
          <Button variant="primary" type="submit" loading={loading} className="w-full">{t('auth.sendLink')}</Button>
        </form>
        <Link to="/login" className="text-center text-sm text-teal hover:underline">{t('auth.signIn')}</Link>
      </Card>
    </div>
  )
}
