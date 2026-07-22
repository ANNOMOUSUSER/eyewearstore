import Link from "next/link";

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-ink mb-2">Order placed 🎉</h1>
      <p className="text-muted mb-8 text-sm">
        Thank you! Your order has been confirmed.
        {searchParams.orderId && (
          <>
            <br />
            Order ID: {searchParams.orderId}
          </>
        )}
      </p>
      <Link
        href="/orders"
        className="inline-block bg-ink text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-accent transition-colors"
      >
        View my orders
      </Link>
    </div>
  );
}
