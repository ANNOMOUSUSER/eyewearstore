"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarkCollectedButton({ orderId }: { orderId: string }) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm("Mark payment as collected for this COD order?")) return;
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={saving}
      className="ml-3 inline-flex items-center gap-2 text-sm bg-accent/10 border border-accent text-accent px-3 py-1.5 rounded-full"
    >
      <Check className="w-4 h-4" />
      {saving ? "Saving..." : "Mark payment collected"}
    </button>
  );
}
