import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTodos } from './useTodos'

function setup() {
  const h = renderHook(() => useTodos())
  act(() => {
    h.result.current.add('a', '')
    h.result.current.add('b', '2026-01-01')
    h.result.current.add('c', '')
  })
  return h
}
const texts = (h: ReturnType<typeof setup>) => h.result.current.todos.map((t) => t.text)

describe('useTodos', () => {
  it('adds todos', () => {
    const h = setup()
    expect(texts(h)).toEqual(['a', 'b', 'c'])
    expect(h.result.current.todos[1]).toMatchObject({ done: false, due: '2026-01-01' })
  })
  it('adds with empty memo and setMemo updates only the target', () => {
    const h = setup()
    expect(h.result.current.todos.every((t) => t.memo === '')).toBe(true)
    act(() => h.result.current.setMemo(h.result.current.todos[1].id, 'note\nline2'))
    expect(h.result.current.todos.map((t) => t.memo)).toEqual(['', 'note\nline2', ''])
    expect(JSON.parse(localStorage.getItem('todos')!)[1].memo).toBe('note\nline2')
    act(() => h.result.current.setMemo(h.result.current.todos[1].id, ''))
    expect(h.result.current.todos[1].memo).toBe('')
  })
  it('toggles and removes', () => {
    const h = setup()
    const [a, b] = h.result.current.todos
    act(() => h.result.current.toggle(a.id))
    expect(h.result.current.todos[0].done).toBe(true)
    act(() => h.result.current.remove(b.id))
    expect(texts(h)).toEqual(['a', 'c'])
  })
  it('setDue validates and clears', () => {
    const h = setup()
    const id = h.result.current.todos[0].id
    act(() => h.result.current.setDue(id, '2026-02-30'))
    expect(h.result.current.todos[0].due).toBe('')
    act(() => h.result.current.setDue(id, '2026-03-01'))
    expect(h.result.current.todos[0].due).toBe('2026-03-01')
    act(() => h.result.current.setDue(id, ''))
    expect(h.result.current.todos[0].due).toBe('')
  })
  it('edit trims and ignores empty', () => {
    const h = setup()
    const id = h.result.current.todos[0].id
    act(() => h.result.current.edit(id, '  new  '))
    expect(h.result.current.todos[0].text).toBe('new')
    act(() => h.result.current.edit(id, '   '))
    expect(h.result.current.todos[0].text).toBe('new')
  })
  it('move reorders and ignores invalid', () => {
    const h = setup()
    const [a, , c] = h.result.current.todos
    act(() => h.result.current.move(a.id, c.id))
    expect(texts(h)).toEqual(['b', 'c', 'a'])
    act(() => h.result.current.move(a.id, a.id))
    act(() => h.result.current.move('nope', c.id))
    act(() => h.result.current.move(a.id, 'nope'))
    expect(texts(h)).toEqual(['b', 'c', 'a'])
  })
  it('clearDone removes done todos', () => {
    const h = setup()
    act(() => h.result.current.toggle(h.result.current.todos[0].id))
    act(() => h.result.current.clearDone())
    expect(texts(h)).toEqual(['b', 'c'])
  })
  it('persists and restores', () => {
    const h = setup()
    h.unmount()
    const h2 = renderHook(() => useTodos())
    expect(h2.result.current.todos.map((t) => t.text)).toEqual(['a', 'b', 'c'])
  })
})
