import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

/** Profil yang dipakai saat berjalan tanpa Supabase (Mode Demo). */
const DEMO_USER = {
  id: 'demo-user',
  email: 'febrian.mf@gmail.com',
  user_metadata: { full_name: 'Nadia Rachel' },
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback((email, password) => supabase.auth.signInWithPassword({ email, password }), [])
  const signUp = useCallback((email, password) => supabase.auth.signUp({ email, password }), [])
  const signOut = useCallback(() => (supabase ? supabase.auth.signOut() : Promise.resolve()), [])

  return { user, loading, isDemo: !isSupabaseConfigured, signIn, signUp, signOut }
}
