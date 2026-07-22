import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function upsertCategories() {
  const cats = [
    { name: 'Eyeglasses', slug: 'eyeglasses' },
    { name: 'Sunglasses', slug: 'sunglasses' },
    { name: 'Contact Lenses', slug: 'contact-lenses' },
  ];

  const { data, error } = await supabase.from('categories').upsert(cats, { onConflict: 'slug' }).select();
  if (error) throw error;
  return data;
}

async function upsertProducts(categories) {
  const map = {};
  categories.forEach((c) => (map[c.slug] = c.id));

  const products = [
    // Eyeglasses
    {
      name: 'Aero Classic Frame',
      slug: 'aero-classic-frame',
      description: 'Lightweight acetate frame with polished finish and spring hinges.',
      price: 1999.0,
      discount_price: 1599.0,
      category_id: map['eyeglasses'],
      image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      stock: 24,
    },
    {
      name: 'Monroe Thin Rim',
      slug: 'monroe-thin-rim',
      description: 'Minimal metal thin-rim frames for a refined, modern look.',
      price: 2499.0,
      discount_price: null,
      category_id: map['eyeglasses'],
      image_url: 'https://images.unsplash.com/photo-1520975911870-5f5b99d6d2c1?auto=format&fit=crop&w=900&q=80',
      stock: 18,
    },
    {
      name: 'Vista Square',
      slug: 'vista-square',
      description: 'Bold square frames with comfortable nose pads.',
      price: 1799.0,
      discount_price: 1499.0,
      category_id: map['eyeglasses'],
      image_url: 'https://images.unsplash.com/photo-1545996124-1b1a0aef6b2b?auto=format&fit=crop&w=900&q=80',
      stock: 30,
    },
    // Sunglasses
    {
      name: 'Sunflare Aviator',
      slug: 'sunflare-aviator',
      description: 'Classic aviator sunglasses with polarized lenses.',
      price: 2999.0,
      discount_price: 2499.0,
      category_id: map['sunglasses'],
      image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
      stock: 40,
    },
    {
      name: 'Horizon Wrap',
      slug: 'horizon-wrap',
      description: 'Sporty wraparound frame with UV400 protection.',
      price: 3499.0,
      discount_price: null,
      category_id: map['sunglasses'],
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      stock: 22,
    },
    {
      name: 'Mariner Round',
      slug: 'mariner-round',
      description: 'Retro round sunglasses with comfortable temples.',
      price: 2199.0,
      discount_price: 1899.0,
      category_id: map['sunglasses'],
      image_url: 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=900&q=80',
      stock: 35,
    },
    // Contact Lenses
    {
      name: 'Daily Comfort Lenses (30)',
      slug: 'daily-comfort-30',
      description: 'Daily disposable lenses for comfortable all-day wear (30 pack).',
      price: 899.0,
      discount_price: 799.0,
      category_id: map['contact-lenses'],
      image_url: 'https://images.unsplash.com/photo-1584361853901-dd1904bb7987?auto=format&fit=crop&w=900&q=80',
      stock: 120,
    },
    {
      name: 'NightSight Monthly',
      slug: 'nightsight-monthly',
      description: 'Monthly replacement lenses with enhanced moisture technology.',
      price: 1299.0,
      discount_price: null,
      category_id: map['contact-lenses'],
      image_url: 'https://images.unsplash.com/photo-1583382786023-7b94d13c3d11?auto=format&fit=crop&w=900&q=80',
      stock: 80,
    },
    {
      name: 'ClearView Toric',
      slug: 'clearview-toric',
      description: 'Toric lenses for astigmatism with long-lasting comfort.',
      price: 1499.0,
      discount_price: 1299.0,
      category_id: map['contact-lenses'],
      image_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80',
      stock: 50,
    },
  ];

  const { data, error } = await supabase.from('products').upsert(products, { onConflict: 'slug' }).select();
  if (error) throw error;
  return data;
}

async function main() {
  try {
    console.log('Upserting categories...');
    const cats = await upsertCategories();
    console.log('Categories upserted:', cats.map((c) => c.slug).join(', '));

    console.log('Upserting products...');
    const prods = await upsertProducts(cats);
    console.log('Products upserted:', prods.length);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    process.exit(1);
  }
}

main();
