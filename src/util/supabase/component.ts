import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      domain: process.env.NEXT_PUBLIC_CO_DEV_ENV === 'preview'
        ? '.preview.co.dev'
        : undefined,
    },
  });

  return supabase;
}
