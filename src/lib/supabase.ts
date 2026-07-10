import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function isSupabaseReady(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_project_url' && supabaseAnonKey !== 'your_anon_key');
}

if (!isSupabaseReady()) {
  console.warn('Supabase URL or ANON_KEY not configured, using mock data');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '') as SupabaseClient;