import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'

interface Props {
  todos: Todo[]
  today: string
  /** フィルタ中は並べ替え不可 */
  sortable: boolean
  emptyMessage: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSetDue: (id: string, due: string) => void
  onSetMemo: (id: string, memo: string) => void
  onEdit: (id: string, text: string) => void
  onMove: (fromId: string, toId: string) => void
}

export function TodoList({ todos, today, sortable, emptyMessage, onMove, ...handlers }: Props) {
  const sensors = useSensors(
    // 誤ドラッグ防止(クリックと区別)
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) onMove(String(active.id), String(over.id))
  }

  if (todos.length === 0) {
    return <p className="mt-6 text-center text-slate-400">{emptyMessage}</p>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="mt-3 space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} today={today} sortable={sortable} {...handlers} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
