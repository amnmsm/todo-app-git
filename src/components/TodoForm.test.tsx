import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoForm } from './TodoForm'

describe('TodoForm', () => {
  it('submits trimmed text with due and clears fields', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoForm onAdd={onAdd} />)
    const input = screen.getByPlaceholderText('やることを入力')
    await user.type(input, '  買い物  ')
    await user.type(screen.getByLabelText('期日'), '2026-05-01')
    await user.click(screen.getByRole('button', { name: '追加' }))
    expect(onAdd).toHaveBeenCalledWith('買い物', '2026-05-01')
    expect(input).toHaveValue('')
    expect(screen.getByLabelText('期日')).toHaveValue('')
    expect(input).toHaveFocus()
  })
  it('ignores whitespace-only text', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<TodoForm onAdd={onAdd} />)
    await user.type(screen.getByPlaceholderText('やることを入力'), '   {Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })
})
