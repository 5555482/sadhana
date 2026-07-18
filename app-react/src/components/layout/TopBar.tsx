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
    <header className="fixed top-0 left-0 right-0 h-14 bg-base-100 border-b border-base-300 flex items-center px-4 z-40 gap-3">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="btn btn-ghost btn-sm btn-circle"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
      ) : (
        <span className="font-serif text-lg text-primary font-bold">Sadhana Pro</span>
      )}
      {title && (
        <h1 className="font-semibold text-base flex-1">{title}</h1>
      )}
      {right && <div className="ml-auto">{right}</div>}
    </header>
  )
})
