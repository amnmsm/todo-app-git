import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../types'

interface Props {
  todo: Todo
  today: string
  sortable: boolean
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSetDue: (id: string, due: string) => void
  onSetMemo: (id: string, memo: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoItem({ todo, today, sortable, onToggle, onRemove, onSetDue, onSetMemo, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [memoOpen, setMemoOpen] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const cancelled = useRef(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
    disabled: !sortable,
  })

  const overdue = !!todo.due && !todo.done && todo.due < today

  const startEdit = () => {
    setDraft(todo.text)
    cancelled.current = false
    setEditing(true)
  }
  const commit = () => {
    if (cancelled.current) return
    onEdit(todo.id, draft)
    setEditing(false)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return // IME変換確定のEnterは無視
    if (e.key === 'Enter') commit()
    else if (e.key === 'Escape') {
      cancelled.current = true // 直後の blur で確定されないようにする
      setEditing(false)
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`todo-enter flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm [overflow-wrap:anywhere] dark:bg-slate-800 ${
        isDragging ? 'relative z-10 shadow-lg ring-2 ring-blue-500/50' : ''
      }`}
    >
      {sortable && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`「${todo.text}」を並べ替え`}
          className="cursor-grab touch-none select-none px-1 text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:hover:text-slate-200"
        >
          ⠿
        </button>
      )}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label="完了"
        className="size-5 shrink-0 accent-blue-600"
      />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commit}
          aria-label="本文を編集"
          className="min-w-0 flex-1 rounded border border-blue-500 bg-transparent px-2 py-0.5 outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="ダブルクリックで編集"
          className={`flex-1 ${todo.done ? 'text-slate-400 line-through dark:text-slate-500' : ''}`}
        >
          {todo.text}
        </span>
      )}
      {todo.due && (
        <span
          className={`whitespace-nowrap text-xs ${
            overdue ? 'font-bold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {overdue ? '⚠ 期限切れ' : '期限'}
        </span>
      )}
      <input
        type="date"
        value={todo.due}
        onChange={(e) => onSetDue(todo.id, e.target.value)}
        aria-label={`「${todo.text}」の期日`}
        className={`shrink-0 rounded border bg-transparent px-1 py-0.5 text-xs ${
          overdue ? 'border-red-600 text-red-600 dark:border-red-400 dark:text-red-400' : 'border-slate-300 dark:border-slate-600'
        }`}
      />
      <button
        type="button"
        onClick={() => setMemoOpen((o) => !o)}
        aria-label={`「${todo.text}」のメモを開く`}
        aria-expanded={memoOpen}
        data-has-memo={todo.memo !== ''}
        className={`rounded-md px-1.5 py-1 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
          todo.memo ? '' : 'opacity-40'
        }`}
      >
        📝
      </button>
      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        aria-label="削除"
        className="rounded-md bg-red-600 px-2.5 py-1 text-sm text-white transition hover:bg-red-700 active:scale-95"
      >
        削除
      </button>
      {memoOpen && (
        <textarea
          value={todo.memo}
          onChange={(e) => onSetMemo(todo.id, e.target.value)}
          aria-label={`「${todo.text}」のメモ`}
          placeholder="メモ"
          rows={3}
          className="basis-full rounded border border-slate-300 bg-transparent px-2 py-1 text-sm dark:border-slate-600"
        />
      )}
    </li>
  )
}
