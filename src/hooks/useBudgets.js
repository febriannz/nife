import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_BUDGETS } from '../lib/constants'

const keyFor = (userId) => `nife-budgets:${userId ?? 'guest'}`

/**
 * Kuota anggaran bulanan per kategori — bisa diubah user.
 * Tersimpan di localStorage, terpisah per akun (key: nife-budgets:<user_id>).
 */
export function useBudgets(userId) {
  const [budgets, setBudgetsState] = useState(DEFAULT_BUDGETS)

  useEffect(() => {
    if (!userId) return
    try {
      const raw = localStorage.getItem(keyFor(userId))
      if (raw) {
        const parsed = JSON.parse(raw)
        // merge dengan default agar kategori yang belum diatur tetap punya nilai
        setBudgetsState({ ...DEFAULT_BUDGETS, ...parsed })
      } else {
        setBudgetsState(DEFAULT_BUDGETS)
      }
    } catch {
      setBudgetsState(DEFAULT_BUDGETS)
    }
  }, [userId])

  const saveBudgets = useCallback(
    (next) => {
      setBudgetsState(next)
      try {
        localStorage.setItem(keyFor(userId), JSON.stringify(next))
      } catch {
        // localStorage penuh / diblokir — state tetap ter-update untuk sesi ini
      }
    },
    [userId],
  )

  const resetBudgets = useCallback(() => saveBudgets(DEFAULT_BUDGETS), [saveBudgets])

  return { budgets, saveBudgets, resetBudgets }
}
