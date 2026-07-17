import { memo } from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = memo(function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl bg-surface-1 border border-white/10 ${className}`}>
      {children}
    </div>
  )
})
