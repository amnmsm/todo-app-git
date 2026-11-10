import { describe, expect, it, vi } from 'vitest'
import { loadTodos, newId, saveTodos } from './storage'

describe('storage', () => {
  it('round-trips todos', () => {
    const todos = [{ id: 'a', text: 'x', done: true, due: '2026-01-01', memo: 'm', section: 'doing' as const }]
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
    expect(r[0]).toEqual({ id: '5', text: 'ok', done: false, due: '', memo: '', section: 'todo' })
    expect(r[1].id).toBeTruthy()
    expect(r[1].text).toBe('noid')
  })
  it('keeps string memo and defaults otherwise', () => {
    localStorage.setItem('todos', JSON.stringify([{ id: 'a', text: 'x', memo: 'hi' }, { id: 'b', text: 'y', memo: 3 }]))
    const r = loadTodos()
    expect(r[0].memo).toBe('hi')
    expect(r[1].memo).toBe('')
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
  it('keeps valid section and defaults invalid/legacy to todo', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { id: 'a', text: 'x', section: 'doing' },
        { id: 'b', text: 'y', section: 'complete' },
        { id: 'c', text: 'z', section: 'bogus' },
        { id: 'd', text: 'w' },
      ]),
    )
    expect(loadTodos().map((t) => t.section)).toEqual(['doing', 'complete', 'todo', 'todo'])
  })
})
