import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import { User, Package, Shield, Mail, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">My Account</h1>
        <p className="text-muted text-sm mt-1">Manage your profile and orders</p>
      </div>

      {/* Profile Info */}
      <div className="glass-card p-6 mb-4">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-surface-2 border border-line flex items-center justify-center">
              <User className="w-4 h-4 text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted">Name</p>
              <p className="text-sm text-ink font-medium truncate">{profile?.full_name || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-surface-2 border border-line flex items-center justify-center">
              <Mail className="w-4 h-4 text-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted">Email</p>
              <p className="text-sm text-ink font-medium truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 mb-6">
        <Link
          href="/orders"
          className="flex items-center justify-between p-4 glass-card hover:border-accent/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-ink">My Orders</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
        </Link>

        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center justify-between p-4 glass-card hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-ink">Admin Dashboard</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
          </Link>
        )}
      </div>

      <LogoutButton />
    </div>
  );
}
