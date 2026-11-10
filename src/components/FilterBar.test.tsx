import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FilterBar } from './FilterBar'

describe('FilterBar', () => {
  it('shows remaining and pressed filter, handles clicks', async () => {
    const onChange = vi.fn()
    const onClearDone = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filter="active" onChange={onChange} remaining={3} hasDone onClearDone={onClearDone} />)
    expect(screen.getByText('残り 3 件')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完了' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'すべて' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: '完了' }))
    expect(onChange).toHaveBeenCalledWith('done')
    await user.click(screen.getByRole('button', { name: '完了を削除' }))
    expect(onClearDone).toHaveBeenCalled()
  })
  it('disables clear button without done todos', () => {
    render(<FilterBar filter="all" onChange={() => {}} remaining={0} hasDone={false} onClearDone={() => {}} />)
    expect(screen.getByRole('button', { name: '完了を削除' })).toBeDisabled()
  })
})
