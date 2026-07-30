import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { HomePage, SectionLabel, DateContextLabel } from './HomePage'

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

  it('shows nothing-logged banner when navigating to a past date with no diary entries', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    // Lock "today" to 2026-07-30 (Wednesday); day 29 is yesterday (past)
    vi.setSystemTime(new Date('2026-07-30T12:00:00'))

    const { practicesApi } = await import('../../api/practices')
    vi.mocked(practicesApi.getDiaryEntries).mockResolvedValue([])

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter><HomePage /></MemoryRouter>
      </QueryClientProvider>
    )

    await screen.findByText('Meditation')

    // Click the day-29 button in the week calendar grid.
    // WeekCalendar renders each day as a <button> whose inner <div> contains the date number.
    const btn29 = Array.from(document.querySelectorAll('button[type="button"]')).find(
      el => el.querySelector('div')?.textContent === '29'
    ) as HTMLElement | undefined
    expect(btn29).toBeTruthy()
    fireEvent.click(btn29!)

    expect(await screen.findByText('Nothing was logged on this day')).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('does not show nothing-logged banner on today even with no diary entries', async () => {
    const { practicesApi } = await import('../../api/practices')
    vi.mocked(practicesApi.getDiaryEntries).mockResolvedValue([])

    wrap(<HomePage />)
    await screen.findByText('Meditation')
    expect(screen.queryByText('Nothing was logged on this day')).not.toBeInTheDocument()
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

describe('DateContextLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    // Fix "today" to 2026-07-30
    vi.setSystemTime(new Date('2026-07-30T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders "Today" for today\'s date', () => {
    render(<DateContextLabel dateStr="2026-07-30" />)
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('renders "Yesterday" for the previous day', () => {
    render(<DateContextLabel dateStr="2026-07-29" />)
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('renders "Tomorrow" for the next day', () => {
    render(<DateContextLabel dateStr="2026-07-31" />)
    expect(screen.getByText('Tomorrow')).toBeInTheDocument()
  })

  it('renders a formatted date for other past dates', () => {
    render(<DateContextLabel dateStr="2026-07-15" />)
    // Should not render "Today", "Yesterday", or "Tomorrow"
    expect(screen.queryByText('Today')).not.toBeInTheDocument()
    expect(screen.queryByText('Yesterday')).not.toBeInTheDocument()
    // Should render some non-empty text (locale-formatted date)
    expect(screen.getByRole('paragraph').textContent?.length).toBeGreaterThan(0)
  })
})
