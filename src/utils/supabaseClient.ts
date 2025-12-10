// src/utils/supabaseClient.ts
// Supabase Frontend Client Configuration
// Initialized with public anon key (safe for frontend)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);
}

// Create Supabase client for frontend use
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Keep session in localStorage
    autoRefreshToken: true, // Auto-refresh tokens
    detectSessionInUrl: true, // Detect session from URL
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Rate limiting
    },
  },
});

// Helper functions for common operations

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Sign up new user
 */
export const signUpUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

/**
 * Sign in existing user
 */
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get authentication session
 */
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

/**
 * Watch authentication state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  const { data } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session?.user || null);
    }
  );
  return data?.subscription;
};

/**
 * Fetch data from a table
 */
export const fetchTableData = async (
  tableName: string,
  filters?: Record<string, any>
) => {
  let query = supabase.from(tableName).select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  const { data, error } = await query;
  return { data, error };
};

/**
 * Insert data into a table
 */
export const insertTableData = async (
  tableName: string,
  data: Record<string, any>
) => {
  const { data: insertedData, error } = await supabase
    .from(tableName)
    .insert([data])
    .select();

  return { data: insertedData, error };
};

/**
 * Update data in a table
 */
export const updateTableData = async (
  tableName: string,
  id: string,
  updates: Record<string, any>
) => {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select();

  return { data, error };
};

/**
 * Delete data from a table
 */
export const deleteTableData = async (tableName: string, id: string) => {
  const { error } = await supabase.from(tableName).delete().eq('id', id);

  return { error };
};

/**
 * Subscribe to real-time changes
 */
export const subscribeToTableChanges = (
  tableName: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .from(tableName)
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();

  return subscription;
};

console.log('✅ Supabase client initialized');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key configured (safe for frontend)');
