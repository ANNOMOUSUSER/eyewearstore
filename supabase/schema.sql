-- Run this whole file in Supabase Dashboard -> SQL Editor -> New query -> Run

-- 1. PROFILES (extends auth.users with a role)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

-- 3. PRODUCTS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  discount_price numeric(10,2),
  category_id uuid references categories(id) on delete set null,
  image_url text,
  stock int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  payment_method text not null default 'online' check (payment_method in ('online','cod')),
  razorpay_order_id text,
  razorpay_payment_id text,
  full_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  created_at timestamptz not null default now()
);

-- 5. ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity int not null,
  price numeric(10,2) not null
);

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: user reads/updates own row, admin reads all
drop policy if exists "profiles_select_own_or_admin" on profiles;
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Categories & products: public read, only admin writes
drop policy if exists "categories_public_read" on categories;
create policy "categories_public_read" on categories for select using (true);
drop policy if exists "categories_admin_write" on categories;
create policy "categories_admin_write" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products for select using (true);
drop policy if exists "products_admin_write" on products;
create policy "products_admin_write" on products for all using (is_admin()) with check (is_admin());

-- Orders: user sees/creates own, admin sees & updates all
drop policy if exists "orders_select_own_or_admin" on orders;
create policy "orders_select_own_or_admin" on orders
  for select using (auth.uid() = user_id or is_admin());

drop policy if exists "orders_insert_own" on orders;
create policy "orders_insert_own" on orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders_update_admin" on orders;
create policy "orders_update_admin" on orders
  for update using (is_admin());

-- Order items: visible if the parent order is visible; insert if parent order is own
drop policy if exists "order_items_select" on order_items;
create policy "order_items_select" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_admin()))
  );

drop policy if exists "order_items_insert" on order_items;
create policy "order_items_insert" on order_items
  for insert with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- 6. STORAGE for product images (public bucket, admin-only upload)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write" on storage.objects
  for all using (bucket_id = 'product-images' and is_admin())
  with check (bucket_id = 'product-images' and is_admin());

-- 7. Seed categories (optional, edit as you like)
insert into categories (name, slug) values
  ('Eyeglasses', 'eyeglasses'),
  ('Sunglasses', 'sunglasses'),
  ('Contact Lenses', 'contact-lenses')
on conflict (slug) do nothing;

-- 8. Seed sample products (safe to run multiple times)
insert into products (name, slug, description, price, discount_price, category_id, image_url, stock)
values
  (
    'Aero Classic Frame',
    'aero-classic-frame',
    'Lightweight acetate frame with polished finish and spring hinges.',
    1999.00,
    1599.00,
    (select id from categories where slug = 'eyeglasses'),
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    24
  ),
  (
    'Monroe Thin Rim',
    'monroe-thin-rim',
    'Minimal metal thin-rim frames for a refined, modern look.',
    2499.00,
    NULL,
    (select id from categories where slug = 'eyeglasses'),
    'https://images.unsplash.com/photo-1520975911870-5f5b99d6d2c1?auto=format&fit=crop&w=900&q=80',
    18
  ),
  (
    'Vista Square',
    'vista-square',
    'Bold square frames with comfortable nose pads.',
    1799.00,
    1499.00,
    (select id from categories where slug = 'eyeglasses'),
    'https://images.unsplash.com/photo-1545996124-1b1a0aef6b2b?auto=format&fit=crop&w=900&q=80',
    30
  )
on conflict (slug) do nothing;

insert into products (name, slug, description, price, discount_price, category_id, image_url, stock)
values
  (
    'Sunflare Aviator',
    'sunflare-aviator',
    'Classic aviator sunglasses with polarized lenses.',
    2999.00,
    2499.00,
    (select id from categories where slug = 'sunglasses'),
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    40
  ),
  (
    'Horizon Wrap',
    'horizon-wrap',
    'Sporty wraparound frame with UV400 protection.',
    3499.00,
    NULL,
    (select id from categories where slug = 'sunglasses'),
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    22
  ),
  (
    'Mariner Round',
    'mariner-round',
    'Retro round sunglasses with comfortable temples.',
    2199.00,
    1899.00,
    (select id from categories where slug = 'sunglasses'),
    'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=80',
    35
  )
on conflict (slug) do nothing;

insert into products (name, slug, description, price, discount_price, category_id, image_url, stock)
values
  (
    'Daily Comfort Lenses (30)',
    'daily-comfort-30',
    'Daily disposable lenses for comfortable all-day wear (30 pack).',
    899.00,
    799.00,
    (select id from categories where slug = 'contact-lenses'),
    'https://images.unsplash.com/photo-1584361853901-dd1904bb7987?auto=format&fit=crop&w=900&q=80',
    120
  ),
  (
    'NightSight Monthly',
    'nightsight-monthly',
    'Monthly replacement lenses with enhanced moisture technology.',
    1299.00,
    NULL,
    (select id from categories where slug = 'contact-lenses'),
    'https://images.unsplash.com/photo-1583382786023-7b94d13c3d11?auto=format&fit=crop&w=900&q=80',
    80
  ),
  (
    'ClearView Toric',
    'clearview-toric',
    'Toric lenses for astigmatism with long-lasting comfort.',
    1499.00,
    1299.00,
    (select id from categories where slug = 'contact-lenses'),
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80',
    50
  )
on conflict (slug) do nothing;

-- After running this once, make yourself an admin by running:
-- update profiles set role = 'admin' where id = '<your-user-id-from-auth.users>';
