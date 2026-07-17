import { memo } from 'react'

interface ErrorBannerProps {
  message?: string | null
}

export const ErrorBanner = memo(function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null
  return (
    <div role="alert" className="rounded-xl bg-danger/15 border border-danger/30 text-danger px-4 py-3 text-sm">
      {message}
    </div>
  )
})
