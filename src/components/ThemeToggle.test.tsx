import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('labels by mode and toggles', async () => {
    const onToggle = vi.fn()
    const { rerender } = render(<ThemeToggle dark={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button', { name: 'ダークモードに切り替え' }))
    expect(onToggle).toHaveBeenCalled()
    rerender(<ThemeToggle dark onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: 'ライトモードに切り替え' })).toBeInTheDocument()
  })
})
