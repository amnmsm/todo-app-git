import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

interface Props {
  onAdd: (text: string, due: string) => void
}

export function TodoForm({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [due, setDue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, due)
    setText('')
    setDue('')
    inputRef.current?.focus()
  }

  const field =
    'min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800'

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="やることを入力"
        autoComplete="off"
        required
        className={`${field} flex-1 basis-48`}
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        aria-label="期日"
        className={field}
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 active:scale-95"
      >
        追加
      </button>
    </form>
  )
}
