import { supabase } from '../lib/supabase';

// Util functions for checking authentication
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  if (!data.session) {
    return null;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error getting user:', userError);
    return null;
  }

  return userData.user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }
  
  return data;
};