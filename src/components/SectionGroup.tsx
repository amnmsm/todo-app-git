import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Section, Todo } from '../types'
import { sectionDropId } from '../lib/dnd'
import { TodoItem } from './TodoItem'

type ItemHandlers = Omit<React.ComponentProps<typeof TodoItem>, 'todo' | 'today' | 'sortable'>

interface Props extends ItemHandlers {
  section: Section
  label: string
  todos: Todo[]
  today: string
  sortable: boolean
  board: boolean
}

export function SectionGroup({ section, label, todos, today, sortable, board, ...handlers }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: sectionDropId(section), disabled: !sortable })

  return (
    <section
      ref={setNodeRef}
      role="region"
      aria-label={label}
      className={`rounded-xl p-2 ${board ? 'bg-slate-100 dark:bg-slate-900/50' : ''} ${
        isOver ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      <h2 className="mb-2 px-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
        {label} <span className="font-normal text-slate-400">{todos.length}</span>
      </h2>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="min-h-10 space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} today={today} sortable={sortable} {...handlers} />
          ))}
        </ul>
      </SortableContext>
    </section>
  )
}
