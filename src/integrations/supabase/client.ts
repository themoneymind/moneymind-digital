import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vnuxoxkozfgfrqjbsifs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXhveGtvemZnZnJxamJzaWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MzQxNjAsImV4cCI6MjAyMDMxMDE2MH0.sGTb3FocGBzuPDJcAXnVh-QI4lT5Qz-nW_aJ_DXUdxY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});