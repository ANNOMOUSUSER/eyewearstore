"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-[32px] border border-line bg-[#f4e8d8] p-4 shadow-card md:p-6">
        <div className="flex items-center gap-3 text-ink">
          <LayoutDashboard className="h-6 w-6 text-accent" />
          <div>
            <p className="text-sm font-medium text-accent">Store backend</p>
            <h1 className="text-xl font-semibold text-ink">Eyewear Admin</h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/" className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
            View store
          </Link>
          <Link href="/admin" className="rounded-full bg-accent px-3 py-2 text-sm font-semibold text-paper transition hover:bg-gold-light">
            Dashboard
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-full border border-line bg-paper p-3 text-ink"
          aria-label="Toggle admin menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className={`rounded-[24px] border border-line bg-[#f7efe0] p-4 transition-all duration-300 ${open ? "block" : "hidden md:block"}`}>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-accent/10 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
