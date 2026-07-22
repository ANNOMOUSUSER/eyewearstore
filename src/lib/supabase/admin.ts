import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY. Never import this in a Client Component.
// Uses the service role key to bypass RLS - only call after verifying
// the requesting user is an admin (see src/lib/auth.ts -> requireAdmin).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
