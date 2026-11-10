import type { Todo } from '../types'
import { isValidDate } from './date'

const STORAGE_KEY = 'todos'

export function newId(): string {
  return String(Date.now()) + Math.random().toString(36).slice(2, 8)
}

// 旧形式を含む保存データを検証・正規化して読み込む
export function loadTodos(): Todo[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!Array.isArray(data)) return []
    return data
      .filter((t): t is Record<string, unknown> => !!t && typeof (t as { text?: unknown }).text === 'string')
      .map((t, i) => ({
        id: t.id != null ? String(t.id) : String(Date.now() + i),
        text: t.text as string,
        done: t.done === true,
        due: isValidDate(t.due) ? t.due : '',
      }))
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // 保存できない環境(容量超過・プライベートモード等)では無視する
  }
}
