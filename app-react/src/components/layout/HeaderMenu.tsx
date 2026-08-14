import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'

export type HeaderMenuItem =
  | { label: string; to: string }
  | { label: string; onClick: () => void }

const pill =
  'h-9 px-3 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors no-underline'
const glassPill = {
  background: 'rgba(255,255,255,0.10)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.85)',
} as const
const itemClass = 'px-4 py-2.5 text-sm text-left no-underline hover:bg-white/10 w-full'
const itemStyle = { color: 'rgba(255,255,255,0.85)' } as const

export function HeaderMenu({ label, items }: { label: string; items: HeaderMenuItem[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={pill}
        style={glassPill}
      >
        {label}
        <FaChevronDown className="w-3 h-3 opacity-70" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-2 min-w-44 rounded-xl overflow-hidden z-50 flex flex-col"
          style={{
            background: 'rgba(20,28,45,0.96)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          }}
        >
          {items.map((item) =>
            'to' in item ? (
              <Link
                key={item.label}
                role="menuitem"
                to={item.to}
                onClick={() => setOpen(false)}
                className={itemClass}
                style={itemStyle}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
                className={itemClass}
                style={itemStyle}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
