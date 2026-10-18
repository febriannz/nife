import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase aktif hanya jika env terisi dengan benar.
 * Jika tidak, aplikasi berjalan dalam Mode Demo (data contoh lokal).
 */
export const isSupabaseConfigured = Boolean(
  url &&
    anonKey &&
    /^https?:\/\//.test(url) &&
    !url.includes('your-project') &&
    !anonKey.includes('your-anon-key'),
)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
