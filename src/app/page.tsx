import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import SimpleSlider from "@/components/SimpleSlider";
import type { Product, Category } from "@/lib/types";
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles, Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "Complimentary delivery on all orders above ₹999",
    },
    {
      icon: Shield,
      title: "Premium Quality",
      desc: "Crafted with precision using the finest materials",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      desc: "14-day hassle-free return & exchange policy",
    },
    {
      icon: Sparkles,
      title: "1 Year Warranty",
      desc: "Full manufacturer warranty on every frame",
    },
  ];

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-[#121212]">
        <div className="absolute inset-0 bg-[#121212]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-2xl">
              <ScrollReveal>
                <p className="text-slate-300 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
                  Premium Eyewear Collection
                </p>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-ink tracking-tight leading-[1.05]">
                  Eyewear that <span className="text-accent">feels premium</span> every day
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                  Shop designer-inspired frames, UV-protective sunglasses, and comfort-first contact lenses curated for modern style and everyday confidence.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link href="/shop" className="btn-primary">
                    Explore Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/shop?category=sunglasses" className="btn-secondary">
                    View Sunglasses
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-wrap gap-8 sm:gap-10 mt-10 pt-8 border-t border-line">
                  <div>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-ink">500+</p>
                    <p className="text-muted text-xs sm:text-sm mt-1">Premium Frames</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-ink">50K+</p>
                    <p className="text-muted text-xs sm:text-sm mt-1">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-display font-bold text-accent">4.9</p>
                    <p className="text-muted text-xs sm:text-sm mt-1">★ Rating</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={250}>
              <div className="relative">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-accent/20 via-transparent to-transparent blur-3xl" />
                <div className="relative rounded-[28px] border border-line bg-surface-2/80 p-3 shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80"
                    alt="Premium eyewear collection"
                    className="h-[420px] w-full rounded-[22px] object-cover"
                  />
                  <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-sm text-white backdrop-blur">
                    New arrivals • 2026
                  </div>
                  <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-white/90 px-4 py-3 text-left shadow-lg">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold text-slate-900">4.8/5 customer love</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">Free shipping + easy returns</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────────── */}
      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">Categories</p>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink">
                Shop by Category
              </h2>
            </div>
          </ScrollReveal>
          <SimpleSlider className="mb-6">
            {(categories as Category[]).map((c) => (
              <div key={c.id} className="px-2 sm:px-0">
                <Link
                  href={`/shop?category=${c.slug}`}
                  className="group relative block overflow-hidden rounded-[24px] border border-line bg-cloud hover-lift min-h-[260px]"
                >
                  <img
                    src={
                      c.slug === "eyeglasses"
                        ? "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
                        : c.slug === "sunglasses"
                          ? "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
                          : "https://images.unsplash.com/photo-1584361853901-dd1904bb7987?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={c.name}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-left relative z-10">
                    <span className="text-lg font-display font-semibold text-white">
                      {c.name}
                    </span>
                    <p className="text-sm text-white/80 mt-1">
                      Explore collection →
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </SimpleSlider>
        </section>
      )}

      {/* ─── Featured Products ─────────────────────────────────── */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
                  Just Dropped
                </p>
                <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink">
                  New Arrivals
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-2 text-sm text-accent hover:text-accentLight transition-colors font-medium"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {(products as Product[]).map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted text-sm">
                No products yet. Add some from the admin dashboard.
              </p>
            </div>
          )}

          <Link
            href="/shop"
            className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm text-accent hover:text-accentLight transition-colors font-medium"
          >
            View all products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── Trust / Why Choose Us ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              Why Optique
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink">
              Built on trust, crafted with care
            </h2>
          </div>
        </ScrollReveal>
        <SimpleSlider className="mb-6">
          {features.map((f) => (
            <div key={f.title} className="px-2 sm:px-0">
              <div className="glass-card p-6 sm:p-8 text-center hover-lift min-h-[240px]">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </SimpleSlider>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <ScrollReveal>
            <div className="relative rounded-xl overflow-hidden border border-line bg-[#171717] p-8 sm:p-12 lg:p-16 text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-ink mb-4">
                  See the world in <span className="text-accent">high definition</span>
                </h2>
                <p className="text-slate-300 max-w-md mx-auto mb-8 text-base sm:text-lg leading-relaxed">
                  Join thousands who have upgraded their vision with Optique&#39;s premium collection.
                </p>
                <Link href="/shop" className="btn-primary">
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
