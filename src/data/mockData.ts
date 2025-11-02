import { Product, Order, OrderItem, Supplier } from '@/types/database';

// Mock data simulating Oracle SQL Plus database
export const mockProducts: Product[] = [
  {
    product_id: 'PROD001',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 79.99,
    stock_quantity: 45,
    category: 'Electronics',
    supplier_id: 'SUP001',
    image_url: '/placeholder.svg',
    created_at: '2024-01-15',
  },
  {
    product_id: 'PROD002',
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracking and notifications',
    price: 199.99,
    stock_quantity: 28,
    category: 'Electronics',
    supplier_id: 'SUP001',
    image_url: '/placeholder.svg',
    created_at: '2024-01-20',
  },
  {
    product_id: 'PROD003',
    name: 'Laptop Stand Aluminum',
    description: 'Ergonomic adjustable laptop stand',
    price: 34.99,
    stock_quantity: 120,
    category: 'Accessories',
    supplier_id: 'SUP002',
    image_url: '/placeholder.svg',
    created_at: '2024-02-01',
  },
  {
    product_id: 'PROD004',
    name: 'USB-C Hub 7-in-1',
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
    price: 49.99,
    stock_quantity: 67,
    category: 'Accessories',
    supplier_id: 'SUP002',
    image_url: '/placeholder.svg',
    created_at: '2024-02-10',
  },
  {
    product_id: 'PROD005',
    name: 'Mechanical Keyboard RGB',
    description: 'Gaming mechanical keyboard with customizable RGB lighting',
    price: 129.99,
    stock_quantity: 34,
    category: 'Electronics',
    supplier_id: 'SUP003',
    image_url: '/placeholder.svg',
    created_at: '2024-02-15',
  },
  {
    product_id: 'PROD006',
    name: 'Wireless Mouse Ergonomic',
    description: 'Comfortable ergonomic wireless mouse',
    price: 39.99,
    stock_quantity: 89,
    category: 'Accessories',
    supplier_id: 'SUP003',
    image_url: '/placeholder.svg',
    created_at: '2024-02-20',
  },
];

export const mockOrders: Order[] = [
  {
    order_id: 'ORD001',
    customer_id: 'cust_001',
    order_date: '2024-10-15',
    total_amount: 279.97,
    status: 'shipped',
    shipping_address: '123 Main St, City, State 12345',
  },
  {
    order_id: 'ORD002',
    customer_id: 'cust_002',
    order_date: '2024-10-20',
    total_amount: 79.99,
    status: 'processing',
    shipping_address: '456 Oak Ave, Town, State 67890',
  },
  {
    order_id: 'ORD003',
    customer_id: 'cust_001',
    order_date: '2024-10-25',
    total_amount: 199.99,
    status: 'pending',
    shipping_address: '123 Main St, City, State 12345',
  },
];

export const mockOrderItems: OrderItem[] = [
  {
    order_item_id: 'OI001',
    order_id: 'ORD001',
    product_id: 'PROD001',
    quantity: 2,
    unit_price: 79.99,
    subtotal: 159.98,
  },
  {
    order_item_id: 'OI002',
    order_id: 'ORD001',
    product_id: 'PROD004',
    quantity: 1,
    unit_price: 49.99,
    subtotal: 49.99,
  },
];

export const mockSuppliers: Supplier[] = [
  {
    supplier_id: 'SUP001',
    name: 'TechSupply Co.',
    contact_person: 'John Doe',
    email: 'john@techsupply.com',
    phone: '555-0101',
    address: '789 Tech Park, Silicon Valley, CA',
  },
  {
    supplier_id: 'SUP002',
    name: 'Accessories Plus',
    contact_person: 'Jane Smith',
    email: 'jane@accessoriesplus.com',
    phone: '555-0102',
    address: '321 Commerce Blvd, Austin, TX',
  },
  {
    supplier_id: 'SUP003',
    name: 'Gaming Gear Ltd',
    contact_person: 'Mike Johnson',
    email: 'mike@gaminggear.com',
    phone: '555-0103',
    address: '654 Gaming St, Seattle, WA',
  },
];
