// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Custom cookie storage
const cookieStorage = {
  getItem: (key) => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  },
  setItem: (key, value) => {
    // Set cookie with secure flags
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
  },
  removeItem: (key) => {
    document.cookie = `${key}=; path=/; max-age=0`;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token'
  }
})