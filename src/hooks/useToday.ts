import { useEffect, useState } from 'react'
import { today } from '../lib/date'

// 日付をまたいだ後にタブへ戻ったとき、期限切れ表示を更新するための「今日」
export function useToday(): string {
  const [day, setDay] = useState(today)

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') setDay(today())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return day
}
