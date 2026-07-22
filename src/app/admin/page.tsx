import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: productCount }, { count: orderCount }, { data: pendingOrders }, { count: reviewsCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("total_amount").eq("status", "paid"),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
    ]);

  const revenue = (pendingOrders || []).reduce((sum, o: any) => sum + Number(o.total_amount), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-line rounded-md p-5">
          <p className="text-xs text-muted uppercase mb-1">Products</p>
          <p className="text-2xl font-semibold text-ink">{productCount ?? 0}</p>
        </div>
        <div className="border border-line rounded-md p-5">
          <p className="text-xs text-muted uppercase mb-1">Orders</p>
          <p className="text-2xl font-semibold text-ink">{orderCount ?? 0}</p>
        </div>
        <div className="border border-line rounded-md p-5">
          <p className="text-xs text-muted uppercase mb-1">Reviews</p>
          <p className="text-2xl font-semibold text-ink">{reviewsCount ?? 0}</p>
        </div>
        <div className="border border-line rounded-md p-5">
          <p className="text-xs text-muted uppercase mb-1">Revenue (paid)</p>
          <p className="text-2xl font-semibold text-ink">₹{revenue.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
}
