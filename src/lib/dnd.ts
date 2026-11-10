import type { Section, Todo } from '../types'
import { isSection } from '../types'

export const SECTION_PREFIX = 'section:'
export const sectionDropId = (s: Section) => SECTION_PREFIX + s

export type DropAction =
  | { type: 'reorder'; fromId: string; toId: string }
  | { type: 'section'; id: string; section: Section; beforeId?: string }

/** ドラッグ終了時の active/over から実行すべき操作を決める */
export function resolveDrop(todos: Todo[], activeId: string, overId: string | null): DropAction | null {
  if (!overId || activeId === overId) return null
  const active = todos.find((t) => t.id === activeId)
  if (!active) return null
  if (overId.startsWith(SECTION_PREFIX)) {
    const section = overId.slice(SECTION_PREFIX.length)
    if (!isSection(section) || section === active.section) return null
    return { type: 'section', id: activeId, section }
  }
  const over = todos.find((t) => t.id === overId)
  if (!over) return null
  if (over.section === active.section) return { type: 'reorder', fromId: activeId, toId: overId }
  return { type: 'section', id: activeId, section: over.section, beforeId: overId }
}
