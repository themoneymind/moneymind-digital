import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vnuxoxkozfgfrqjbsifs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXhveGtvemZnZnJxamJzaWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NzM4NzksImV4cCI6MjA0OTM0OTg3OX0.9KIOnPUtEfbVLl5rROW5vMUt9ivhlYLvK4Q_voHxmFA";

// Create Supabase client with additional logging
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      fetch: (url: RequestInfo | URL, options?: RequestInit) => {
        console.log('Supabase API Request:', url);
        return fetch(url, options).then(response => {
          if (!response.ok) {
            console.error('Supabase API Error:', {
              status: response.status,
              statusText: response.statusText,
              url: response.url
            });
          }
          return response;
        }).catch(error => {
          console.error('Supabase Network Error:', error);
          throw error;
        });
      }
    }
  }
);

// Test connection immediately
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase Connection Error:', error);
  } else {
    console.log('Supabase Connection Successful:', data.session ? 'Session exists' : 'No session');
  }
});