import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDarkMode } from './useDarkMode'

describe('useDarkMode', () => {
  it('uses saved theme', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(true)
    expect(document.documentElement).toHaveClass('dark')
  })
  it('falls back to prefers-color-scheme', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList)
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(true)
    vi.restoreAllMocks()
  })
  it('toggle updates class and storage', () => {
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useDarkMode())
    expect(result.current.dark).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.dark).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
    act(() => result.current.toggle())
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
  it('survives storage errors', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('x')
    })
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('x')
    })
    const { result } = renderHook(() => useDarkMode())
    act(() => result.current.toggle())
    expect(result.current.dark).toBe(true)
    spy.mockRestore()
    set.mockRestore()
  })
})
