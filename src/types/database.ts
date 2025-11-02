// Oracle SQL Plus compatible type definitions
// These mirror the expected Oracle database schema

export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  stock_status?: 'out_of_stock' | 'low_stock' | 'medium' | 'in_stock';
  category: string;
  supplier_id: string;
  image_url: string;
  created_at: string;
}

export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
}

export interface OrderItem {
  order_item_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Customer {
  customer_id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Supplier {
  supplier_id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Revenue {
  date: string;
  total_sales: number;
  order_count: number;
}
