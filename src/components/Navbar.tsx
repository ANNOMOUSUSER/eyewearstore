'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

const navLinks = [
  { href: '/shop?category=eyeglasses', label: 'Eyeglasses' },
  { href: '/shop?category=sunglasses', label: 'Sunglasses' },
  { href: '/shop?category=contact-lenses', label: 'Contact Lenses' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const { count, setDrawerOpen } = useCart();

  useEffect(() => {
    const supabase = createClient();

    const loadAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        setProfileRole(profile?.role ?? null);
      } else {
        setProfileRole(null);
      }
    };

    loadAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setProfileRole(profile?.role ?? null);
      } else {
        setProfileRole(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const isAdmin = profileRole === 'admin';
  const isLoggedIn = Boolean(session?.user);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-display text-3xl font-bold text-gradient-gold tracking-wide">
              Optique
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="group relative text-ink hover:text-accent transition-colors font-medium text-sm tracking-wide"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            ))}
            {isAdmin && (
              <Link 
                href="/admin"
                className="group relative text-ink hover:text-accent transition-colors font-medium text-sm tracking-wide"
              >
                Admin
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link href="/orders" className="text-ink hover:text-accent transition-colors text-sm font-medium">
                  My Orders
                </Link>
                <Link href="/account" className="text-ink hover:text-accent transition-colors">
                  <User size={24} strokeWidth={1.5} />
                </Link>
              </>
            ) : (
              <Link href="/login" className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent">
                Sign in
              </Link>
            )}
            <button 
              onClick={() => setDrawerOpen(true)}
              className="relative text-ink hover:text-accent transition-colors group"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-surface text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-fade-in group-hover:scale-110 transition-transform">
                  {count}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center md:hidden space-x-4">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="relative text-ink hover:text-accent transition-colors"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-surface text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ink hover:text-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-line animate-fade-in bg-surface-2/95 backdrop-blur-lg absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-4 shadow-xl">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-ink hover:text-accent font-medium text-lg px-2 py-2"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link 
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-ink hover:text-accent font-medium text-lg px-2 py-2"
              >
                <User size={20} className="mr-3" /> Admin
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link 
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-ink hover:text-accent font-medium text-lg px-2 py-2"
                >
                  <User size={20} className="mr-3" /> Account
                </Link>
                <Link 
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-ink hover:text-accent font-medium text-lg px-2 py-2 ml-8"
                >
                  My Orders
                </Link>
              </>
            ) : (
              <Link 
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-ink hover:text-accent font-medium text-lg px-2 py-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
