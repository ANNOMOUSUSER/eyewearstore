import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveOrder } from "@/lib/checkout";

type CheckoutItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type ShippingDetails = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { items, shipping, totalAmount }: { items: CheckoutItem[]; shipping: ShippingDetails; totalAmount: number } = body;

  if (!items || !items.length) {
    return NextResponse.json({ error: "No items in order" }, { status: 400 });
  }

  if (!shipping || Object.values(shipping).some((value) => !value?.toString().trim())) {
    return NextResponse.json({ error: "Shipping details are incomplete" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const orderId = await saveOrder({
      userId: user.id,
      shipping,
      items,
      totalAmount,
      status: "pending",
      paymentMethod: "cod",
    });

    return NextResponse.json({ orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Could not place COD order" }, { status: 500 });
  }
}
