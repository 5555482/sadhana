import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { practicesApi } from '../../api/practices'
import type { UserPractice, PracticeValue } from '../../types/api'

interface PracticeCardProps {
  practice: UserPractice
  date: string
  currentValue?: PracticeValue
}

export function PracticeCard({ practice, date, currentValue }: PracticeCardProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasValue = currentValue !== undefined

  const mutation = useMutation({
    mutationFn: (value: PracticeValue) => practicesApi.saveDiaryEntry(date, practice.practice, value),
  })

  const save = useCallback((value: PracticeValue) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => mutation.mutate(value), 600)
  }, [mutation])

  const intVal = currentValue && 'Int' in currentValue ? currentValue.Int : 0
  const boolVal = currentValue && 'Bool' in currentValue ? currentValue.Bool : false
  const textVal = currentValue && 'Text' in currentValue ? currentValue.Text : ''
  const durVal = currentValue && 'Duration' in currentValue ? currentValue.Duration : 0
  const timeH = currentValue && 'Time' in currentValue ? (currentValue as { Time: { h: number; m: number } }).Time.h : 0
  const timeM = currentValue && 'Time' in currentValue ? (currentValue as { Time: { h: number; m: number } }).Time.m : 0

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-3">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">{practice.practice}</h3>
          {hasValue && <span className="badge badge-success badge-xs" />}
        </div>

        {practice.data_type === 'Bool' && (
          <input
            type="checkbox"
            className="toggle toggle-primary"
            defaultChecked={boolVal}
            onChange={(e) => save({ Bool: e.target.checked })}
          />
        )}

        {practice.data_type === 'Int' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle"
              onClick={() => save({ Int: intVal - 1 })}
            >−</button>
            <input
              type="number"
              className="input input-bordered w-20 text-center"
              defaultValue={intVal}
              onChange={(e) => save({ Int: Number(e.target.value) })}
            />
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle"
              onClick={() => save({ Int: intVal + 1 })}
            >+</button>
          </div>
        )}

        {practice.data_type === 'Text' && (
          <input
            type="text"
            className="input input-bordered w-full"
            defaultValue={textVal}
            onChange={(e) => save({ Text: e.target.value })}
          />
        )}

        {practice.data_type === 'Duration' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="input input-bordered w-24"
              defaultValue={durVal}
              onChange={(e) => save({ Duration: Number(e.target.value) })}
            />
            <span className="text-base-content/60 text-sm">min</span>
          </div>
        )}

        {practice.data_type === 'Time' && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={0}
              max={23}
              className="input input-bordered w-16 text-center"
              defaultValue={timeH}
              onChange={(e) => save({ Time: { h: Number(e.target.value), m: timeM } })}
            />
            <span className="font-bold">:</span>
            <input
              type="number"
              min={0}
              max={59}
              className="input input-bordered w-16 text-center"
              defaultValue={timeM}
              onChange={(e) => save({ Time: { h: timeH, m: Number(e.target.value) } })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
