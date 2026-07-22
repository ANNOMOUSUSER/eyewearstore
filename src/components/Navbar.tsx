'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/lib/cart';

const navLinks = [
  { href: '/shop?category=eyeglasses', label: 'Eyeglasses', query: 'eyeglasses' },
  { href: '/shop?category=sunglasses', label: 'Sunglasses', query: 'sunglasses' },
  { href: '/shop?category=contact-lenses', label: 'Contact Lenses', query: 'contact-lenses' }
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count, setDrawerOpen } = useCart();

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
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <Link href="/account" className="text-ink hover:text-accent transition-colors">
              <User size={24} strokeWidth={1.5} />
            </Link>
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
            <div className="border-t border-line my-4 pt-4 space-y-4">
              <Link 
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-ink hover:text-accent font-medium text-lg px-2 py-2"
              >
                <User size={20} className="mr-3" /> Account
              </Link>
              <Link 
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-ink hover:text-accent font-medium text-lg px-2 py-2 ml-8"
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
