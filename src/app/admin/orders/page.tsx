import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import MarkCollectedButton from "@/components/admin/MarkCollectedButton";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-8">Orders</h1>

      <div className="space-y-4">
        {orders?.map((order: any) => (
          <div key={order.id} className="border border-line rounded-md p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-medium text-ink">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-muted">
                  {order.full_name} · {order.phone}
                </p>
                <p className="text-xs text-muted">
                  {order.address_line}, {order.city}, {order.state} - {order.pincode}
                </p>
                <p className="text-xs mt-2">
                  <span className="font-medium">Payment:</span> {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}
                </p>
              </div>
              <div className="flex items-center">
                <OrderStatusSelect orderId={order.id} status={order.status} />
                {order.payment_method === 'cod' && order.status === 'pending' && (
                  <MarkCollectedButton orderId={order.id} />
                )}
              </div>
            </div>
            <ul className="text-sm text-ink space-y-1 mb-2">
              {order.order_items.map((item: any) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
              <span>Total</span>
              <span>₹{order.total_amount.toFixed(0)}</span>
            </div>
          </div>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-muted text-sm">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
