"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/lib/types";

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    discount_price: product?.discount_price?.toString() || "",
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    stock: product?.stock?.toString() || "0",
    is_active: product?.is_active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    update("image_url", data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: parseFloat(form.price),
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      stock: parseInt(form.stock, 10),
      category_id: form.category_id || null,
    };

    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not save product");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <input
        required
        placeholder="Product name"
        className="w-full border border-line rounded-sm px-4 py-3 text-sm"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <textarea
        placeholder="Description"
        rows={3}
        className="w-full border border-line rounded-sm px-4 py-3 text-sm"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          type="number"
          step="0.01"
          placeholder="Price (₹)"
          className="border border-line rounded-sm px-4 py-3 text-sm"
          value={form.price}
          onChange={(e) => update("price", e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Discount price (optional)"
          className="border border-line rounded-sm px-4 py-3 text-sm"
          value={form.discount_price}
          onChange={(e) => update("discount_price", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select
          className="border border-line rounded-sm px-4 py-3 text-sm"
          value={form.category_id}
          onChange={(e) => update("category_id", e.target.value)}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          placeholder="Stock"
          className="border border-line rounded-sm px-4 py-3 text-sm"
          value={form.stock}
          onChange={(e) => update("stock", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2">Product image</label>
        {form.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={form.image_url}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md mb-2 bg-cloud"
          />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
        {uploading && <p className="text-xs text-muted mt-1">Uploading...</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => update("is_active", e.target.checked)}
        />
        Active (visible in store)
      </label>

      {error && <p className="text-danger text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-ink text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
