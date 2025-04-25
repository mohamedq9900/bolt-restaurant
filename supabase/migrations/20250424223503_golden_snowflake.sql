/*
  # Initial Schema Setup

  1. New Tables
    - `menu_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image` (text)
      - `category_id` (uuid, foreign key)
      - `featured` (boolean)
      - `created_at` (timestamp)
    
    - `item_options`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `option_choices`
      - `id` (uuid, primary key)
      - `option_id` (uuid, foreign key)
      - `name` (text)
      - `price` (numeric)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `total_price` (numeric)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `customer_email` (text)
      - `customer_address` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `item_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)
      - `created_at` (timestamp)
    
    - `order_item_options`
      - `id` (uuid, primary key)
      - `order_item_id` (uuid, foreign key)
      - `option_id` (uuid, foreign key)
      - `choice_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public access where needed
*/

-- Create menu_categories table
CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  image text,
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create item_options table
CREATE TABLE item_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create option_choices table
CREATE TABLE option_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id uuid REFERENCES item_options(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric DEFAULT 0 CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'canceled')),
  total_price numeric NOT NULL CHECK (total_price >= 0),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  customer_address text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create order_item_options table
CREATE TABLE order_item_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE,
  option_id uuid REFERENCES item_options(id),
  choice_id uuid REFERENCES option_choices(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;

-- Create policies for menu items (public read access)
CREATE POLICY "Allow public read access" ON menu_categories
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON menu_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON item_options
  FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access" ON option_choices
  FOR SELECT TO public USING (true);

-- Create policies for orders
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders" ON orders
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));

-- Create policies for order items
CREATE POLICY "Users can view their order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all order items" ON order_items
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));

-- Create policies for order item options
CREATE POLICY "Users can view their order item options" ON order_item_options
  FOR SELECT TO authenticated
  USING (
    order_item_id IN (
      SELECT oi.id FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all order item options" ON order_item_options
  FOR ALL TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));