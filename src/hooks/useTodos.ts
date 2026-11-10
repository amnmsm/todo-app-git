import { useCallback, useEffect, useState } from 'react'
import type { Section, Todo } from '../types'
import { isValidDate } from '../lib/date'
import { loadTodos, newId, saveTodos } from '../lib/storage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const add = useCallback((text: string, due: string) => {
    setTodos((prev) => [...prev, { id: newId(), text, done: false, due, memo: '', section: 'todo' }])
  }, [])

  const toggle = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [])

  const remove = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // 空なら期日解除。不正な値は無視
  const setDue = useCallback((id: string, due: string) => {
    if (due && !isValidDate(due)) return
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, due } : t)))
  }, [])

  const setMemo = useCallback((id: string, memo: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, memo } : t)))
  }, [])

  const edit = useCallback((id: string, text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t)))
  }, [])

  const move = useCallback((fromId: string, toId: string) => {
    setTodos((prev) => {
      const from = prev.findIndex((t) => t.id === fromId)
      const to = prev.findIndex((t) => t.id === toId)
      if (from < 0 || to < 0 || from === to) return prev
      const next = prev.slice()
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }, [])

  const moveToSection = useCallback((id: string, section: Section, beforeId?: string) => {
    setTodos((prev) => {
      const item = prev.find((t) => t.id === id)
      if (!item) return prev
      const rest = prev.filter((t) => t.id !== id)
      const moved = { ...item, section }
      const at = beforeId ? rest.findIndex((t) => t.id === beforeId) : -1
      if (at < 0) {
        // 末尾 = 対象セクションの最後の要素の直後
        let last = -1
        rest.forEach((t, i) => {
          if (t.section === section) last = i
        })
        rest.splice(last + 1, 0, moved)
      } else rest.splice(at, 0, moved)
      return rest
    })
  }, [])

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  return { todos, add, toggle, remove, setDue, setMemo, edit, move, moveToSection, clearDone }
}
