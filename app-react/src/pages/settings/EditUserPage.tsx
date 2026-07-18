import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../api/auth'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner } from '../../components/ui/ErrorBanner'

export function EditUserPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState(user?.name ?? '')
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: () => authApi.updateUser(name),
    onSuccess: () => setSuccess(true),
  })

  return (
    <div className="px-4 py-4">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body flex flex-col gap-4">
          <Input
            label={t('auth.name')}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={t('auth.email')}
            name="email"
            value={user?.email ?? ''}
            onChange={() => {}}
            readOnly
          />
          {success && (
            <div className="alert alert-success text-sm">{t('settings.saved')}</div>
          )}
          <ErrorBanner message={mutation.isError ? t('common.error') : null} />
          <Button
            variant="primary"
            loading={mutation.isPending}
            onClick={() => { setSuccess(false); mutation.mutate() }}
            className="w-full"
          >
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
