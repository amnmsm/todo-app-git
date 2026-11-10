export interface Todo {
  id: string
  text: string
  done: boolean
  /** 'YYYY-MM-DD' または '' (期日なし) */
  due: string
}

export type Filter = 'all' | 'active' | 'done'
