import { Link } from 'react-router-dom'
import { LuCompass } from 'react-icons/lu'

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.90)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.80)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl px-8 py-12 flex flex-col items-center gap-5 text-center" style={glass}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(1,163,134,0.10)' }}
        >
          <LuCompass className="w-8 h-8" style={{ color: '#01a386' }} />
        </div>
        <div>
          <p className="text-5xl font-bold text-gray-200">404</p>
          <p className="text-base font-semibold text-gray-700 mt-2">Page not found</p>
          <p className="text-sm text-gray-400 mt-1">The page you're looking for doesn't exist.</p>
        </div>
        <Link
          to="/"
          className="px-8 h-11 rounded-full text-sm font-semibold flex items-center no-underline"
          style={{
            background: 'linear-gradient(135deg, #02c9a3 0%, #01a386 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(45,212,191,0.35)',
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
