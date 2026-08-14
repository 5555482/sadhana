import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomeHeaderActions } from './HomeHeaderActions'
import { useUiStore } from '../../store/uiStore'

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('HomeHeaderActions', () => {
  it('renders the three menu triggers', () => {
    wrap(<HomeHeaderActions />)
    expect(screen.getByRole('button', { name: /Practices/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Yatras/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reports/ })).toBeInTheDocument()
  })

  it('Practices menu links to add/edit', () => {
    wrap(<HomeHeaderActions />)
    fireEvent.click(screen.getByRole('button', { name: /Practices/ }))
    expect(screen.getByRole('menuitem', { name: 'Add new practice' })).toHaveAttribute('href', '/user/practice/new')
    expect(screen.getByRole('menuitem', { name: 'Edit practices' })).toHaveAttribute('href', '/user/practices')
  })

  it('Reports menu links to new/manage', () => {
    wrap(<HomeHeaderActions />)
    fireEvent.click(screen.getByRole('button', { name: /Reports/ }))
    expect(screen.getByRole('menuitem', { name: 'New report' })).toHaveAttribute('href', '/charts/new')
    expect(screen.getByRole('menuitem', { name: 'Manage reports' })).toHaveAttribute('href', '/charts')
  })

  it('Yatras menu: View links to /yatras, Create fires requestYatraCreate', () => {
    const before = useUiStore.getState().yatraCreateNonce
    wrap(<HomeHeaderActions />)
    fireEvent.click(screen.getByRole('button', { name: /Yatras/ }))
    expect(screen.getByRole('menuitem', { name: 'View yatras' })).toHaveAttribute('href', '/yatras')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Create new yatra' }))
    expect(useUiStore.getState().yatraCreateNonce).toBe(before + 1)
  })
})
