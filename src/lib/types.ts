export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  category_id: string | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payment_method?: "online" | "cod";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
};
