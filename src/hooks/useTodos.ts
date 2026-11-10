import { useCallback, useEffect, useState } from 'react'
import type { Todo } from '../types'
import { isValidDate } from '../lib/date'
import { loadTodos, newId, saveTodos } from '../lib/storage'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const add = useCallback((text: string, due: string) => {
    setTodos((prev) => [...prev, { id: newId(), text, done: false, due }])
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

  const clearDone = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.done))
  }, [])

  return { todos, add, toggle, remove, setDue, edit, move, clearDone }
}
