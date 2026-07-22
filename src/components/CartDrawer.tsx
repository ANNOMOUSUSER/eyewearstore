'use client';

import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, subtotal, drawerOpen, setDrawerOpen } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 overlay-fade animate-fade-in" 
        onClick={() => setDrawerOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-line z-50 flex flex-col animate-slide-in-right shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-line">
          <h2 className="font-display text-2xl text-ink font-semibold text-gradient-gold">Your Cart</h2>
          <button 
            onClick={() => setDrawerOpen(false)} 
            className="p-2 text-muted hover:text-accent transition-colors rounded-full hover:bg-surface-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted space-y-4">
              <ShoppingBag size={64} className="opacity-50" />
              <p className="text-lg">Your cart is empty</p>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="px-6 py-3 mt-4 bg-accent text-surface font-semibold rounded-full hover:bg-opacity-90 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-line pb-6 last:border-0">
                  <div className="w-24 h-24 bg-surface-2 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image_url || ""} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-ink font-semibold font-display line-clamp-1">{item.name}</h3>
                        <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-danger transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-muted text-sm mt-1">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-line rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-1 text-muted hover:text-ink hover:bg-surface-2 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-ink w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-1 text-muted hover:text-ink hover:bg-surface-2 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-line bg-surface-2">
            <div className="flex justify-between items-center mb-6">
              <span className="text-muted">Subtotal</span>
              <span className="text-xl text-ink font-display font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="space-y-3">
              <Link 
                href="/checkout" 
                onClick={() => setDrawerOpen(false)}
                className="w-full py-4 bg-accent text-surface font-semibold rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Checkout <ArrowRight size={18} />
              </Link>
              <Link 
                href="/cart" 
                onClick={() => setDrawerOpen(false)}
                className="w-full py-4 border border-line text-ink font-semibold rounded-full flex items-center justify-center hover:bg-surface transition-colors"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
