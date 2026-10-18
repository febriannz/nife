import { useCallback, useEffect, useState } from 'react'
import { buildDummyTransactions } from '../lib/dummy'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { uid } from '../lib/utils'

const normalize = (row) => ({ ...row, amount: Number(row.amount) || 0 })

/**
 * Sumber data transaksi:
 * - Mode Demo (tanpa Supabase): data contoh + CRUD lokal.
 * - Dengan Supabase: fetch + realtime subscription + fallback dummy
 *   ketika database masih kosong / gagal dimuat.
 */
export function useTransactions(user) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(!isSupabaseConfigured)

  const demo = !isSupabaseConfigured
  const userId = user?.id

  useEffect(() => {
    if (!userId) return

    if (demo) {
      setRows(buildDummyTransactions())
      setIsFallback(true)
      setLoading(false)
      return
    }

    let active = true

    const load = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!active) return
      if (error || !data || data.length === 0) {
        setRows(buildDummyTransactions())
        setIsFallback(true)
      } else {
        setRows(data.map(normalize))
        setIsFallback(false)
      }
      setLoading(false)
    }

    load()

    const channel = supabase
      .channel(`transactions-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
        (payload) => {
          setIsFallback(false)
          setRows((prev) => {
            const real = prev.filter((r) => !r.isDemo)
            if (payload.eventType === 'INSERT') {
              const next = normalize(payload.new)
              if (real.some((r) => r.id === next.id)) return real
              return [next, ...real]
            }
            if (payload.eventType === 'UPDATE') {
              return real.map((r) => (r.id === payload.new.id ? normalize(payload.new) : r))
            }
            if (payload.eventType === 'DELETE') {
              return real.filter((r) => r.id !== payload.old.id)
            }
            return prev
          })
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [userId, demo])

  const addTransaction = useCallback(
    async (input) => {
      if (demo) {
        const row = {
          ...input,
          id: uid(),
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          isDemo: true,
        }
        setRows((prev) => [row, ...prev])
        return row
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...input, user_id: userId })
        .select()
        .single()
      if (error) throw error
      return data
    },
    [demo, userId],
  )

  const deleteTransaction = useCallback(
    async (id) => {
      const target = rows.find((r) => r.id === id)

      if (demo || target?.isDemo) {
        setRows((prev) => prev.filter((r) => r.id !== id))
        return
      }

      setRows((prev) => prev.filter((r) => r.id !== id)) // optimistic
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
    },
    [demo, rows],
  )

  return { rows, loading, isFallback, addTransaction, deleteTransaction }
}
