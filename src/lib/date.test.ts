import { afterEach, describe, expect, it, vi } from 'vitest'
import { isValidDate, today } from './date'

describe('isValidDate', () => {
  it('accepts real dates', () => {
    expect(isValidDate('2026-11-10')).toBe(true)
    expect(isValidDate('2024-02-29')).toBe(true)
  })
  it('rejects bad formats and non-strings', () => {
    for (const v of ['', '2026-1-1', '20261110', 'abc', null, undefined, 20261110]) {
      expect(isValidDate(v)).toBe(false)
    }
  })
  it('rejects nonexistent dates', () => {
    expect(isValidDate('2026-02-30')).toBe(false)
    expect(isValidDate('2025-02-29')).toBe(false)
    expect(isValidDate('2026-13-01')).toBe(false)
  })
})

describe('today', () => {
  afterEach(() => vi.useRealTimers())
  it('returns local date zero-padded', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 5, 12))
    expect(today()).toBe('2026-01-05')
  })
})
