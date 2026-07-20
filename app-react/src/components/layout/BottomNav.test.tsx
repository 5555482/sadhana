import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BottomNav } from './BottomNav'

function renderWithRouter(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders all 4 tabs', () => {
    renderWithRouter('/')
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /charts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /yatras/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('marks the active tab with aria-current', () => {
    renderWithRouter('/charts')
    expect(screen.getByRole('link', { name: /charts/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current', 'page')
  })
})
