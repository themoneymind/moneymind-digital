import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vnuxoxkozfgfrqjbsifs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXhveGtvemZnZnJxamJzaWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NzM4NzksImV4cCI6MjA0OTM0OTg3OX0.9KIOnPUtEfbVLl5rROW5vMUt9ivhlYLvK4Q_voHxmFA";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);