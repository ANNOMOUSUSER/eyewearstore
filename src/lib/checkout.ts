import { createClient } from "@/lib/supabase/server";

type ShippingDetails = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
};

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function saveOrder({
  userId,
  shipping,
  items,
  totalAmount,
  status,
  paymentMethod,
  razorpay_order_id = null,
  razorpay_payment_id = null,
}: {
  userId: string;
  shipping: ShippingDetails;
  items: CheckoutItem[];
  totalAmount: number;
  status: "pending" | "paid";
  paymentMethod: "online" | "cod";
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
}) {
  const supabase = createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status,
      payment_method: paymentMethod,
      razorpay_order_id,
      razorpay_payment_id,
      full_name: shipping.full_name,
      phone: shipping.phone,
      address_line: shipping.address_line,
      city: shipping.city,
      state: shipping.state,
      pincode: shipping.pincode,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Could not save order");
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return order.id;
}

export type { CheckoutItem, ShippingDetails };
