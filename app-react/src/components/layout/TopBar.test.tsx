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

describe('TopBar home actions', () => {
  it('shows the home actions on the home route', () => {
    wrapAt('/')
    expect(screen.getByRole('link', { name: 'New report' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Practices/ })).toBeInTheDocument()
  })

  it('hides the home actions on other routes', () => {
    wrapAt('/yatras')
    expect(screen.queryByRole('link', { name: 'New report' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Practices/ })).not.toBeInTheDocument()
  })
})
