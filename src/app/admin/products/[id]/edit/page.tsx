import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Category, Product } from "@/lib/types";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-8">Edit product</h1>
      <ProductForm categories={(categories as Category[]) || []} product={product as Product} />
    </div>
  );
}
