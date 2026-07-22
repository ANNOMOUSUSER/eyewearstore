"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Product, Category } from "@/lib/types";
import { useCart } from "@/lib/cart";

type SortOption = "newest" | "price-asc" | "price-desc";

export default function ShopContent({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const { addItem } = useCart();

  const sortLabels: Record<SortOption, string> = {
    newest: "Newest",
    "price-asc": "Price: Low → High",
    "price-desc": "Price: High → Low",
  };

  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory) {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [products, categories, activeCategory, search, sort]);

  // Keep activeCategory in sync when the URL changes (initialCategory prop)
  useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);

  function getEffectivePrice(p: Product) {
    return p.discount_price && p.discount_price < p.price ? p.discount_price : p.price;
  }

  function getDiscountPercent(p: Product) {
    if (!p.discount_price || p.discount_price >= p.price) return 0;
    return Math.round(((p.price - p.discount_price) / p.price) * 100);
  }

  function handleQuickAdd(e: React.MouseEvent, p: Product) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: p.id,
      name: p.name,
      price: getEffectivePrice(p),
      image_url: p.image_url,
      quantity: 1,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink">
          {activeCategory
            ? categories.find((c) => c.slug === activeCategory)?.name || "Shop"
            : "All Products"}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field input-with-icon h-12"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-surface-2 border border-line rounded-md text-sm text-ink hover:border-accent transition-colors w-full sm:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted" />
            <span>{sortLabels[sort]}</span>
            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-line rounded-md shadow-card z-20 min-w-[180px] py-1 animate-scale-in">
              {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSort(key);
                    setSortOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    sort === key
                      ? "text-accent bg-cloud"
                      : "text-ink hover:bg-cloud hover:text-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
            !activeCategory
              ? "bg-accent text-paper border-accent shadow-glow"
              : "border-line text-muted hover:border-accent hover:text-accent"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(activeCategory === c.slug ? null : c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === c.slug
                ? "bg-accent text-paper border-accent shadow-glow"
                : "border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group block bg-cloud rounded-lg border border-line hover-lift overflow-hidden"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-2 text-muted text-sm">
                    No image
                  </div>
                )}
                {getDiscountPercent(p) > 0 && (
                  <span className="absolute top-3 left-3 bg-accent text-paper rounded-full px-2.5 py-1 text-xs font-semibold">
                    -{getDiscountPercent(p)}%
                  </span>
                )}
                {/* Quick Add overlay */}
                <button
                  onClick={(e) => handleQuickAdd(e, p)}
                  className="absolute bottom-3 right-3 bg-accent text-paper rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accentLight hover:scale-110 shadow-lg"
                  aria-label={`Quick add ${p.name}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-ink truncate">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-sm font-semibold text-accent">
                    ₹{getEffectivePrice(p).toFixed(0)}
                  </span>
                  {getDiscountPercent(p) > 0 && (
                    <span className="text-xs text-muted line-through">₹{p.price.toFixed(0)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted text-sm">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory(null);
            }}
            className="mt-4 text-accent text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
