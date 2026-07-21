import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LuToggleRight, LuHash, LuTimer, LuClock, LuType } from 'react-icons/lu'
import { practicesApi } from '../../api/practices'
import type { UserPractice, PracticeValue } from '../../types/api'

interface PracticeCardProps {
  practice: UserPractice
  date: string
  currentValue?: PracticeValue
}

const TYPE_META: Record<string, {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bg: string
}> = {
  Bool:     { icon: LuToggleRight, color: '#01a386', bg: 'rgba(1,163,134,0.10)'   },
  Int:      { icon: LuHash,        color: '#6366f1', bg: 'rgba(99,102,241,0.10)'  },
  Duration: { icon: LuTimer,       color: '#d97706', bg: 'rgba(245,158,11,0.10)'  },
  Time:     { icon: LuClock,       color: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
  Text:     { icon: LuType,        color: '#6b7280', bg: 'rgba(107,114,128,0.10)' },
}

const ACCENT = '#01a386'

/* Format total minutes → "45 min" | "1h" | "1h 30m" */
function fmtDur(min: number): string {
  if (min <= 0) return '0 min'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

const field: React.CSSProperties = {
  background: 'rgba(0,0,0,0.04)',
  border: '1.5px solid rgba(0,0,0,0.08)',
  borderRadius: '0.625rem',
  outline: 'none',
  fontWeight: 700,
  textAlign: 'center',
  transition: 'border-color 0.15s, background 0.15s',
}

function fieldFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(1,163,134,0.55)'
  e.target.style.background = 'rgba(1,163,134,0.06)'
}
function fieldBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(0,0,0,0.08)'
  e.target.style.background = 'rgba(0,0,0,0.04)'
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-light select-none active:scale-90 transition-transform flex-shrink-0"
      style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', color: ACCENT }}
    >
      {label}
    </button>
  )
}

export function PracticeCard({ practice, date, currentValue }: PracticeCardProps) {
  const qc = useQueryClient()
  const hasValue = currentValue !== undefined
  const meta = TYPE_META[practice.data_type]

  /* ── Extract values ── */
  const boolVal = currentValue && 'Bool'     in currentValue ? currentValue.Bool      : false
  const intVal  = currentValue && 'Int'      in currentValue ? currentValue.Int       : 0
  const durVal  = currentValue && 'Duration' in currentValue ? currentValue.Duration  : 0
  const textVal = currentValue && 'Text'     in currentValue ? currentValue.Text      : ''
  const timeH   = currentValue && 'Time'     in currentValue
    ? (currentValue as { Time: { h: number; m: number } }).Time.h : 0
  const timeM   = currentValue && 'Time'     in currentValue
    ? (currentValue as { Time: { h: number; m: number } }).Time.m : 0

  /* ── Local state ── */
  const [localBool, setLocalBool] = useState(boolVal)
  const [flash, setFlash]         = useState(false)

  /* ── Value refs ── */
  const durRef   = useRef(durVal)
  const intRef   = useRef(intVal)
  const timeHRef = useRef(timeH)
  const timeMRef = useRef(timeM)

  /* ── DOM refs ── */
  const durEl  = useRef<HTMLInputElement>(null)
  const intEl  = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (v: PracticeValue) => practicesApi.saveDiaryEntry(date, practice.practice, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diary', date] })
      setFlash(true)
      setTimeout(() => setFlash(false), 1200)
    },
  })

  const save = (v: PracticeValue) => mutation.mutate(v)

  const TypeIcon = meta?.icon

  return (
    <div
      className="rounded-2xl px-4 py-3.5 flex items-center gap-3 min-h-[60px] transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: flash
          ? '1px solid rgba(1,163,134,0.50)'
          : hasValue
          ? '1px solid rgba(1,163,134,0.20)'
          : '1px solid rgba(255,255,255,0.85)',
        boxShadow: flash
          ? '0 2px 12px rgba(1,163,134,0.14)'
          : '0 2px 12px rgba(0,0,0,0.07)',
      }}
    >
      {/* Type icon */}
      {TypeIcon && meta && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: localBool && practice.data_type === 'Bool'
              ? 'rgba(1,163,134,0.18)' : meta.bg,
          }}
        >
          <TypeIcon className="w-4 h-4" style={{ color: meta.color }} />
        </div>
      )}

      {/* Name */}
      <span className="flex-1 min-w-0 text-sm font-semibold text-gray-800 leading-tight truncate">
        {practice.practice}
      </span>

      {/* ── Bool ── */}
      {practice.data_type === 'Bool' && (
        <button
          type="button"
          role="switch"
          aria-checked={localBool}
          onClick={() => { const n = !localBool; setLocalBool(n); save({ Bool: n }) }}
          className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ backgroundColor: localBool ? '#01a386' : 'rgba(0,0,0,0.16)' }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{ transform: localBool ? 'translateX(1.25rem)' : 'translateX(0)' }}
          />
        </button>
      )}

      {/* ── Duration — smart input: shows "45 min" / "1h 30m" when idle ── */}
      {practice.data_type === 'Duration' && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Step label="−" onClick={() => {
            durRef.current = Math.max(0, durRef.current - 5)
            if (durEl.current) {
              const focused = document.activeElement === durEl.current
              durEl.current.value = focused ? String(durRef.current) : fmtDur(durRef.current)
              durEl.current.style.color = durRef.current > 0 ? ACCENT : '#9ca3af'
            }
            save({ Duration: durRef.current })
          }} />

          <input
            ref={durEl}
            type="text"
            inputMode="numeric"
            defaultValue={fmtDur(durVal)}
            className="focus:outline-none text-sm"
            style={{ ...field, width: '5rem', height: '2rem', color: durVal > 0 ? ACCENT : '#9ca3af' }}
            onFocus={(e) => {
              fieldFocus(e)
              e.target.value = durRef.current > 0 ? String(durRef.current) : ''
              setTimeout(() => e.target.select(), 0)
            }}
            onBlur={(e) => {
              fieldBlur(e)
              const v = parseInt(e.target.value, 10)
              durRef.current = isNaN(v) || v < 0 ? 0 : v
              e.target.value = fmtDur(durRef.current)
              e.target.style.color = durRef.current > 0 ? ACCENT : '#9ca3af'
              save({ Duration: durRef.current })
            }}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v >= 0) durRef.current = v
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />

          <Step label="+" onClick={() => {
            durRef.current = durRef.current + 5
            if (durEl.current) {
              const focused = document.activeElement === durEl.current
              durEl.current.value = focused ? String(durRef.current) : fmtDur(durRef.current)
              durEl.current.style.color = ACCENT
            }
            save({ Duration: durRef.current })
          }} />
        </div>
      )}

      {/* ── Int ── */}
      {practice.data_type === 'Int' && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Step label="−" onClick={() => {
            intRef.current = Math.max(0, intRef.current - 1)
            if (intEl.current) {
              intEl.current.value = String(intRef.current)
              intEl.current.style.color = intRef.current > 0 ? ACCENT : '#9ca3af'
            }
            save({ Int: intRef.current })
          }} />

          <input
            ref={intEl}
            type="number"
            min={0}
            defaultValue={intVal}
            className="focus:outline-none text-sm"
            style={{ ...field, width: '3rem', height: '2rem', color: intVal > 0 ? ACCENT : '#9ca3af' }}
            onFocus={(e) => { fieldFocus(e); setTimeout(() => e.target.select(), 0) }}
            onBlur={(e) => {
              fieldBlur(e)
              const v = parseInt(e.target.value, 10)
              intRef.current = isNaN(v) || v < 0 ? 0 : v
              e.target.value = String(intRef.current)
              e.target.style.color = intRef.current > 0 ? ACCENT : '#9ca3af'
              save({ Int: intRef.current })
            }}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v >= 0) intRef.current = v
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />

          <Step label="+" onClick={() => {
            intRef.current = intRef.current + 1
            if (intEl.current) {
              intEl.current.value = String(intRef.current)
              intEl.current.style.color = ACCENT
            }
            save({ Int: intRef.current })
          }} />
        </div>
      )}

      {/* ── Time — HH : MM ── */}
      {practice.data_type === 'Time' && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="number" min={0} max={23}
            defaultValue={String(timeH).padStart(2, '0')}
            className="focus:outline-none"
            style={{
              ...field,
              width: '2.75rem', height: '2.25rem', fontSize: '0.9rem',
              color: (timeH > 0 || timeM > 0) ? ACCENT : '#9ca3af',
            }}
            onFocus={(e) => { fieldFocus(e); setTimeout(() => e.target.select(), 0) }}
            onBlur={(e) => {
              fieldBlur(e)
              const v = parseInt(e.target.value, 10)
              timeHRef.current = isNaN(v) ? 0 : Math.max(0, Math.min(23, v))
              e.target.value = String(timeHRef.current).padStart(2, '0')
              e.target.style.color = (timeHRef.current > 0 || timeMRef.current > 0) ? ACCENT : '#9ca3af'
              save({ Time: { h: timeHRef.current, m: timeMRef.current } })
            }}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v >= 0) {
                const c = Math.min(23, v)
                timeHRef.current = c
                if (c !== v) e.target.value = String(c)
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />
          <span className="text-sm font-bold flex-shrink-0" style={{ color: '#d1d5db' }}>:</span>
          <input
            type="number" min={0} max={59}
            defaultValue={String(timeM).padStart(2, '0')}
            className="focus:outline-none"
            style={{
              ...field,
              width: '2.75rem', height: '2.25rem', fontSize: '0.9rem',
              color: (timeH > 0 || timeM > 0) ? ACCENT : '#9ca3af',
            }}
            onFocus={(e) => { fieldFocus(e); setTimeout(() => e.target.select(), 0) }}
            onBlur={(e) => {
              fieldBlur(e)
              const v = parseInt(e.target.value, 10)
              timeMRef.current = isNaN(v) ? 0 : Math.max(0, Math.min(59, v))
              e.target.value = String(timeMRef.current).padStart(2, '0')
              e.target.style.color = (timeHRef.current > 0 || timeMRef.current > 0) ? ACCENT : '#9ca3af'
              save({ Time: { h: timeHRef.current, m: timeMRef.current } })
            }}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              if (!isNaN(v) && v >= 0) {
                const c = Math.min(59, v)
                timeMRef.current = c
                if (c !== v) e.target.value = String(c)
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />
        </div>
      )}

      {/* ── Text ── */}
      {practice.data_type === 'Text' && (
        <input
          type="text"
          defaultValue={textVal}
          placeholder="—"
          className="focus:outline-none text-sm"
          style={{
            ...field,
            width: '6.5rem', height: '2.25rem',
            padding: '0 0.625rem',
            textAlign: 'left',
            fontWeight: 500,
            color: textVal ? ACCENT : '#9ca3af',
          }}
          onFocus={fieldFocus}
          onBlur={(e) => {
            fieldBlur(e)
            save({ Text: e.target.value })
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
        />
      )}
    </div>
  )
}
