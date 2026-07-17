import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'

interface TopBarProps {
  title?: string
  showBack?: boolean
}

export const TopBar = React.memo(function TopBar({ title, showBack }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-1/90 backdrop-blur-md border-b border-white/10 flex items-center px-4 z-40">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mr-3 text-text-secondary hover:text-text-primary transition-colors"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <span className="font-serif text-lg text-gold mr-3">Sadhana Pro</span>
      )}
      {title && (
        <h1 className="text-text-primary font-semibold text-base">{title}</h1>
      )}
    </header>
  )
})
