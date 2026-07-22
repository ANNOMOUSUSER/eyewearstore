import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-line mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl text-gradient-gold mb-3">Optique</h2>
              <p className="text-muted text-sm max-w-md">
                Discover the world clearly with our premium eyewear collection.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-ink uppercase tracking-[0.18em] mb-3">Quick Links</p>
                <ul className="space-y-2">
                  <li><Link href="/shop" className="text-sm text-muted hover:text-accent transition-colors">Shop</Link></li>
                  <li><Link href="/shop?category=eyeglasses" className="text-sm text-muted hover:text-accent transition-colors">Eyeglasses</Link></li>
                  <li><Link href="/shop?category=sunglasses" className="text-sm text-muted hover:text-accent transition-colors">Sunglasses</Link></li>
                  <li><Link href="/shop?category=contact-lenses" className="text-sm text-muted hover:text-accent transition-colors">Contact Lenses</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink uppercase tracking-[0.18em] mb-3">Help</p>
                <ul className="space-y-2">
                  <li><Link href="/account" className="text-sm text-muted hover:text-accent transition-colors">Account</Link></li>
                  <li><Link href="/orders" className="text-sm text-muted hover:text-accent transition-colors">Orders</Link></li>
                  <li><Link href="#" className="text-sm text-muted hover:text-accent transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="text-sm text-muted hover:text-accent transition-colors">FAQs</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">Newsletter</h3>
            <p className="text-sm text-muted">Subscribe to get special offers and updates.</p>
          </div>
          <form className="flex gap-2 items-center w-full sm:max-w-md">
            <div className="relative flex items-center w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="email" placeholder="Email address" className="input-field input-with-icon pr-4 w-full" required />
            </div>
            <button type="submit" className="btn-primary py-2 px-4 text-sm whitespace-nowrap">Subscribe</button>
          </form>
        </div>
        <div className="border-t border-line pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Optique. All rights reserved.</p>
          <div className="flex items-center gap-3 text-sm font-medium">
            <a href="#" className="text-muted hover:text-accent transition-colors footer-link-sep">Instagram</a>
            <span className="footer-dot" />
            <a href="#" className="text-muted hover:text-accent transition-colors footer-link-sep">Twitter</a>
            <span className="footer-dot" />
            <a href="#" className="text-muted hover:text-accent transition-colors footer-link-sep">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
