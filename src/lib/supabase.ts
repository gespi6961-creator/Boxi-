import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Singleton para el browser con manejo de cookies (compatible con middleware)
let browserInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  if (typeof window === 'undefined') {
    // Server-side: crear nueva instancia (sin cookies, para uso interno)
    return createClient(url, key);
  }

  // Browser-side: usar createBrowserClient para que guarde session en cookies
  // Esto permite que el middleware tambien pueda leer la session
  if (!browserInstance) {
    browserInstance = createBrowserClient(url, key);
  }
  return browserInstance;
}

// Admin client solo server-side
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
