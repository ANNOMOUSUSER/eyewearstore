import { createClient } from "@/lib/supabase/server";
import ShopContent from "@/components/ShopContent";
import type { Product, Category } from "@/lib/types";

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <ShopContent
      products={(products as Product[]) || []}
      categories={(categories as Category[]) || []}
      initialCategory={searchParams.category}
    />
  );
}
