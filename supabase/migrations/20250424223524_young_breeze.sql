/*
  # Seed Initial Data

  This migration adds initial data for:
  1. Menu categories
  2. Menu items
  3. Item options and choices
*/

-- Insert menu categories
INSERT INTO menu_categories (name) VALUES
  ('المقبلات'),
  ('الأطباق الرئيسية'),
  ('الحلويات'),
  ('المشروبات'),
  ('الإضافات');

-- Insert menu items
WITH categories AS (
  SELECT id, name FROM menu_categories
)
INSERT INTO menu_items (name, description, price, image, category_id, featured)
SELECT
  'برجر كلاسيكي',
  'برجر لحم مشوي مع خس، طماطم، جبنة، وصلصة خاصة',
  12.99,
  'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
  id,
  true
FROM categories WHERE name = 'الأطباق الرئيسية';

-- Add options for burger
WITH burger AS (
  SELECT id FROM menu_items WHERE name = 'برجر كلاسيكي'
)
INSERT INTO item_options (item_id, name)
SELECT id, 'الحجم'
FROM burger
UNION ALL
SELECT id, 'إضافات'
FROM burger;

-- Add choices for burger options
WITH size_option AS (
  SELECT id FROM item_options WHERE name = 'الحجم'
),
extras_option AS (
  SELECT id FROM item_options WHERE name = 'إضافات'
)
INSERT INTO option_choices (option_id, name, price)
SELECT id, 'عادي', 0
FROM size_option
UNION ALL
SELECT id, 'كبير', 3
FROM size_option
UNION ALL
SELECT id, 'جبنة إضافية', 1
FROM extras_option
UNION ALL
SELECT id, 'لحم مقدد', 2
FROM extras_option
UNION ALL
SELECT id, 'أفوكادو', 1.5
FROM extras_option;

-- Insert more menu items
WITH categories AS (
  SELECT id, name FROM menu_categories
)
INSERT INTO menu_items (name, description, price, image, category_id, featured)
VALUES
  (
    'سلطة سيزر',
    'خس روماني طازج مع جبنة البارميزان، خبز محمص، وصلصة سيزر',
    9.99,
    'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
    (SELECT id FROM categories WHERE name = 'المقبلات'),
    false
  ),
  (
    'بيتزا مارجريتا',
    'طماطم طازجة، موزاريلا، ريحان، وزيت زيتون',
    14.99,
    'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg',
    (SELECT id FROM categories WHERE name = 'الأطباق الرئيسية'),
    true
  ),
  (
    'كيك الشوكولاتة البركاني',
    'كيك شوكولاتة دافئ مع مركز سائل، يقدم مع آيس كريم الفانيليا',
    7.99,
    'https://images.pexels.com/photos/3992131/pexels-photo-3992131.jpeg',
    (SELECT id FROM categories WHERE name = 'الحلويات'),
    true
  );

-- Add options for pizza
WITH pizza AS (
  SELECT id FROM menu_items WHERE name = 'بيتزا مارجريتا'
)
INSERT INTO item_options (item_id, name)
SELECT id, 'الحجم'
FROM pizza
UNION ALL
SELECT id, 'العجين'
FROM pizza;

-- Add choices for pizza options
WITH size_option AS (
  SELECT id FROM item_options WHERE item_id = (SELECT id FROM menu_items WHERE name = 'بيتزا مارجريتا') AND name = 'الحجم'
),
crust_option AS (
  SELECT id FROM item_options WHERE item_id = (SELECT id FROM menu_items WHERE name = 'بيتزا مارجريتا') AND name = 'العجين'
)
INSERT INTO option_choices (option_id, name, price)
SELECT id, 'وسط', 0
FROM size_option
UNION ALL
SELECT id, 'كبير', 4
FROM size_option
UNION ALL
SELECT id, 'عادي', 0
FROM crust_option
UNION ALL
SELECT id, 'رقيق', 0
FROM crust_option
UNION ALL
SELECT id, 'محشي', 2
FROM crust_option;