/*
  # Add Menu Indexes

  1. New Indexes
    - Add index on menu_items.category_id for faster category lookups
    - Add index on menu_items.featured for faster featured items queries
    - Add index on menu_items.name for faster search
    
  2. Changes
    - Add indexes to improve query performance
*/

-- Add index for category lookups
CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items (category_id);

-- Add index for featured items
CREATE INDEX IF NOT EXISTS menu_items_featured_idx ON menu_items (featured);

-- Add index for name search
CREATE INDEX IF NOT EXISTS menu_items_name_idx ON menu_items USING gin (to_tsvector('arabic', name));