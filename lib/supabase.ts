import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client factory.
 *
 * - getClientSupabase() → anon key, safe for browser/server reads (RLS applies)
 * - getServerSupabase() → service role key, bypasses RLS, NEVER expose to client
 *
 * IMPORTANT: The service role key MUST be set via SUPABASE_SERVICE_ROLE_KEY.
 * There is NO fallback to NEXT_PUBLIC_ vars — that would expose it in the client bundle.
 */

// --- Client-side (anon key, RLS enforced) ---

let _client: SupabaseClient | null = null;

export function getClientSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("Supabase client env vars not configured.");
    }
    return null;
  }

  _client = createClient(url, key);
  return _client;
}

// --- Server-side (service role, bypasses RLS) ---

let _server: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient | null {
  if (_server) return _server;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Do NOT fall back to NEXT_PUBLIC_ keys — service role bypasses RLS
    console.warn(
      "Supabase server client not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return null;
  }

  _server = createClient(url, key);
  return _server;
}

// --- Backward-compatible alias ---
// Existing code uses getSupabase() from this file — keep it working
export function getSupabase(): SupabaseClient | null {
  return getServerSupabase();
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
