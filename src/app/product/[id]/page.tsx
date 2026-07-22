import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AddToCart from "@/components/AddToCart";
import VendorChatButton from "@/components/VendorChatButton";
import type { Product } from "@/lib/types";
import { ChevronRight } from "lucide-react";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const p = product as Product;
  const hasDiscount = p.discount_price && p.discount_price < p.price;
  const discountPercent = hasDiscount
    ? Math.round(((p.price - p.discount_price!) / p.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-ink truncate max-w-[200px]">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Image */}
        <div className="relative group">
          <div className="aspect-square bg-cloud rounded-xl overflow-hidden border border-line">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted text-sm">
                No image
              </div>
            )}
          </div>
          {hasDiscount && (
            <span className="absolute top-4 left-4 bg-accent text-paper rounded-full px-3 py-1.5 text-xs font-semibold shadow-glow">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink">{p.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-display font-bold text-accent">
              ₹{(hasDiscount ? p.discount_price! : p.price).toFixed(0)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted line-through">₹{p.price.toFixed(0)}</span>
                <span className="text-sm font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {p.description && (
            <div className="mt-6 pt-6 border-t border-line">
              <h3 className="text-sm font-semibold text-ink mb-2">Description</h3>
              <p className="text-muted leading-relaxed text-sm">{p.description}</p>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8">
            <AddToCart product={p} />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <VendorChatButton
              productName={p.name}
              productUrl={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/product/${p.id}`}
            />
          </div>

          {/* Info Cards */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-cloud rounded-lg border border-line">
              <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <p className="text-xs font-medium text-ink">Free Shipping</p>
                <p className="text-xs text-muted">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cloud rounded-lg border border-line">
              <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-ink">1 Year Warranty</p>
                <p className="text-xs text-muted">Full manufacturer coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-cloud rounded-lg border border-line">
              <svg className="w-5 h-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="text-xs font-medium text-ink">Easy Returns</p>
                <p className="text-xs text-muted">14-day hassle-free returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
