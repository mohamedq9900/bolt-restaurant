import { useState, useEffect, useCallback } from 'react';
import type { MenuItem } from '../types/menu';
import { categories } from '../data/menuData';
import {
  getMenuItems,
  addMenuItem as addMenuItemToStorage,
  updateMenuItem as updateMenuItemInStorage,
  deleteMenuItem as deleteMenuItemFromStorage,
  getItemsByCategory as getItemsByCategoryFromStorage,
  getFeaturedItems as getFeaturedItemsFromStorage,
  getItemById as getItemByIdFromStorage
} from '../lib/storage';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storedItems = getMenuItems();
      setItems(storedItems);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError(err instanceof Error ? err : new Error('حدث خطأ أثناء تحميل القائمة'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const newItem = addMenuItemToStorage(item);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      console.error('Error adding menu item:', err);
      throw new Error('فشل إضافة العنصر. يرجى المحاولة مرة أخرى.');
    }
  };

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const updatedItem = updateMenuItemInStorage(id, updates);
      if (!updatedItem) throw new Error('Item not found');
      
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      
      return updatedItem;
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw new Error('فشل تحديث العنصر. يرجى المحاولة مرة أخرى.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const success = deleteMenuItemFromStorage(id);
      if (success) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      console.error('Error deleting menu item:', err);
      throw new Error('فشل حذف العنصر. يرجى المحاولة مرة أخرى.');
    }
  };

  const getItemsByCategory = (categoryId: string): MenuItem[] => {
    return getItemsByCategoryFromStorage(categoryId);
  };

  const getFeaturedItems = (): MenuItem[] => {
    return getFeaturedItemsFromStorage();
  };

  const getItemById = (id: string): MenuItem | undefined => {
    return getItemByIdFromStorage(id);
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getFeaturedItems,
    getItemById,
    refresh: loadItems,
    categories,
  };
}