import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { TopBar } from './TopBar'

function wrapAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <TopBar />
    </MemoryRouter>,
  )
}

describe('TopBar', () => {
  it('shows the home actions on the home route', () => {
    wrapAt('/')
    expect(screen.getByRole('button', { name: /Practices/ })).toBeInTheDocument()
  })

  it('hides the home actions on other routes', () => {
    wrapAt('/yatras')
    expect(screen.queryByRole('button', { name: /Practices/ })).not.toBeInTheDocument()
  })

  it('does not render a Yatras link in the desktop nav', () => {
    wrapAt('/')
    expect(screen.queryByRole('link', { name: 'Yatras' })).not.toBeInTheDocument()
  })

  it('renders Settings as an icon (aria-label, no visible text)', () => {
    wrapAt('/')
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })
})
