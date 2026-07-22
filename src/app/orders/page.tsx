import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

const statusColor: Record<string, string> = {
  pending: "text-muted",
  paid: "text-accent",
  shipped: "text-accent",
  delivered: "text-green-700",
  cancelled: "text-danger",
};

export default async function OrdersPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-ink mb-8">My orders</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-muted text-sm">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="border border-line rounded-md p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-medium text-ink">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold uppercase ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <ul className="text-sm text-ink space-y-1 mb-3">
                {order.order_items.map((item: any) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-line pt-3 text-sm font-semibold text-ink">
                <span>Total</span>
                <span>₹{order.total_amount.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
