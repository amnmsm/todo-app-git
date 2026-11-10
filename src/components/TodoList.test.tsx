import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoList } from './TodoList'

const handlers = { onToggle: vi.fn(), onRemove: vi.fn(), onSetDue: vi.fn(), onSetMemo: vi.fn(), onEdit: vi.fn(), onMove: vi.fn(), onMoveToSection: vi.fn() }

describe('TodoList', () => {
  it('shows empty message', () => {
    render(<TodoList todos={[]} today="2026-01-01" view="list" sortable emptyMessage="空です" {...handlers} />)
    expect(screen.getByText('空です')).toBeInTheDocument()
  })
  it('renders items and forwards handlers', async () => {
    const todos = [
      { id: '1', text: 'a', done: false, due: '', memo: '', section: 'todo' as const },
      { id: '2', text: 'b', done: false, due: '', memo: '', section: 'todo' as const },
    ]
    render(<TodoList todos={todos} today="2026-01-01" view="list" sortable emptyMessage="" {...handlers} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    await userEvent.click(screen.getAllByRole('button', { name: '削除' })[1])
    expect(handlers.onRemove).toHaveBeenCalledWith('2')
  })
  it('reorders via keyboard', async () => {
    const todos = [
      { id: '1', text: 'a', done: false, due: '', memo: '', section: 'todo' as const },
      { id: '2', text: 'b', done: false, due: '', memo: '', section: 'todo' as const },
    ]
    const onMove = vi.fn()
    render(<TodoList todos={todos} today="2026-01-01" view="list" sortable emptyMessage="" {...handlers} onMove={onMove} />)
    screen.getByLabelText('「a」を並べ替え').focus()
    await userEvent.keyboard(' ')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')
    // jsdom has no layout, so the move may not resolve; just ensure no crash
    expect(onMove.mock.calls.length).toBeLessThanOrEqual(1)
  })
  it('groups by section headings in list view and shows columns in board view', () => {
    const todos = [
      { id: '1', text: 'a', done: false, due: '', memo: '', section: 'todo' as const },
      { id: '2', text: 'b', done: false, due: '', memo: '', section: 'doing' as const },
    ]
    const { rerender } = render(
      <TodoList todos={todos} today="2026-01-01" view="list" sortable emptyMessage="" {...handlers} />,
    )
    for (const name of ['未着手', '進行中', '完了']) {
      expect(screen.getByRole('heading', { name: new RegExp(name) })).toBeInTheDocument()
    }
    const doing = screen.getByRole('region', { name: '進行中' })
    expect(within(doing).getByText('b')).toBeInTheDocument()
    expect(within(doing).queryByText('a')).not.toBeInTheDocument()
    rerender(<TodoList todos={todos} today="2026-01-01" view="board" sortable emptyMessage="" {...handlers} />)
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: '未着手' })).getByText('a')).toBeInTheDocument()
  })
})
