# Optique — Eyewear Store

A lightweight eyewear e-commerce site with two roles (customer + admin).
Built with Next.js, Supabase (database + auth + storage), and Razorpay
(test mode), all deployable for free on Vercel + GitHub.

## What's included

- Product catalog with categories (Eyeglasses / Sunglasses / Contact Lenses)
- Cart (stored in the browser, no login needed to browse/add to cart)
- Checkout with Razorpay payment
- Customer accounts: signup/login, order history
- Admin dashboard: add/edit/delete products (with image upload), view & update order status
- Mobile-first, neutral colors, no extra features you didn't ask for

## 1. Create a Supabase project (free)

1. Go to https://supabase.com → New project.
2. Once created, open **SQL Editor** → paste the entire contents of
   `supabase/schema.sql` from this repo → **Run**.
   This creates all tables, security rules, and a storage bucket for images.
3. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this one private, never expose to the browser)

## 2. Create a Razorpay account (free, test mode)

1. Sign up at https://razorpay.com and switch to **Test Mode** (top left toggle).
2. Go to **Settings → API Keys → Generate Test Key** and copy the Key ID and Key Secret.
   Test mode lets you simulate payments with no real money — good for launching
   and testing before you're ready to go live.

## 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the values from steps 1 and 2:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

(`NEXT_PUBLIC_RAZORPAY_KEY_ID` is the same value as `RAZORPAY_KEY_ID`, just
exposed to the browser since Razorpay's checkout widget needs it client-side.)

## 4. Run it locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 5. Make yourself an admin

1. Sign up for an account on your running site (this creates a row in `profiles`
   with role `user`).
2. In Supabase → **Table Editor → profiles**, find your row and change `role`
   to `admin`. (Or run `update profiles set role = 'admin' where id = '<your-id>';`
   in the SQL Editor — your id is visible in **Authentication → Users**.)
3. Refresh the site and go to `/admin` — you now have full access to add
   products and manage orders.

## 6. Add your first products

Go to `/admin/products/new`, fill in the details, upload an image, and save.
Products won't show in the store until you add at least one.

## 7. Deploy for free (GitHub + Vercel)

1. Push this project to a new GitHub repository.
2. Go to https://vercel.com → **Add New Project** → import your GitHub repo.
3. In the Vercel project settings, add the same environment variables from
   `.env.local` under **Settings → Environment Variables**.
4. Deploy. Vercel gives you a free `.vercel.app` URL automatically.

That's it — no server to manage, no paid hosting required.

## Notes

- Cart data lives in the browser (localStorage), so it's not shared across
  devices — this keeps things simple and avoids unnecessary database writes.
- Orders are only created after a Razorpay payment is verified server-side
  (see `src/app/api/checkout/verify/route.ts`), so no unpaid orders get saved.
- To go live for real payments later, switch Razorpay out of Test Mode and
  swap in your live API keys — no code changes needed.
