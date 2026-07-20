import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { practicesApi } from '../../api/practices'
import type { UserPractice, PracticeValue } from '../../types/api'

interface PracticeCardProps {
  practice: UserPractice
  date: string
  currentValue?: PracticeValue
}

const inputCls = 'h-10 px-3 text-sm rounded-xl text-base-content focus:outline-none transition-colors'
const inputStyle = {
  background: 'rgba(255,255,255,0.6)',
  border: '1px solid rgba(0,0,0,0.10)',
}
const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = 'rgba(99,102,241,0.5)'
}
const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = 'rgba(0,0,0,0.10)'
}

export function PracticeCard({ practice, date, currentValue }: PracticeCardProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasValue = currentValue !== undefined

  const mutation = useMutation({
    mutationFn: (value: PracticeValue) =>
      practicesApi.saveDiaryEntry(date, practice.practice, value),
  })

  const save = useCallback(
    (value: PracticeValue) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => mutation.mutate(value), 600)
    },
    [mutation],
  )

  const intVal = currentValue && 'Int' in currentValue ? currentValue.Int : 0
  const boolVal = currentValue && 'Bool' in currentValue ? currentValue.Bool : false
  const textVal = currentValue && 'Text' in currentValue ? currentValue.Text : ''
  const durVal = currentValue && 'Duration' in currentValue ? currentValue.Duration : 0
  const timeH =
    currentValue && 'Time' in currentValue
      ? (currentValue as { Time: { h: number; m: number } }).Time.h
      : 0
  const timeM =
    currentValue && 'Time' in currentValue
      ? (currentValue as { Time: { h: number; m: number } }).Time.m
      : 0

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(255, 255, 255, 0.90)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.80)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-base-content">{practice.practice}</h3>
        {hasValue && (
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#01a386' }}
          />
        )}
      </div>

      {/* Bool — custom pill toggle */}
      {practice.data_type === 'Bool' && (
        <button
          type="button"
          role="switch"
          aria-checked={boolVal}
          onClick={() => save({ Bool: !boolVal })}
          className="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none self-start"
          style={{ backgroundColor: boolVal ? '#01a386' : 'rgba(0,0,0,0.15)' }}
        >
          <span
            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
            style={{ transform: boolVal ? 'translateX(1.25rem)' : 'translateX(0)' }}
          />
        </button>
      )}

      {/* Int — stepper */}
      {practice.data_type === 'Int' && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-medium transition-colors"
            style={{ ...inputStyle, color: '#01a386' }}
            onClick={() => save({ Int: intVal - 1 })}
          >
            −
          </button>
          <input
            type="number"
            className={`${inputCls} w-20 text-center`}
            style={inputStyle}
            defaultValue={intVal}
            onChange={(e) => save({ Int: Number(e.target.value) })}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-medium transition-colors"
            style={{ ...inputStyle, color: '#01a386' }}
            onClick={() => save({ Int: intVal + 1 })}
          >
            +
          </button>
        </div>
      )}

      {/* Text */}
      {practice.data_type === 'Text' && (
        <input
          type="text"
          className={`${inputCls} w-full`}
          style={inputStyle}
          defaultValue={textVal}
          onChange={(e) => save({ Text: e.target.value })}
          onFocus={inputFocus}
          onBlur={inputBlur}
        />
      )}

      {/* Duration */}
      {practice.data_type === 'Duration' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={`${inputCls} w-24`}
            style={inputStyle}
            defaultValue={durVal}
            onChange={(e) => save({ Duration: Number(e.target.value) })}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <span className="text-sm text-base-content/50">min</span>
        </div>
      )}

      {/* Time */}
      {practice.data_type === 'Time' && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            max={23}
            className={`${inputCls} w-16 text-center`}
            style={inputStyle}
            defaultValue={timeH}
            onChange={(e) => save({ Time: { h: Number(e.target.value), m: timeM } })}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <span className="font-bold text-base-content/60">:</span>
          <input
            type="number"
            min={0}
            max={59}
            className={`${inputCls} w-16 text-center`}
            style={inputStyle}
            defaultValue={timeM}
            onChange={(e) => save({ Time: { h: timeH, m: Number(e.target.value) } })}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>
      )}
    </div>
  )
}
