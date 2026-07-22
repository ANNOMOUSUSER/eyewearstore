'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { ShoppingBag, ArrowRight, AlertCircle, CheckCircle, Plus, Minus } from 'lucide-react';

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(Boolean(data.session?.user));
    };

    loadSession();
  }, []);

  const getEffectivePrice = () => {
    return product.discount_price && product.discount_price < product.price
      ? product.discount_price
      : product.price;
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }

    if (!isOutOfStock) {
      addItem({
        productId: product.id,
        name: product.name,
        price: getEffectivePrice(),
        image_url: product.image_url,
        quantity,
      });
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/product/${product.id}`);
      return;
    }

    if (!isOutOfStock) {
      addItem({
        productId: product.id,
        name: product.name,
        price: getEffectivePrice(),
        image_url: product.image_url,
        quantity,
      });
      router.push('/cart');
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (isOutOfStock) {
    return (
      <div className="flex items-center gap-2 text-danger">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Out of stock</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          {product.stock > 0 && product.stock <= 5 ? (
            <span className="text-accent text-xs font-medium">Only {product.stock} left</span>
          ) : (
            <div className="flex items-center gap-1.5 text-success text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>In Stock</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-2 border border-line rounded-md">
            <button
              onClick={decrement}
              disabled={quantity <= 1}
              className="p-2 text-muted hover:text-accent disabled:opacity-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-ink text-sm font-medium">{quantity}</span>
            <button
              onClick={increment}
              disabled={quantity >= product.stock}
              className="p-2 text-muted hover:text-accent disabled:opacity-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="rounded-3xl border border-line bg-[#f7efe0] p-4 text-sm text-ink">
          Please sign in to add this product to your cart.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!isLoggedIn}
          className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Add to cart</span>
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!isLoggedIn}
          className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>Buy now</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
