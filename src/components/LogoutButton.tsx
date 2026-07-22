"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-danger border border-danger/20 rounded-lg hover:bg-danger/10 transition-all"
    >
      <LogOut className="w-4 h-4" />
      Sign out
    </button>
  );
}
