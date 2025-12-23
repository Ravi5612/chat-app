// src/supabase/client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  throw new Error('Missing Supabase configuration');
}

// Custom cookie storage with better error handling
const cookieStorage = {
  getItem: (key) => {
    try {
      if (typeof document === 'undefined') return null;
      
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [cookieKey, ...cookieValueParts] = cookie.split('=');
        const trimmedKey = cookieKey.trim();
        if (trimmedKey === key) {
          const cookieValue = cookieValueParts.join('=');
          return decodeURIComponent(cookieValue);
        }
      }
      return null;
    } catch (error) {
      console.warn('Error reading cookie:', error);
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      if (typeof document === 'undefined') return;
      
      // Set cookie with secure flags
      const maxAge = 60 * 60 * 24 * 7; // 7 days
      const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
      const sameSite = 'Lax';
      
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=${sameSite}; ${secureFlag}`;
    } catch (error) {
      console.warn('Error setting cookie:', error);
    }
  },
  
  removeItem: (key) => {
    try {
      if (typeof document === 'undefined') return;
      
      document.cookie = `${key}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (error) {
      console.warn('Error removing cookie:', error);
    }
  }
};

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    flowType: 'pkce', // Recommended for better security
    debug: import.meta.env.DEV // Enable debug in development
  },
  global: {
    headers: {
      'X-Client-Info': 'chat-app-react'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
})

// Helper function to get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

// Helper function for authentication status
export const checkAuth = async () => {
  const session = await getCurrentSession();
  return !!session;
}

// Type definitions for better TypeScript support (optional)
/**
 * @typedef {Object} Database
 */

export default supabase;