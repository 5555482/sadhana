import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WeekCalendar } from './WeekCalendar'

describe('WeekCalendar — Today button', () => {
  it('shows Today button when selected date is not today', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    render(<WeekCalendar date={yesterday} onDateChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument()
  })

  it('hides Today button when selected date is today', () => {
    render(<WeekCalendar date={new Date()} onDateChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /today/i })).not.toBeInTheDocument()
  })

  it('calls onDateChange with today when Today button clicked', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const onDateChange = vi.fn()
    render(<WeekCalendar date={yesterday} onDateChange={onDateChange} />)
    await userEvent.click(screen.getByRole('button', { name: /today/i }))
    expect(onDateChange).toHaveBeenCalledOnce()
  })
})
