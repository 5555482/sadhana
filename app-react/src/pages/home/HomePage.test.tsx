import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'

vi.mock('../../api/practices', () => ({
  practicesApi: {
    getUserPractices: vi.fn().mockResolvedValue([
      { id: '1', practice: 'Meditation', data_type: 'Bool', is_active: true, is_required: true },
      { id: '2', practice: 'Reading',    data_type: 'Bool', is_active: true, is_required: false },
    ]),
    getDiaryEntries: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('../../hooks/useNetworkStatus', () => ({ default: () => true }))

function wrap(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows Optional divider when mix of required and optional practices exist', async () => {
    wrap(<HomePage />)
    expect(await screen.findByText('Optional')).toBeInTheDocument()
  })

  it('does not show Optional divider when all practices are required', async () => {
    const { practicesApi } = await import('../../api/practices')
    vi.mocked(practicesApi.getUserPractices).mockResolvedValue([
      { id: '1', practice: 'Meditation', data_type: 'Bool', is_active: true, is_required: true },
    ])
    wrap(<HomePage />)
    await screen.findByText('Meditation')
    expect(screen.queryByText('Optional')).not.toBeInTheDocument()
  })
})
