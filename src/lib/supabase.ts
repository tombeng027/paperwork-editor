import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url && key)
if (!isSupabaseConfigured) console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect Paperwork to Supabase.')
export const supabase = createClient(url ?? 'https://placeholder.supabase.co', key ?? 'placeholder-anon-key')