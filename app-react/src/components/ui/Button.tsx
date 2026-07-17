interface ButtonProps {
  variant: 'primary' | 'secondary'
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export function Button({
  variant,
  children,
  loading,
  disabled,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base = 'flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 px-6 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gold text-surface-0 hover:bg-gold-light active:scale-95',
    secondary: 'border border-teal text-teal hover:bg-teal/10 active:scale-95',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
