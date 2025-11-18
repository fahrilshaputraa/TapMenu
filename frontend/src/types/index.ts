// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  user_type: 'admin' | 'kasir' | 'kitchen' | 'customer';
  is_active: boolean;
  created_at: string;
}

export interface StaffProfile {
  id: number;
  user: User;
  restaurant: number;
  restaurant_name: string;
  role: 'admin' | 'kasir' | 'kitchen';
  status: 'active' | 'inactive' | 'invited';
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  staff_profiles: StaffProfile[];
  tokens: AuthTokens;
}

// Restaurant types
export interface Restaurant {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  address: string;
  phone: string;
  email: string;
  is_open: boolean;
  status: 'active' | 'inactive' | 'suspended';
  tax_rate: number;
  service_charge: number;
  currency: string;
  created_at: string;
}

// Menu types
export interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  display_order: number;
  is_active: boolean;
  products_count?: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  price_adjustment: number;
  is_available: boolean;
}

export interface ProductAddon {
  id: number;
  name: string;
  price: number;
  is_available: boolean;
}

export interface Product {
  id: number;
  category: number;
  category_name: string;
  name: string;
  description: string;
  image: string | null;
  base_price: number;
  current_price: number;
  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;
  preparation_time: number;
  variants: ProductVariant[];
  addons: ProductAddon[];
}

// Table types
export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'unavailable';
  floor: string;
  section: string;
  is_active: boolean;
}

export interface QRCode {
  id: number;
  table: number;
  code: string;
  is_active: boolean;
  scan_count: number;
  foreground_color: string;
  background_color: string;
}

export interface TableSession {
  id: number;
  table: number;
  session_code: string;
  status: 'active' | 'completed' | 'cancelled';
  guest_count: number;
  started_at: string;
  ended_at: string | null;
}

// Order types
export interface OrderItemAddon {
  id: number;
  addon_name: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  variant_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  notes: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  addons: OrderItemAddon[];
}

export interface Order {
  id: number;
  uuid: string;
  restaurant: number;
  table: number | null;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  subtotal: number;
  tax_amount: number;
  service_charge: number;
  discount_amount: number;
  total: number;
  notes: string;
  items: OrderItem[];
  created_at: string;
  confirmed_at: string | null;
  completed_at: string | null;
}

// Cart types (for frontend state)
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  addons: { addon: ProductAddon; quantity: number }[];
  quantity: number;
  notes: string;
}

// API response types
export interface ApiError {
  error?: string;
  detail?: string;
  [key: string]: unknown;
}
