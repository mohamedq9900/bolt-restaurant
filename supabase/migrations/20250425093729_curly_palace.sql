/*
  # Seed Initial Categories and Menu Items

  This migration adds initial data for:
  1. Menu categories with proper UUIDs
  2. Menu items with proper category references
*/

-- Insert menu categories with fixed UUIDs
INSERT INTO menu_categories (id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'الأطباق الرئيسية'),
  ('550e8400-e29b-41d4-a716-446655440001', 'المقبلات'),
  ('550e8400-e29b-41d4-a716-446655440002', 'السندويشات'),
  ('550e8400-e29b-41d4-a716-446655440003', 'السلطات'),
  ('550e8400-e29b-41d4-a716-446655440004', 'المشروبات'),
  ('550e8400-e29b-41d4-a716-446655440005', 'الحلويات')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Insert menu items with proper category references
INSERT INTO menu_items (name, description, price, image, category_id, featured)
VALUES
  (
    'مشاوي مشكلة',
    'تشكيلة من اللحوم المشوية مع الخضار والأرز',
    25.99,
    'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
    '550e8400-e29b-41d4-a716-446655440000',
    true
  ),
  (
    'حمص',
    'حمص مع زيت الزيتون والصنوبر',
    5.99,
    'https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg',
    '550e8400-e29b-41d4-a716-446655440001',
    false
  ),
  (
    'شاورما دجاج',
    'شاورما دجاج مع صلصة الثوم والمخللات',
    8.99,
    'https://images.pexels.com/photos/6542774/pexels-photo-6542774.jpeg',
    '550e8400-e29b-41d4-a716-446655440002',
    true
  ),
  (
    'سلطة سيزر',
    'خس روماني مع صلصة السيزر وقطع الدجاج المشوي',
    7.99,
    'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    '550e8400-e29b-41d4-a716-446655440003',
    false
  ),
  (
    'عصير برتقال طازج',
    'عصير برتقال طبيعي 100%',
    3.99,
    'https://images.pexels.com/photos/158053/fresh-orange-juice-squeezed-refreshing-citrus-158053.jpeg',
    '550e8400-e29b-41d4-a716-446655440004',
    false
  ),
  (
    'كنافة',
    'كنافة بالجبن مع القطر',
    6.99,
    'https://images.pexels.com/photos/12664777/pexels-photo-12664777.jpeg',
    '550e8400-e29b-41d4-a716-446655440005',
    true
  ),
  (
    'متبل باذنجان',
    'متبل باذنجان مشوي مع طحينة وزيت زيتون',
    4.99,
    'https://images.pexels.com/photos/7226367/pexels-photo-7226367.jpeg',
    '550e8400-e29b-41d4-a716-446655440001',
    false
  ),
  (
    'برجر لحم',
    'برجر لحم مع جبنة وخضار',
    12.99,
    'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    '550e8400-e29b-41d4-a716-446655440002',
    false
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  category_id = EXCLUDED.category_id,
  featured = EXCLUDED.featured;