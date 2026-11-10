import { describe, expect, it } from 'vitest'
import type { Todo } from '../types'
import { resolveDrop } from './dnd'

const t = (id: string, section: Todo['section']): Todo => ({ id, text: id, done: false, due: '', memo: '', section })
const todos = [t('a', 'todo'), t('b', 'todo'), t('c', 'doing')]

describe('resolveDrop', () => {
  it('returns null without target or on self', () => {
    expect(resolveDrop(todos, 'a', null)).toBeNull()
    expect(resolveDrop(todos, 'a', 'a')).toBeNull()
  })
  it('dropping on a section container moves to that section end', () => {
    expect(resolveDrop(todos, 'a', 'section:complete')).toEqual({ type: 'section', id: 'a', section: 'complete' })
  })
  it('dropping on a section container the item is already in is a no-op', () => {
    expect(resolveDrop(todos, 'a', 'section:todo')).toBeNull()
  })
  it('dropping on an item in the same section reorders', () => {
    expect(resolveDrop(todos, 'a', 'b')).toEqual({ type: 'reorder', fromId: 'a', toId: 'b' })
  })
  it('dropping on an item in another section moves before it', () => {
    expect(resolveDrop(todos, 'a', 'c')).toEqual({ type: 'section', id: 'a', section: 'doing', beforeId: 'c' })
  })
})
