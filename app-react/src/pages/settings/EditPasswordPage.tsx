import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner } from '../../components/ui/ErrorBanner'

export function EditPasswordPage() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.updatePassword(current, next),
    onSuccess: () => {
      setSuccess(true)
      setCurrent('')
      setNext('')
      setConfirm('')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) { setClientError(t('auth.passwordMismatch')); return }
    setClientError(null)
    setSuccess(false)
    mutation.mutate()
  }

  return (
    <div className="px-4 py-4">
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-4">
          <Input
            label={t('settings.currentPassword')}
            name="current"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <Input
            label={t('auth.newPassword')}
            name="next"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          <Input
            label={t('auth.confirmPassword')}
            name="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {success && (
            <div className="alert alert-success text-sm">{t('settings.saved')}</div>
          )}
          <ErrorBanner message={clientError ?? (mutation.isError ? t('common.error') : null)} />
          <Button variant="primary" type="submit" loading={mutation.isPending} className="w-full">
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  )
}
