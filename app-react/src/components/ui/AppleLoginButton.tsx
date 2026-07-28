import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: object) => void
        signIn: () => Promise<{
          authorization: { id_token: string }
          user?: { name?: { firstName?: string; lastName?: string } }
        }>
      }
    }
  }
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.4-148.3-100.7C208.9 751.6 142 663.9 142 556.6c0-152.9 99.4-234.3 196.6-234.3 51.7 0 94.9 33.6 127.5 33.6 31.2 0 79.8-35.5 140.6-35.5 22.5 0 108.2 1.9 161.8 74.4zm-234-181.5c28.1-36.2 48.2-86.7 48.2-137.3 0-7.1-.6-14.3-1.9-20.1-45.5 1.7-99.8 30.4-132.5 72.1-26.3 31.5-50.2 81.7-50.2 133.9 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 40.8 0 89.7-27.4 120.9-67.9z" />
    </svg>
  )
}

interface Props {
  onSuccess: (idToken: string, name?: string) => void
  onError: () => void
}

export function AppleLoginButton({ onSuccess, onError }: Props) {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (!clientId || scriptLoaded.current) return
    const script = document.createElement('script')
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'
    script.onload = () => {
      scriptLoaded.current = true
      window.AppleID?.auth.init({
        clientId,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true,
      })
    }
    document.head.appendChild(script)
  }, [clientId])

  async function handleClick() {
    if (!window.AppleID) { onError(); return }
    try {
      const res = await window.AppleID.auth.signIn()
      const firstName = res.user?.name?.firstName ?? ''
      const lastName = res.user?.name?.lastName ?? ''
      const name = [firstName, lastName].filter(Boolean).join(' ') || undefined
      onSuccess(res.authorization.id_token, name)
    } catch {
      onError()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center w-full h-12 rounded-full text-sm font-medium transition-all px-5 gap-4 hover:bg-black/80"
      style={{ background: 'rgba(0,0,0,0.85)', color: 'white', border: 'none' }}
    >
      <AppleIcon />
      <span className="flex-1 text-center pr-5">Sign in with Apple</span>
    </button>
  )
}
