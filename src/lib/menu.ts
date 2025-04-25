import { supabase } from './supabase';
import type { MenuItem } from '../types/menu';

export async function addMenuItem(item: Omit<MenuItem, 'id'>) {
  // First, ensure we have a valid category_id
  let category_id = item.category;
  
  // If the category is not a UUID, fetch the ID from the categories table
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category_id)) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (categoryError) throw new Error(`Invalid category: ${categoryError.message}`);
    if (!categoryData) throw new Error('Category not found');
    
    category_id = categoryData.id;
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert([{
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category_id: category_id,
      featured: item.featured
    }])
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .single();

  if (error) {
    console.error('Error adding menu item:', error);
    throw new Error(`Failed to add menu item: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after adding menu item');
  }

  return data;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  // First, ensure we have a valid category_id if it's being updated
  let category_id = item.category;
  
  if (category_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category_id)) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (categoryError) throw new Error(`Invalid category: ${categoryError.message}`);
    if (!categoryData) throw new Error('Category not found');
    
    category_id = categoryData.id;
  }

  // First check if the item exists
  const { data: existingItem, error: checkError } = await supabase
    .from('menu_items')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking menu item:', checkError);
    throw new Error(`Item not found: ${checkError.message}`);
  }

  if (!existingItem) {
    throw new Error('Menu item not found');
  }

  // Now perform the update
  const { data, error } = await supabase
    .from('menu_items')
    .update({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category_id: category_id,
      featured: item.featured
    })
    .eq('id', id)
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .single();

  if (error) {
    console.error('Error updating menu item:', error);
    throw new Error(`Failed to update menu item: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after updating menu item');
  }

  return data;
}

export async function deleteMenuItem(id: string) {
  // First check if the item exists
  const { data: existingItem, error: checkError } = await supabase
    .from('menu_items')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking menu item:', checkError);
    throw new Error(`Item not found: ${checkError.message}`);
  }

  if (!existingItem) {
    throw new Error('Menu item not found');
  }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw new Error(`Failed to delete menu item: ${error.message}`);
  }
}

export async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `);

  if (error) {
    console.error('Error fetching menu items:', error);
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return data || [];
}

export async function getMenuItem(id: string) {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      category:category_id (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching menu item:', error);
    throw new Error(`Failed to fetch menu item: ${error.message}`);
  }

  if (!data) {
    throw new Error('Menu item not found');
  }

  return data;
}

export async function addCategory(name: string) {
  const { data, error } = await supabase
    .from('menu_categories')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Error adding category:', error);
    throw new Error(`Failed to add category: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after adding category');
  }

  return data;
}

export async function updateCategory(id: string, name: string) {
  // First check if the category exists
  const { data: existingCategory, error: checkError } = await supabase
    .from('menu_categories')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking category:', checkError);
    throw new Error(`Category not found: ${checkError.message}`);
  }

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  const { data, error } = await supabase
    .from('menu_categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error(`Failed to update category: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned after updating category');
  }

  return data;
}

export async function deleteCategory(id: string) {
  // First check if the category exists
  const { data: existingCategory, error: checkError } = await supabase
    .from('menu_categories')
    .select('id')
    .eq('id', id)
    .single();

  if (checkError) {
    console.error('Error checking category:', checkError);
    throw new Error(`Category not found: ${checkError.message}`);
  }

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}