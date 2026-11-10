export type Section = 'todo' | 'doing' | 'complete'

export const SECTIONS: { id: Section; label: string }[] = [
  { id: 'todo', label: '未着手' },
  { id: 'doing', label: '進行中' },
  { id: 'complete', label: '完了' },
]

export function isSection(v: unknown): v is Section {
  return SECTIONS.some((s) => s.id === v)
}

export interface Todo {
  id: string
  text: string
  done: boolean
  /** 'YYYY-MM-DD' または '' (期日なし) */
  due: string
  /** 自由記述のメモ。'' = メモなし */
  memo: string
  /** 所属セクション(カンバンの列) */
  section: Section
}

export type Filter = 'all' | 'active' | 'done'

export type View = 'list' | 'board'
