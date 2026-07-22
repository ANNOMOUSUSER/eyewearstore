import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const statusTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-violet-100 text-violet-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: productCount, data: productRows }, { count: orderCount, data: orderRows }, { count: reviewsCount }, { data: lowStockProducts }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("id, name, stock, is_active", { count: "exact" }),
      supabase.from("orders").select("id, status, payment_method, total_amount, created_at", { count: "exact" }),
      supabase.from("reviews").select("*", { count: "exact", head: true }),
      supabase.from("products").select("id, name, stock").lt("stock", 6).order("stock", { ascending: true }).limit(5),
      supabase.from("orders").select("id, status, payment_method, total_amount, created_at, full_name").order("created_at", { ascending: false }).limit(5),
    ]);

  const products = productRows ?? [];
  const orders = orderRows ?? [];
  const activeProducts = products.filter((product: any) => product.is_active).length;
  const outOfStockProducts = products.filter((product: any) => Number(product.stock) <= 0).length;
  const pendingOrders = orders.filter((order: any) => order.status === "pending");
  const codPendingOrders = pendingOrders.filter((order: any) => order.payment_method === "cod");
  const revenue = orders
    .filter((order: any) => order.status === "paid")
    .reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Admin control center</p>
          <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-muted">Track your catalog, orders, payments, and customer feedback at a glance.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
            Add product
          </Link>
          <Link href="/admin/orders" className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
            Review orders
          </Link>
          <Link href="/admin/reviews" className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
            Manage reviews
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] border border-line bg-paper p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Products</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{productCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted">{activeProducts} active · {outOfStockProducts} out of stock</p>
        </div>
        <div className="rounded-[24px] border border-line bg-paper p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Orders</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{orderCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted">{pendingOrders.length} pending · {codPendingOrders.length} COD awaiting collection</p>
        </div>
        <div className="rounded-[24px] border border-line bg-paper p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Reviews</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{reviewsCount ?? 0}</p>
          <p className="mt-2 text-sm text-muted">Customer feedback and ratings</p>
        </div>
        <div className="rounded-[24px] border border-line bg-paper p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Revenue (paid)</p>
          <p className="mt-3 text-3xl font-semibold text-ink">₹{revenue.toFixed(0)}</p>
          <p className="mt-2 text-sm text-muted">Captured from completed orders</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[24px] border border-line bg-paper p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Recent orders</h2>
              <p className="text-sm text-muted">Latest customer activity and payment status</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-medium text-accent hover:underline">
              Open all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders?.length ? recentOrders.map((order: any) => (
              <div key={order.id} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted">{order.full_name}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusTone[order.status] || "bg-slate-100 text-slate-700"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                  <span>{order.payment_method === "cod" ? "Cash on Delivery" : "Online"}</span>
                  <span>₹{Number(order.total_amount || 0).toFixed(0)}</span>
                </div>
              </div>
            )) : (
              <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">No orders yet.</p>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-[24px] border border-line bg-surface p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-ink">Needs attention</h2>
            <p className="text-sm text-muted">Monitor items that need action soon.</p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">Low stock</p>
                <p className="text-sm text-muted">Products running out</p>
              </div>
              <span className="text-2xl font-semibold text-ink">{lowStockProducts?.length ?? 0}</span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {lowStockProducts?.length ? lowStockProducts.map((product: any) => (
                <li key={product.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2">
                  <span>{product.name}</span>
                  <span className="font-medium text-ink">{product.stock} left</span>
                </li>
              )) : (
                <li className="rounded-xl border border-dashed border-line px-3 py-2">All stocked well.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">COD pending</p>
                <p className="text-sm text-muted">Cash-on-delivery orders waiting for collection</p>
              </div>
              <span className="text-2xl font-semibold text-ink">{codPendingOrders.length}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
