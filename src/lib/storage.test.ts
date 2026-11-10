import { describe, expect, it, vi } from 'vitest'
import { loadTodos, newId, saveTodos } from './storage'

describe('storage', () => {
  it('round-trips todos', () => {
    const todos = [{ id: 'a', text: 'x', done: true, due: '2026-01-01' }]
    saveTodos(todos)
    expect(loadTodos()).toEqual(todos)
  })
  it('returns [] when empty, invalid JSON or non-array', () => {
    expect(loadTodos()).toEqual([])
    localStorage.setItem('todos', '{bad')
    expect(loadTodos()).toEqual([])
    localStorage.setItem('todos', '{"a":1}')
    expect(loadTodos()).toEqual([])
  })
  it('filters invalid entries and normalizes fields', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([null, { text: 1 }, { id: 5, text: 'ok', done: 'yes', due: '2026-02-30' }, { text: 'noid' }]),
    )
    const r = loadTodos()
    expect(r).toHaveLength(2)
    expect(r[0]).toEqual({ id: '5', text: 'ok', done: false, due: '' })
    expect(r[1].id).toBeTruthy()
    expect(r[1].text).toBe('noid')
  })
  it('ignores storage errors', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('x')
    })
    expect(loadTodos()).toEqual([])
    get.mockRestore()
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('x')
    })
    expect(() => saveTodos([])).not.toThrow()
    set.mockRestore()
  })
  it('newId is unique', () => {
    expect(new Set(Array.from({ length: 50 }, newId)).size).toBe(50)
  })
})
