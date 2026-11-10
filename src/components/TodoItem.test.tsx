import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { TodoItem } from './TodoItem'
import type { Todo } from '../types'

function setup(todo: Partial<Todo> = {}, sortable = true) {
  const t: Todo = { id: '1', text: '牛乳', done: false, due: '', memo: '', section: 'todo', ...todo }
  const h = { onToggle: vi.fn(), onRemove: vi.fn(), onSetDue: vi.fn(), onSetMemo: vi.fn(), onEdit: vi.fn() }
  render(
    <DndContext>
      <SortableContext items={[t.id]}>
        <ul>
          <TodoItem todo={t} today="2026-06-15" sortable={sortable} {...h} />
        </ul>
      </SortableContext>
    </DndContext>,
  )
  return h
}

describe('TodoItem', () => {
  it('toggles memo editor and reports changes', async () => {
    const h = setup()
    expect(screen.queryByLabelText('「牛乳」のメモ')).not.toBeInTheDocument()
    const btn = screen.getByRole('button', { name: '「牛乳」のメモを開く' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    await userEvent.type(screen.getByLabelText('「牛乳」のメモ'), 'a')
    expect(h.onSetMemo).toHaveBeenCalledWith('1', 'a')
  })
  it('shows existing memo when opened and marks the button', async () => {
    setup({ memo: '2%を買う' })
    const btn = screen.getByRole('button', { name: '「牛乳」のメモを開く' })
    expect(btn).toHaveAttribute('data-has-memo', 'true')
    await userEvent.click(btn)
    expect(screen.getByLabelText('「牛乳」のメモ')).toHaveValue('2%を買う')
  })

  it('toggles and removes', async () => {
    const h = setup()
    await userEvent.click(screen.getByLabelText('完了'))
    expect(h.onToggle).toHaveBeenCalledWith('1')
    await userEvent.click(screen.getByRole('button', { name: '削除' }))
    expect(h.onRemove).toHaveBeenCalledWith('1')
  })
  it('strikes through done items', () => {
    setup({ done: true })
    expect(screen.getByText('牛乳')).toHaveClass('line-through')
  })
  it('shows overdue only for undone past due', () => {
    setup({ due: '2026-06-14' })
    expect(screen.getByText('⚠ 期限切れ')).toBeInTheDocument()
  })
  it('shows plain label when due in future or done', () => {
    setup({ due: '2026-06-15' })
    expect(screen.getByText('期限')).toBeInTheDocument()
  })
  it('not overdue when done', () => {
    setup({ due: '2026-06-14', done: true })
    expect(screen.queryByText('⚠ 期限切れ')).not.toBeInTheDocument()
  })
  it('sets due date', () => {
    const h = setup()
    fireEvent.change(screen.getByLabelText('「牛乳」の期日'), { target: { value: '2026-07-01' } })
    expect(h.onSetDue).toHaveBeenCalledWith('1', '2026-07-01')
  })
  it('shows drag handle only when sortable', () => {
    setup({}, false)
    expect(screen.queryByLabelText('「牛乳」を並べ替え')).not.toBeInTheDocument()
  })
  it('shows drag handle when sortable', () => {
    setup()
    expect(screen.getByLabelText('「牛乳」を並べ替え')).toBeInTheDocument()
  })

  describe('editing', () => {
    it('commits on Enter', async () => {
      const h = setup()
      await userEvent.dblClick(screen.getByText('牛乳'))
      const input = screen.getByLabelText('本文を編集')
      await userEvent.clear(input)
      await userEvent.type(input, 'パン{Enter}')
      expect(h.onEdit).toHaveBeenCalledWith('1', 'パン')
      expect(screen.queryByLabelText('本文を編集')).not.toBeInTheDocument()
    })
    it('commits on blur', async () => {
      const h = setup()
      await userEvent.dblClick(screen.getByText('牛乳'))
      await userEvent.type(screen.getByLabelText('本文を編集'), 'X')
      await userEvent.tab()
      expect(h.onEdit).toHaveBeenCalledWith('1', '牛乳X')
    })
    it('cancels on Escape without committing on blur', async () => {
      const h = setup()
      await userEvent.dblClick(screen.getByText('牛乳'))
      await userEvent.type(screen.getByLabelText('本文を編集'), 'X{Escape}')
      expect(h.onEdit).not.toHaveBeenCalled()
      expect(screen.getByText('牛乳')).toBeInTheDocument()
    })
    it('ignores Enter during IME composition', async () => {
      const h = setup()
      await userEvent.dblClick(screen.getByText('牛乳'))
      const input = screen.getByLabelText('本文を編集')
      fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
      expect(h.onEdit).not.toHaveBeenCalled()
    })
  })
})
