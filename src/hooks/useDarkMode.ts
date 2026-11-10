import { useEffect, useState } from 'react'

const KEY = 'theme'

function initial(): boolean {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) return saved === 'dark'
  } catch {
    // ignore
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [dark, setDark] = useState(initial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggle = () => {
    setDark((d) => {
      try {
        localStorage.setItem(KEY, d ? 'light' : 'dark')
      } catch {
        // ignore
      }
      return !d
    })
  }

  return { dark, toggle }
}
