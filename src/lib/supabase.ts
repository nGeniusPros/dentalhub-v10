import { createClient } from '@supabase/supabase-js';

// Environment variables should be loaded from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Initializes and returns the Supabase client.
 * For use in places where we want to explicitly control when Supabase is initialized.
 */
export const initSupabase = () => {
  return supabase;
};

export default supabase;