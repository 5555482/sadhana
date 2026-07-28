import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DurationQuickAddModal } from './PracticeCard'

describe('DurationQuickAddModal', () => {
  it('calls onAdd with parsed number and then onClose', async () => {
    const onAdd = vi.fn()
    const onClose = vi.fn()
    render(<DurationQuickAddModal onAdd={onAdd} onClose={onClose} />)
    await userEvent.type(screen.getByLabelText('minutes'), '45')
    await userEvent.click(screen.getByText('Add'))
    expect(onAdd).toHaveBeenCalledWith(45)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose without onAdd for empty input', async () => {
    const onAdd = vi.fn()
    const onClose = vi.fn()
    render(<DurationQuickAddModal onAdd={onAdd} onClose={onClose} />)
    await userEvent.click(screen.getByText('Add'))
    expect(onAdd).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<DurationQuickAddModal onAdd={vi.fn()} onClose={onClose} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })

  it('disables Add button while isPending', () => {
    render(<DurationQuickAddModal onAdd={vi.fn()} onClose={vi.fn()} isPending={true} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })
})

describe('DurationQuickAddModal — duration hint', () => {
  it('shows hint text when input is focused', async () => {
    render(<DurationQuickAddModal onAdd={vi.fn()} onClose={vi.fn()} />)
    const input = screen.getByLabelText('minutes')
    await userEvent.click(input)
    expect(screen.getByText(/total minutes/i)).toBeInTheDocument()
  })

  it('hides hint text when input is not focused', () => {
    render(<DurationQuickAddModal onAdd={vi.fn()} onClose={vi.fn()} />)
    expect(screen.queryByText(/total minutes/i)).not.toBeInTheDocument()
  })
})
