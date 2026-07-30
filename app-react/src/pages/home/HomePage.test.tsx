import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage, SectionLabel } from './HomePage'

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

  it('prefetches diary entries for the other 6 days of the visible week on mount', async () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const prefetchSpy = vi.spyOn(qc, 'prefetchQuery').mockResolvedValue(undefined)

    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter><HomePage /></MemoryRouter>
      </QueryClientProvider>
    )

    await screen.findByText('Meditation')

    const diaryPrefetches = prefetchSpy.mock.calls.filter(
      call => Array.isArray(call[0].queryKey) && call[0].queryKey[0] === 'diary'
    )
    expect(diaryPrefetches).toHaveLength(6)
  })
})

describe('SectionLabel', () => {
  it('renders label text and a decorative horizontal rule', () => {
    const { container } = render(<SectionLabel label="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    // outer element must have exactly 2 children: the <p> and the rule <div>
    expect(container.firstChild?.childNodes).toHaveLength(2)
  })
})
