import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { HomeHeaderActions } from './HomeHeaderActions'
import { useUiStore } from '../../store/uiStore'

function wrap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('HomeHeaderActions', () => {
  it('renders Practices and Yatras triggers but not Reports', () => {
    wrap(<HomeHeaderActions />)
    expect(screen.getByRole('button', { name: /Practices/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Yatras/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Reports/ })).not.toBeInTheDocument()
  })

  it('Practices menu links to add/edit', () => {
    wrap(<HomeHeaderActions />)
    fireEvent.click(screen.getByRole('button', { name: /Practices/ }))
    expect(screen.getByRole('menuitem', { name: 'Add new practice' })).toHaveAttribute('href', '/user/practice/new')
    expect(screen.getByRole('menuitem', { name: 'Edit practices' })).toHaveAttribute('href', '/user/practices')
  })

  it('Yatras menu: View yatras scrolls to #home-yatras, Create fires requestYatraCreate', () => {
    const scrollSpy = vi.fn()
    // jsdom does not implement scrollIntoView; define it so we can assert the call.
    Element.prototype.scrollIntoView = scrollSpy
    const before = useUiStore.getState().yatraCreateNonce
    render(
      <MemoryRouter>
        <div id="home-yatras" />
        <HomeHeaderActions />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Yatras/ }))
    const view = screen.getByRole('menuitem', { name: 'View yatras' })
    expect(view).not.toHaveAttribute('href') // it's an action button, not a link
    fireEvent.click(view)
    expect(scrollSpy).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /Yatras/ }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Create new yatra' }))
    expect(useUiStore.getState().yatraCreateNonce).toBe(before + 1)
  })
})
