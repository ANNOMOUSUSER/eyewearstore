import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminReviewsPage() {
  const supabase = createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `id, rating, comment, created_at, product:products(id,name,slug), reviewer:profiles(id,full_name)`
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-ink">Reviews</h1>
        <Link href="/admin" className="text-sm text-muted hover:text-accent">Back to dashboard</Link>
      </div>

      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((r: any) => (
            <div key={r.id} className="border border-line rounded-md p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{r.product?.name ?? "(deleted product)"}</p>
                  <p className="text-xs text-muted">by {r.reviewer?.full_name ?? "(deleted user)"} · {new Date(r.created_at).toLocaleString()}</p>
                </div>
                <div className="text-sm font-medium">{r.rating} ★</div>
              </div>
              <p className="text-sm text-ink mb-3">{r.comment}</p>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (!confirm("Delete this review?")) return;
                    await fetch(`/api/admin/reviews/${r.id}`, { method: "DELETE" });
                    location.reload();
                  }}
                  className="text-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
