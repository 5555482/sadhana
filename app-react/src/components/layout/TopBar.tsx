import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'

interface TopBarProps {
  title?: string
  showBack?: boolean
  right?: React.ReactNode
}

export const TopBar = React.memo(function TopBar({ title, showBack, right }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-40 gap-3"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.35)',
      }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn btn-ghost btn-sm btn-circle text-base-content/80"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <span className="font-serif text-lg text-base-content font-bold">Sadhana Pro</span>
      )}
      {title && (
        <h1 className="font-semibold text-base text-base-content flex-1">{title}</h1>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </header>
  )
})
