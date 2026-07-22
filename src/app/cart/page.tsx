"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-cloud border border-line flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-7 h-7 text-muted" />
        </div>
        <h1 className="text-xl font-display font-semibold text-ink mb-2">Your cart is empty</h1>
        <p className="text-muted mb-8 text-sm">Add some frames you love and they&#39;ll show up here.</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink">Your Cart</h1>
          <p className="text-muted text-sm mt-1">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/shop" className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="glass-card p-4 sm:p-5 flex gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-surface-2 rounded-lg overflow-hidden shrink-0 border border-line">
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-ink truncate">{item.name}</h3>
              <p className="text-sm text-accent font-semibold mt-1">₹{item.price.toFixed(0)}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center bg-surface-2 border border-line rounded-md">
                  <button
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-ink">{item.quantity}</span>
                  <button
                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-accent transition-colors"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="flex items-center gap-1.5 text-xs text-danger hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
            <div className="text-sm font-semibold text-ink self-center">
              ₹{(item.price * item.quantity).toFixed(0)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="glass-card p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-muted font-medium">Subtotal</span>
          <span className="text-2xl font-display font-bold text-accent">₹{subtotal.toFixed(0)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full btn-primary py-4 text-center text-base"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 inline ml-2" />
        </Link>
        <p className="text-center text-muted text-xs mt-3">Taxes and shipping calculated at checkout</p>
      </div>
    </div>
  );
}
