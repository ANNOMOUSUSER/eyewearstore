'use client';

import React from 'react';
import { useCart } from '@/lib/cart';
import { CheckCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-toast-in">
      <div className="glass px-6 py-4 rounded-full border border-line shadow-2xl flex items-center gap-3 bg-surface/80 backdrop-blur-md">
        <CheckCircle className="text-success" size={20} />
        <span className="text-ink font-medium">{toast}</span>
      </div>
    </div>
  );
}
