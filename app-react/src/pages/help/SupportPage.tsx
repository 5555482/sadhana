import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supportApi } from '../../api/support'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { ErrorBanner } from '../../components/ui/ErrorBanner'
import { useAuthStore } from '../../store/authStore'

export function SupportPage() {
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const mutation = useMutation({
    mutationFn: () => supportApi.sendMessage({ name, email, message }),
    onSuccess: () => setSent(true),
    onError: () => {
      window.location.href = `mailto:support@sadhana.pro?subject=Support request&body=${encodeURIComponent(message)}`
    },
  })

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
        <div className="text-success text-5xl">✓</div>
        <p className="font-semibold text-center text-lg">Thank you — we'll be in touch</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
        className="card bg-base-100 shadow-sm"
      >
        <div className="card-body flex flex-col gap-4">
          <Input label="Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex flex-col gap-1">
            <label className="label text-sm font-medium">Message</label>
            <textarea
              className="textarea textarea-bordered w-full h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
            />
          </div>
          <ErrorBanner message={mutation.isError ? 'Failed — opening your email client instead' : null} />
          <Button variant="primary" type="submit" loading={mutation.isPending} className="w-full">
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}
