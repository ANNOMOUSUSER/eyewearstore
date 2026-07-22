import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export async function POST(req: Request) {
  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shipping,
    totalAmount,
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    items: CheckoutItem[];
    shipping: {
      full_name: string;
      phone: string;
      address_line: string;
      city: string;
      state: string;
      pincode: string;
    };
    totalAmount: number;
  } = body;

  // 1. Verify the payment signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  // 2. Save the order (RLS ensures user_id must match the logged-in user)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      status: "paid",
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
    return NextResponse.json({ error: orderError?.message || "Could not save order" }, { status: 500 });
  }

  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    product_name: i.name,
    quantity: i.quantity,
    price: i.price,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id });
}
