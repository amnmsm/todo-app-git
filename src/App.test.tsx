import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

async function add(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByPlaceholderText('やることを入力'), text)
  await user.click(screen.getByRole('button', { name: '追加' }))
}

describe('App', () => {
  it('shows empty state', () => {
    render(<App />)
    expect(screen.getByText('TODO はまだありません')).toBeInTheDocument()
    expect(screen.getByText('残り 0 件')).toBeInTheDocument()
  })
  it('adds, completes, filters and clears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await add(user, 'one')
    await add(user, 'two')
    expect(screen.getByText('残り 2 件')).toBeInTheDocument()

    await user.click(screen.getAllByLabelText('完了')[0])
    expect(screen.getByText('残り 1 件')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '未完了' }))
    expect(screen.queryByText('one')).not.toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
    expect(screen.queryByLabelText(/を並べ替え/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '完了' }))
    expect(screen.getByText('one')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '完了を削除' }))
    expect(screen.getByText('完了した TODO はありません')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'すべて' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
  it('shows empty message for active filter', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: '未完了' }))
    expect(screen.getByText('未完了の TODO はありません')).toBeInTheDocument()
  })
  it('persists across remount', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await add(user, 'keep')
    unmount()
    render(<App />)
    expect(screen.getByText('keep')).toBeInTheDocument()
  })
  it('toggles theme', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: 'ダークモードに切り替え' }))
    expect(document.documentElement).toHaveClass('dark')
  })
  it('switches between list and kanban views and remembers it', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await add(user, 'one')
    expect(screen.queryByTestId('board')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'カンバン' }))
    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: '未着手' })).getByText('one')).toBeInTheDocument()
    unmount()
    render(<App />)
    expect(screen.getByTestId('board')).toBeInTheDocument()
  })
})
