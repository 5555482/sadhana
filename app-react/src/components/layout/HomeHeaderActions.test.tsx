import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomeHeaderActions } from './HomeHeaderActions'

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('HomeHeaderActions', () => {
  it('links "New report" to /charts/new', () => {
    wrap(<HomeHeaderActions />)
    expect(screen.getByRole('link', { name: 'New report' })).toHaveAttribute('href', '/charts/new')
  })

  it('opens the Practices menu to add/edit links', () => {
    wrap(<HomeHeaderActions />)
    // Menu is closed until the trigger is clicked.
    expect(screen.queryByRole('menuitem', { name: 'Add new practice' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Practices/ }))
    expect(screen.getByRole('menuitem', { name: 'Add new practice' })).toHaveAttribute('href', '/user/practice/new')
    expect(screen.getByRole('menuitem', { name: 'Edit practices' })).toHaveAttribute('href', '/user/practices')
  })
})
