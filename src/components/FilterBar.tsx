import type { Filter } from '../types'

interface Props {
  filter: Filter
  onChange: (f: Filter) => void
  remaining: number
  hasDone: boolean
  onClearDone: () => void
}

const TABS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'done', label: '完了' },
]

export function FilterBar({ filter, onChange, remaining, hasDone, onClearDone }: Props) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
      <span className="text-slate-500 dark:text-slate-400">残り {remaining} 件</span>
      <div className="flex gap-1" role="group" aria-label="表示フィルタ">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            aria-pressed={filter === t.value}
            onClick={() => onChange(t.value)}
            className={`rounded-full px-3 py-1 transition ${
              filter === t.value
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onClearDone}
        disabled={!hasDone}
        className="text-slate-500 underline-offset-2 hover:underline disabled:invisible dark:text-slate-400"
      >
        完了を削除
      </button>
    </div>
  )
}
