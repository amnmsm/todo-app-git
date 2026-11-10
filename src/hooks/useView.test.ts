import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useView } from './useView'

describe('useView', () => {
  it('defaults to list, toggles and persists', () => {
    const h = renderHook(() => useView())
    expect(h.result.current.view).toBe('list')
    act(() => h.result.current.setView('board'))
    expect(h.result.current.view).toBe('board')
    expect(localStorage.getItem('view')).toBe('board')
    expect(renderHook(() => useView()).result.current.view).toBe('board')
  })
  it('ignores invalid stored value', () => {
    localStorage.setItem('view', 'x')
    expect(renderHook(() => useView()).result.current.view).toBe('list')
  })
})
