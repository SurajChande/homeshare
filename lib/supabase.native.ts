import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { supabaseAnonKey, supabaseUrl } from './supabase-env';

export { isSupabaseConfigured } from './supabase-env';

const nativeAuthStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      storage: nativeAuthStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);

export function getPublicImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('listing-images').getPublicUrl(path);
  return data.publicUrl;
}
