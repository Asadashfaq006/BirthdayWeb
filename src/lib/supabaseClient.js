import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Public Supabase client — safe to use on the client side.
 * Uses the anon key with Row Level Security enforced.
 * Make sure your Supabase tables have the correct RLS policies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
