import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[180px_1fr] gap-8">
      <aside className="border-b md:border-b-0 md:border-r border-line pb-4 md:pb-0 md:pr-6">
        <nav className="flex md:flex-col gap-4 md:gap-2 text-sm overflow-x-auto">
          <Link href="/admin" className="text-ink hover:text-accent whitespace-nowrap">
            Dashboard
          </Link>
          <Link href="/admin/products" className="text-ink hover:text-accent whitespace-nowrap">
            Products
          </Link>
          <Link href="/admin/orders" className="text-ink hover:text-accent whitespace-nowrap">
            Orders
          </Link>
          <Link href="/admin/reviews" className="text-ink hover:text-accent whitespace-nowrap">
            Reviews
          </Link>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
