import type { View } from '../types'

interface Props {
  view: View
  onChange: (view: View) => void
}

const OPTIONS: { id: View; label: string }[] = [
  { id: 'list', label: 'リスト' },
  { id: 'board', label: 'カンバン' },
]

export function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-sm dark:bg-slate-700">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={view === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-md px-3 py-1 transition ${
            view === o.id ? 'bg-white shadow-sm dark:bg-slate-900' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
