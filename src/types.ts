export interface Todo {
  id: string
  text: string
  done: boolean
  /** 'YYYY-MM-DD' または '' (期日なし) */
  due: string
  /** 自由記述のメモ。'' = メモなし */
  memo: string
}

export type Filter = 'all' | 'active' | 'done'
