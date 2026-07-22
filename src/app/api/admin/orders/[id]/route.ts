import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (res) {
    return res as Response;
  }

  const { status } = await req.json();
  const admin = createAdminClient();

  const { error } = await admin.from("orders").update({ status }).eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
