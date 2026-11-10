import { useState } from 'react'
import type { View } from '../types'

const KEY = 'view'

function initial(): View {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'list' || saved === 'board') return saved
  } catch {
    // ignore
  }
  return 'list'
}

export function useView() {
  const [view, set] = useState<View>(initial)
  const setView = (v: View) => {
    set(v)
    try {
      localStorage.setItem(KEY, v)
    } catch {
      // ignore
    }
  }
  return { view, setView }
}
