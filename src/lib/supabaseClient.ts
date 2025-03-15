import { supabase } from './supabase';

// Type-safe wrapper functions for common operations
export const supabaseClient = supabase;

export const customSupabase = {
  auth: {
    signIn: async (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string) => {
      return supabase.auth.signUp({ email, password });
    },
    signOut: async () => {
      return supabase.auth.signOut();
    },
    resetPassword: async (email: string) => {
      return supabase.auth.resetPasswordForEmail(email);
    },
    getSession: async () => {
      return supabase.auth.getSession();
    },
    getUser: async () => {
      return supabase.auth.getUser();
    }
  },
  
  from: (table: string) => supabase.from(table),
  
  storage: {
    from: (bucket: string) => supabase.storage.from(bucket)
  },
  
  claims: {
    from: (table: string) => supabase.from(table),
    newClaim: async (data) => {
      const { error } = await supabase.from('NewClaim').insert([data]);
      if (error) throw error;
      return true;
    },
    getClaims: async () => {
      const { data, error } = await supabase.from('claims').select('*');
      if (error) throw error;
      return data;
    },
  },
};