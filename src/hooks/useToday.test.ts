import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useToday } from './useToday'

describe('useToday', () => {
  afterEach(() => vi.useRealTimers())
  it('refreshes when tab becomes visible', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12))
    const { result } = renderHook(() => useToday())
    expect(result.current).toBe('2026-01-01')
    vi.setSystemTime(new Date(2026, 0, 2, 12))
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current).toBe('2026-01-02')
  })
  it('does not refresh when hidden', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 12))
    const { result } = renderHook(() => useToday())
    vi.setSystemTime(new Date(2026, 0, 2, 12))
    const spy = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current).toBe('2026-01-01')
    spy.mockRestore()
  })
})
