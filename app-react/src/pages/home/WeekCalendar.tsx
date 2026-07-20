import { useRef, useState } from 'react'

interface WeekCalendarProps {
  date: Date
  onDateChange: (d: Date) => void
}

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function addDays(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(d.getDate() + n)
  return result
}

function getWeekDays(date: Date): Date[] {
  const day = date.getDay() // 0=Sun
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

export function WeekCalendar({ date, onDateChange }: WeekCalendarProps) {
  const today = new Date()
  const week = getWeekDays(date)
  const prevWeekDay = addDays(week[0], -1)
  const nextWeekDay = addDays(week[6], 1)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [translateX, setTranslateX] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goToPrevWeek = () => {
    const newDate = date.getDay() === 1
      ? addDays(date, -1)
      : addDays(date, -7)
    onDateChange(newDate)
  }

  const goToNextWeek = () => {
    const newDate = date.getDay() === 0
      ? addDays(date, 1)
      : addDays(date, 7)
    onDateChange(newDate)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStartX.current = t.clientX
    touchStartY.current = t.clientY
    setAnimating(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (Math.abs(dx) < Math.abs(dy)) return
    setTranslateX(Math.max(-120, Math.min(120, dx)))
  }

  const onTouchEnd = () => {
    setAnimating(true)
    if (translateX > 60) goToPrevWeek()
    else if (translateX < -60) goToNextWeek()
    setTranslateX(0)
    touchStartX.current = null
    touchStartY.current = null
  }

  const fullDateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const renderDay = (d: Date, isOutside: boolean, onClick: () => void) => {
    const selected = isSameDay(d, date)
    const isToday = isSameDay(d, today)
    const weekdayIdx = (d.getDay() + 6) % 7 // Mon=0

    return (
      <div
        key={d.toISOString()}
        className={`flex flex-col items-center gap-1 cursor-pointer ${isOutside ? 'opacity-30' : ''}`}
        onClick={() => onClick()}
      >
        <span className={`text-xs ${selected ? 'font-semibold text-gray-600' : 'text-gray-400'}`}>
          {WEEKDAY_LETTERS[weekdayIdx]}
        </span>
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors"
          style={
            selected
              ? { background: '#01a386', color: '#fff' }
              : isToday
              ? { color: '#01a386' }
              : undefined
          }
        >
          {d.getDate()}
        </div>
      </div>
    )
  }

  return (
    <div
      className="select-none touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={`grid grid-cols-9 items-end max-w-sm mx-auto ${animating ? 'transition-transform duration-300 ease-out' : ''}`}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        <div className="flex justify-center">
          {renderDay(prevWeekDay, true, goToPrevWeek)}
        </div>
        {week.map((d) => (
          <div key={d.toISOString()} className="flex justify-center">
            {renderDay(d, false, () => onDateChange(d))}
          </div>
        ))}
        <div className="flex justify-center">
          {renderDay(nextWeekDay, true, goToNextWeek)}
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center mt-2">{fullDateLabel}</p>
    </div>
  )
}
