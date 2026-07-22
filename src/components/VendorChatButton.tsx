'use client';

import { useMemo } from 'react';
import { MessageSquare } from 'lucide-react';

type VendorChatButtonProps = {
  productName: string;
  productUrl: string;
};

export default function VendorChatButton({ productName, productUrl }: VendorChatButtonProps) {
  const phone = process.env.NEXT_PUBLIC_VENDOR_WHATSAPP_NUMBER;

  const chatHref = useMemo(() => {
    if (!phone) return null;
    const message = encodeURIComponent(`Hi, I'm interested in ${productName} — ${productUrl}`);
    return `https://wa.me/${phone}?text=${message}`;
  }, [phone, productName, productUrl]);

  if (!chatHref) return null;

  return (
    <button
      type="button"
      onClick={() => window.open(chatHref, '_blank')}
      className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3"
    >
      <MessageSquare className="w-4 h-4" />
      Chat with vendor
    </button>
  );
}
