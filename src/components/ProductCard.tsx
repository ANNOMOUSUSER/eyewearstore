import Link from 'next/link';
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.discount_price && product.discount_price < product.price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="bg-cloud rounded-[24px] border border-line hover-lift h-full flex flex-col overflow-hidden shadow-card">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-[24px] bg-surface-2 flex-shrink-0">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              No image
            </div>
          )}
          {discountPercent && (
            <div className="absolute top-3 left-3 bg-accent text-paper rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg">
              {discountPercent}% OFF
            </div>
          )}
        </div>
        <div className="flex flex-col flex-grow px-4 py-4">
          <h3 className="text-sm font-semibold text-ink truncate">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-accent font-semibold">
                ₹{(product.discount_price || product.price).toFixed(2)}
              </span>
              {product.discount_price && product.discount_price < product.price && (
                <span className="text-muted line-through text-xs">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
