import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ErrorBanner } from '../../components/ui/ErrorBanner'

export function PwdResetPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) { setError(t('auth.passwordMismatch')); return }
    setError(null)
    setLoading(true)
    try {
      await authApi.resetPassword(id!, password)
      navigate('/login', { replace: true })
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
          <h2 className="font-semibold text-center text-lg">{t('auth.setPassword')}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label={t('auth.newPassword')} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            <Input label={t('auth.confirmPassword')} name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
            <ErrorBanner message={error} />
            <Button variant="primary" type="submit" loading={loading} className="w-full">{t('auth.setPassword')}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
