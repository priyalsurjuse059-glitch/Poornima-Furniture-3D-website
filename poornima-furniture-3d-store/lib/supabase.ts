import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hasSupabaseConfig(): boolean {
  return Boolean(url && anonKey);
}

export function getSupabase() {
  if (!url || !anonKey) throw new Error('Supabase is not configured. Copy .env.example to .env.local and add your project values.');
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
