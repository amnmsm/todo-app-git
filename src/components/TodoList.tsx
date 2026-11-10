import { DndContext, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { Section, Todo, View } from '../types'
import { SECTIONS } from '../types'
import { resolveDrop } from '../lib/dnd'
import { SectionGroup } from './SectionGroup'

interface Props {
  todos: Todo[]
  today: string
  view: View
  /** フィルタ中は並べ替え・セクション移動不可 */
  sortable: boolean
  emptyMessage: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onSetDue: (id: string, due: string) => void
  onSetMemo: (id: string, memo: string) => void
  onEdit: (id: string, text: string) => void
  onMove: (fromId: string, toId: string) => void
  onMoveToSection: (id: string, section: Section, beforeId?: string) => void
}

export function TodoList({ todos, today, view, sortable, emptyMessage, onMove, onMoveToSection, ...handlers }: Props) {
  const sensors = useSensors(
    // 誤ドラッグ防止(クリックと区別)
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const action = resolveDrop(todos, String(active.id), over ? String(over.id) : null)
    if (!action) return
    if (action.type === 'reorder') onMove(action.fromId, action.toId)
    else onMoveToSection(action.id, action.section, action.beforeId)
  }

  if (todos.length === 0) {
    return <p className="mt-6 text-center text-slate-400">{emptyMessage}</p>
  }

  const board = view === 'board'
  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div
        data-testid={board ? 'board' : 'list'}
        className={board ? 'mt-3 grid items-start gap-3 md:grid-cols-3' : 'mt-3 space-y-3'}
      >
        {SECTIONS.map((s) => (
          <SectionGroup
            key={s.id}
            section={s.id}
            label={s.label}
            todos={todos.filter((t) => t.section === s.id)}
            today={today}
            sortable={sortable}
            board={board}
            {...handlers}
          />
        ))}
      </div>
    </DndContext>
  )
}
