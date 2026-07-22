import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper transition hover:bg-gold-light"
        >
          + Add product
        </Link>
      </div>

      <div className="space-y-3">
        {(products as Product[] | null)?.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border border-line rounded-md p-3"
          >
            <div className="w-14 h-14 bg-cloud rounded-sm overflow-hidden shrink-0">
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{p.name}</p>
              <p className="text-xs text-muted">
                ₹{p.price} · Stock: {p.stock} · {p.is_active ? "Active" : "Hidden"}
              </p>
            </div>
            <Link
              href={`/admin/products/${p.id}/edit`}
              className="text-sm text-accent hover:underline"
            >
              Edit
            </Link>
            <DeleteProductButton productId={p.id} />
          </div>
        ))}
        {(!products || products.length === 0) && (
          <p className="text-muted text-sm">No products yet.</p>
        )}
      </div>
    </div>
  );
}
