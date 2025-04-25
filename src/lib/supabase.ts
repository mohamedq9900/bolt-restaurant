import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with enhanced configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'restaurant-admin'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection with retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testWithRetry(retries = MAX_RETRIES): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('menu_items').select('count');
    if (error) {
      console.error('Connection test error:', error);
      throw error;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Connection test attempt failed:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await sleep(RETRY_DELAY);
      return testWithRetry(retries - 1);
    }
    console.warn('Failed to connect to Supabase after all retries');
    return false;
  }
}

export const testConnection = async (): Promise<boolean> => {
  try {
    return await testWithRetry();
  } catch (error) {
    console.error('Error testing connection:', error);
    return false;
  }
};

export const isSupabaseAvailable = true;