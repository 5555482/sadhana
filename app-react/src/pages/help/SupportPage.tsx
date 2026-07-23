import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { LuMessageSquare, LuCheck, LuX } from 'react-icons/lu'
import { supportApi } from '../../api/support'
import { useAuthStore } from '../../store/authStore'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.80)',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: '0.75rem',
  outline: 'none',
  width: '100%',
  fontSize: '0.9rem',
  color: '#1f2937',
  padding: '0.625rem 0.875rem',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = '#01a386'
  e.target.style.boxShadow = '0 0 0 3px rgba(1,163,134,0.12)'
}

function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.target.style.borderColor = 'rgba(0,0,0,0.10)'
  e.target.style.boxShadow = 'none'
}

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
      <div className="px-4 py-6 max-w-lg mx-auto flex flex-col items-center justify-center gap-4 pb-24" style={{ paddingTop: '6rem' }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(1,163,134,0.12)' }}
        >
          <LuCheck className="w-7 h-7" style={{ color: '#01a386' }} />
        </div>
        <p className="font-semibold text-gray-800 text-lg text-center">Thank you — we'll be in touch</p>
        <Link
          to="/help"
          className="text-sm font-medium no-underline"
          style={{ color: '#01a386' }}
        >
          Back to help
        </Link>
      </div>
    )
  }

  const canSubmit = name.trim() && email.trim() && message.trim()

  return (
    <div className="px-4 py-6 max-w-lg mx-auto flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="rounded-2xl px-5 py-5 flex items-center gap-4" style={glass}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.28)',
          }}
        >
          <LuMessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-gray-800">Contact support</h1>
          <p className="text-xs text-gray-400 mt-0.5">We'll reply to your email</p>
        </div>
        <Link
          to="/help"
          aria-label="Close"
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.40)' }}
        >
          <LuX className="w-4 h-4" />
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
        className="flex flex-col gap-4"
      >
        <div className="rounded-2xl px-5 py-5 flex flex-col gap-4" style={glass}>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="How can we help?"
              style={{ ...inputStyle, height: '7rem', resize: 'none' }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {mutation.isError && (
            <p className="text-sm rounded-xl px-3 py-2.5" style={{ background: 'rgba(225,29,72,0.07)', color: '#e11d48' }}>
              Failed to send — opening your email client instead
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || !canSubmit}
          className="w-full h-12 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
            opacity: mutation.isPending || !canSubmit ? 0.55 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {mutation.isPending && <span className="loading loading-spinner loading-xs" />}
          Send message
        </button>
      </form>
    </div>
  )
}
