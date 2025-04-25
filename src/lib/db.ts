import Database from 'better-sqlite3';
import { MenuItem } from '../types/menu';

// Initialize database
const db = new Database('restaurant.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL CHECK (price >= 0),
    image TEXT,
    category_id TEXT REFERENCES menu_categories(id) ON DELETE CASCADE,
    featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS item_options (
    id TEXT PRIMARY KEY,
    item_id TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS option_choices (
    id TEXT PRIMARY KEY,
    option_id TEXT REFERENCES item_options(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price REAL DEFAULT 0 CHECK (price >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Prepare statements
const getMenuItemsStmt = db.prepare(`
  SELECT 
    m.*,
    c.name as category_name
  FROM menu_items m
  LEFT JOIN menu_categories c ON m.category_id = c.id
  ORDER BY m.created_at DESC
`);

const getItemsByCategoryStmt = db.prepare(`
  SELECT 
    m.*,
    c.name as category_name
  FROM menu_items m
  LEFT JOIN menu_categories c ON m.category_id = c.id
  WHERE m.category_id = ?
  ORDER BY m.created_at DESC
`);

const getFeaturedItemsStmt = db.prepare(`
  SELECT 
    m.*,
    c.name as category_name
  FROM menu_items m
  LEFT JOIN menu_categories c ON m.category_id = c.id
  WHERE m.featured = 1
  ORDER BY m.created_at DESC
`);

const getItemByIdStmt = db.prepare(`
  SELECT 
    m.*,
    c.name as category_name
  FROM menu_items m
  LEFT JOIN menu_categories c ON m.category_id = c.id
  WHERE m.id = ?
`);

const insertItemStmt = db.prepare(`
  INSERT INTO menu_items (
    id, name, description, price, image, category_id, featured
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?
  )
`);

const updateItemStmt = db.prepare(`
  UPDATE menu_items
  SET name = ?,
      description = ?,
      price = ?,
      image = ?,
      category_id = ?,
      featured = ?
  WHERE id = ?
`);

const deleteItemStmt = db.prepare(`
  DELETE FROM menu_items WHERE id = ?
`);

// Database operations
export function getMenuItems(): MenuItem[] {
  return getMenuItemsStmt.all().map(transformMenuItem);
}

export function getItemsByCategory(categoryId: string): MenuItem[] {
  return getItemsByCategoryStmt.all(categoryId).map(transformMenuItem);
}

export function getFeaturedItems(): MenuItem[] {
  return getFeaturedItemsStmt.all().map(transformMenuItem);
}

export function getItemById(id: string): MenuItem | undefined {
  const item = getItemByIdStmt.get(id);
  return item ? transformMenuItem(item) : undefined;
}

export function addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  const id = crypto.randomUUID();
  
  insertItemStmt.run(
    id,
    item.name,
    item.description,
    item.price,
    item.image,
    item.category,
    item.featured ? 1 : 0
  );
  
  return getItemById(id)!;
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const item = getItemById(id);
  if (!item) return null;
  
  updateItemStmt.run(
    updates.name ?? item.name,
    updates.description ?? item.description,
    updates.price ?? item.price,
    updates.image ?? item.image,
    updates.category ?? item.category,
    updates.featured ? 1 : 0,
    id
  );
  
  return getItemById(id)!;
}

export function deleteMenuItem(id: string): boolean {
  const result = deleteItemStmt.run(id);
  return result.changes > 0;
}

// Helper function to transform database row to MenuItem
function transformMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    image: row.image,
    category: row.category_id,
    featured: Boolean(row.featured)
  };
}

// Export database instance for direct access if needed
export { db };