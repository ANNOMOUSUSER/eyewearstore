import { createClient } from "@/lib/supabase/server";

// Call at the top of any admin-only API route. Throws a Response to return
// directly from the route handler if the caller isn't an authenticated admin.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  return user;
}
