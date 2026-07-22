import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("products")
    .update({
      name: body.name,
      description: body.description || null,
      price: body.price,
      discount_price: body.discount_price || null,
      category_id: body.category_id || null,
      image_url: body.image_url || null,
      stock: body.stock ?? 0,
      is_active: body.is_active ?? true,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (res) {
    return res as Response;
  }

  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
