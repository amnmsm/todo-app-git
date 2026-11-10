import { useState } from 'react'
import type { Filter } from './types'
import { useTodos } from './hooks/useTodos'
import { useToday } from './hooks/useToday'
import { useDarkMode } from './hooks/useDarkMode'
import { useView } from './hooks/useView'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { FilterBar } from './components/FilterBar'
import { ViewToggle } from './components/ViewToggle'
import { ThemeToggle } from './components/ThemeToggle'

const EMPTY: Record<Filter, string> = {
  all: 'TODO はまだありません',
  active: '未完了の TODO はありません',
  done: '完了した TODO はありません',
}

export default function App() {
  const { todos, add, toggle, remove, setDue, setMemo, edit, move, moveToSection, clearDone } = useTodos()
  const today = useToday()
  const { dark, toggle: toggleTheme } = useDarkMode()
  const { view, setView } = useView()
  const [filter, setFilter] = useState<Filter>('all')

  const visible = todos.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.done : !t.done))
  const remaining = todos.filter((t) => !t.done).length

  return (
    <main className={`mx-auto px-4 py-8 ${view === 'board' ? 'max-w-5xl' : 'max-w-xl'}`}>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">TODO</h1>
        <div className="flex items-center gap-2">
          <ViewToggle view={view} onChange={setView} />
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
        </div>
      </header>
      <TodoForm onAdd={add} />
      <FilterBar
        filter={filter}
        onChange={setFilter}
        remaining={remaining}
        hasDone={todos.length > remaining}
        onClearDone={clearDone}
      />
      <TodoList
        todos={visible}
        today={today}
        view={view}
        sortable={filter === 'all'}
        emptyMessage={EMPTY[filter]}
        onToggle={toggle}
        onRemove={remove}
        onSetDue={setDue}
        onSetMemo={setMemo}
        onEdit={edit}
        onMove={move}
        onMoveToSection={moveToSection}
      />
    </main>
  )
}
