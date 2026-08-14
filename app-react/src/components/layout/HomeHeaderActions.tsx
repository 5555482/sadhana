import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaChevronDown } from 'react-icons/fa'
import { ACCENT } from '../../theme/tokens'

const pill =
  'h-9 px-3 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors no-underline'
const glassPill = {
  background: 'rgba(255,255,255,0.10)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'rgba(255,255,255,0.85)',
} as const
const menuItem = 'px-4 py-2.5 text-sm no-underline hover:bg-white/10'

export function HomeHeaderActions() {
  const { t } = useTranslation()
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
    <div className="flex items-center gap-2">
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className={pill}
          style={glassPill}
        >
          {t('home.practicesMenu')}
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
            <Link
              role="menuitem"
              to="/user/practice/new"
              onClick={() => setOpen(false)}
              className={menuItem}
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {t('home.addPractice')}
            </Link>
            <Link
              role="menuitem"
              to="/user/practices"
              onClick={() => setOpen(false)}
              className={menuItem}
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {t('home.editPractices')}
            </Link>
          </div>
        )}
      </div>

      <Link
        to="/charts/new"
        className={pill}
        style={{ background: ACCENT, border: '1px solid transparent', color: 'white' }}
      >
        {t('charts.newReport')}
      </Link>
    </div>
  )
}
