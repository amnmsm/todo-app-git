import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ViewToggle } from './ViewToggle'

describe('ViewToggle', () => {
  it('marks current view and calls onChange', async () => {
    const onChange = vi.fn()
    render(<ViewToggle view="list" onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'リスト' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'カンバン' }))
    expect(onChange).toHaveBeenCalledWith('board')
  })
})
