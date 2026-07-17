interface InputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  placeholder?: string
  autoComplete?: string
}

export function Input({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full rounded-xl bg-surface-2 border px-4 py-3 text-text-primary
          placeholder:text-text-muted outline-none transition-colors
          ${error ? 'border-danger' : 'border-white/8 focus:border-teal'}
        `}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
