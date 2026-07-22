import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink mb-8">Add product</h1>
      <ProductForm categories={(categories as Category[]) || []} />
    </div>
  );
}
