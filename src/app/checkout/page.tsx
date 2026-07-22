"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Lock, CreditCard, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePay() {
    setError("");
    if (Object.values(form).some((v) => !v.trim())) {
      setError("Please fill in all shipping details.");
      return;
    }
    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const res = await fetch("/api/checkout/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
            })),
            shipping: form,
            totalAmount: subtotal,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not place COD order");

        clearCart();
        router.push(`/checkout/success?orderId=${data.orderId}`);
        return;
      }

      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: subtotal }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Could not start payment");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createData.order.amount,
        currency: "INR",
        name: "Optique",
        description: "Order payment",
        order_id: createData.order.id,
        prefill: { name: form.full_name, contact: form.phone },
        theme: { color: "#c5a880" },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items.map((i) => ({
                productId: i.productId,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
              })),
              shipping: form,
              totalAmount: subtotal,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || "Payment verification failed");
            setLoading(false);
            return;
          }
          clearCart();
          router.push(`/checkout/success?orderId=${verifyData.orderId}`);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-2">Checkout</h1>
        <p className="text-muted text-sm mb-8">Complete your order details below</p>

        {/* Shipping Details */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wider mb-6 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-accent" />
            Shipping Details
          </h2>
          <div className="space-y-4">
            <input
              className="input-field"
              placeholder="Full name"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Address"
              value={form.address_line}
              onChange={(e) => update("address_line", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="input-field"
                placeholder="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <input
                className="input-field"
                placeholder="State"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </div>
            <input
              className="input-field"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-6 sm:p-8 mb-6">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-ink font-medium">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-3 mb-6">
            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <p className="text-sm font-semibold text-ink mb-3">Payment method</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === "online"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-surface text-ink hover:border-accent hover:text-accent"
                  }`}
                >
                  Pay online
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === "cod"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-surface text-ink hover:border-accent hover:text-accent"
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
            <div className="border-t border-line pt-4 flex items-center justify-between">
              <span className="text-muted font-medium">Total</span>
              <span className="text-2xl font-display font-bold text-accent">₹{subtotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-danger text-sm mb-4 p-3 bg-danger/10 rounded-md border border-danger/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          {loading ? "Processing..." : `Pay ₹${subtotal.toFixed(0)}`}
        </button>

        <p className="text-center text-muted text-xs mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Secured by Razorpay • 256-bit SSL Encryption
        </p>
      </div>
    </>
  );
}
