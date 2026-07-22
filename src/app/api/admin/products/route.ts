import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (res) {
    return res as Response;
  }

  const body = await req.json();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("products")
    .insert({
      name: body.name,
      slug: `${slugify(body.name)}-${Date.now().toString(36)}`,
      description: body.description || null,
      price: body.price,
      discount_price: body.discount_price || null,
      category_id: body.category_id || null,
      image_url: body.image_url || null,
      stock: body.stock ?? 0,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
