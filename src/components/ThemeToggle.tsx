interface Props {
  dark: boolean
  onToggle: () => void
}

export function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="rounded-full p-2 text-xl transition hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
