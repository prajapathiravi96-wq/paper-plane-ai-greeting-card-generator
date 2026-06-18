import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'your_supabase_url_here' &&
    supabaseKey !== 'your_supabase_key_here'
  );
};

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase Client Initialized successfully.');
  } catch (error) {
    console.error('Error initializing Supabase client:', error.message);
  }
} else {
  console.log('Supabase credentials missing. Server operating in offline in-memory fallback mode.');
}

export { supabase };
