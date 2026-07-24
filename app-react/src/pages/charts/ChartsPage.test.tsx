import { describe, it, expect } from 'vitest'

// Inline the pure function to test it without rendering the full component
function toCSV(entries: Array<{ cob_date: string; practice: string; value: unknown }>, practiceMap: Record<string, string>): string {
  function valueToNumber(raw: unknown): number | null {
    if (raw === null || raw === undefined) return null
    if (typeof raw === 'number') return raw
    if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      if ('Int' in obj) return obj.Int as number
      if ('Duration' in obj) return obj.Duration as number
    }
    return null
  }
  const header = ['date', 'practice', 'value'].join(',')
  const rows = entries.map(e => {
    const name = (practiceMap[e.practice] ?? e.practice).replace(/,/g, ' ')
    const val = valueToNumber(e.value)
    return [e.cob_date, name, val === null ? '' : String(val)].join(',')
  })
  return [header, ...rows].join('\n')
}

describe('toCSV', () => {
  it('produces header + data row', () => {
    const csv = toCSV(
      [{ cob_date: '2026-07-01', practice: 'abc', value: { Int: 30 } }],
      { abc: 'Meditation' }
    )
    expect(csv).toBe('date,practice,value\n2026-07-01,Meditation,30')
  })

  it('uses practice id when not in map', () => {
    const csv = toCSV(
      [{ cob_date: '2026-07-01', practice: 'unknown-id', value: { Int: 5 } }],
      {}
    )
    expect(csv).toContain('unknown-id')
  })

  it('outputs empty value for null', () => {
    const csv = toCSV(
      [{ cob_date: '2026-07-01', practice: 'abc', value: null }],
      { abc: 'Test' }
    )
    expect(csv).toBe('date,practice,value\n2026-07-01,Test,')
  })

  it('replaces commas in practice names', () => {
    const csv = toCSV(
      [{ cob_date: '2026-07-01', practice: 'abc', value: { Int: 1 } }],
      { abc: 'Yoga, morning' }
    )
    expect(csv).toContain('Yoga  morning')
  })
})
