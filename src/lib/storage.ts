import { MenuItem } from '../types/menu';
import { menuItems as initialMenuItems } from '../data/menuData';

const STORAGE_KEYS = {
  MENU_ITEMS: 'menuItems',
  ORDERS: 'orders',
  CART: 'cart',
  SETTINGS: 'settings'
} as const;

// Debug helper
const debug = (message: string, ...args: any[]) => {
  console.log(`[Storage] ${message}`, ...args);
};

// Initialize storage with default data
function initializeStorage() {
  try {
    debug('Initializing storage');
    
    // Initialize menu items if not exists or is invalid
    let storedMenuItems;
    try {
      const menuItemsStr = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
      debug('Stored menu items:', menuItemsStr);
      
      storedMenuItems = JSON.parse(menuItemsStr || 'null');
      if (!Array.isArray(storedMenuItems)) {
        debug('Invalid menu items, resetting to default');
        throw new Error('Invalid menu items data');
      }
    } catch (error) {
      debug('Setting default menu items');
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(initialMenuItems));
      storedMenuItems = initialMenuItems;
    }

    // Initialize other storage keys with empty arrays if not exists
    ['ORDERS', 'CART'].forEach(key => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS]);
        debug(`Checking ${key}:`, stored);
        
        const parsed = JSON.parse(stored || 'null');
        if (!Array.isArray(parsed)) {
          debug(`Initializing ${key} with empty array`);
          localStorage.setItem(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS], JSON.stringify([]));
        }
      } catch (error) {
        debug(`Error with ${key}, resetting:`, error);
        localStorage.setItem(STORAGE_KEYS[key as keyof typeof STORAGE_KEYS], JSON.stringify([]));
      }
    });

    debug('Storage initialization complete');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize storage when module loads
initializeStorage();

export function getStoredData<T>(key: keyof typeof STORAGE_KEYS, fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[key]);
    debug(`Getting ${key}:`, stored);
    
    if (!stored) {
      debug(`No data for ${key}, using fallback`);
      setStoredData(key, fallback);
      return fallback;
    }
    
    const parsed = JSON.parse(stored);
    if (parsed === null) {
      debug(`Null data for ${key}, using fallback`);
      return fallback;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return fallback;
  }
}

export function setStoredData<T>(key: keyof typeof STORAGE_KEYS, data: T): void {
  try {
    debug(`Setting ${key}:`, data);
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
    
    // Dispatch storage event to sync across tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEYS[key],
      newValue: JSON.stringify(data)
    }));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    throw new Error('فشل في حفظ البيانات');
  }
}

// Menu Items
export function getMenuItems(): MenuItem[] {
  debug('Getting menu items');
  const items = getStoredData<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, initialMenuItems);
  if (!Array.isArray(items)) {
    debug('Invalid menu items, returning default');
    return initialMenuItems;
  }
  return items;
}

export function saveMenuItems(items: MenuItem[]): void {
  if (!Array.isArray(items)) {
    console.error('Invalid menu items data');
    return;
  }
  debug('Saving menu items:', items);
  setStoredData(STORAGE_KEYS.MENU_ITEMS, items);
}

export function addMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  try {
    debug('Adding menu item:', item);
    
    // Validate required fields
    if (!item.name?.trim()) throw new Error('الاسم مطلوب');
    if (!item.price || item.price <= 0) throw new Error('السعر غير صالح');
    if (!item.category?.trim()) throw new Error('التصنيف مطلوب');
    if (!item.description?.trim()) throw new Error('الوصف مطلوب');
    if (!item.image?.trim()) throw new Error('رابط الصورة مطلوب');

    const items = getMenuItems();
    
    const newItem: MenuItem = {
      ...item,
      id: crypto.randomUUID(),
      featured: item.featured ?? false
    };
    
    debug('Created new item:', newItem);
    
    const updatedItems = [newItem, ...items];
    saveMenuItems(updatedItems);
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('menuUpdated'));
    
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw new Error(error instanceof Error ? error.message : 'حدث خطأ أثناء إضافة العنصر');
  }
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  try {
    debug('Updating menu item:', { id, updates });
    
    if (!id?.trim()) throw new Error('معرف العنصر مطلوب');

    const items = getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      debug('Item not found:', id);
      return null;
    }
    
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    saveMenuItems(items);
    
    debug('Item updated:', updatedItem);
    
    window.dispatchEvent(new CustomEvent('menuUpdated'));
    
    return updatedItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('فشل في تحديث العنصر');
  }
}

export function deleteMenuItem(id: string): boolean {
  try {
    debug('Deleting menu item:', id);
    
    if (!id?.trim()) throw new Error('معرف العنصر مطلوب');

    const items = getMenuItems();
    const newItems = items.filter(item => item.id !== id);
    
    if (newItems.length === items.length) {
      debug('Item not found:', id);
      return false;
    }
    
    saveMenuItems(newItems);
    debug('Item deleted');
    
    window.dispatchEvent(new CustomEvent('menuUpdated'));
    
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('فشل في حذف العنصر');
  }
}

export function getItemsByCategory(categoryId: string): MenuItem[] {
  try {
    debug('Getting items by category:', categoryId);
    
    if (!categoryId?.trim()) return [];
    const items = getMenuItems();
    return items.filter(item => item.category === categoryId);
  } catch (error) {
    console.error('Error getting items by category:', error);
    return [];
  }
}

export function getFeaturedItems(): MenuItem[] {
  try {
    debug('Getting featured items');
    const items = getMenuItems();
    return items.filter(item => item.featured);
  } catch (error) {
    console.error('Error getting featured items:', error);
    return [];
  }
}

export function getItemById(id: string): MenuItem | undefined {
  try {
    debug('Getting item by id:', id);
    
    if (!id?.trim()) return undefined;
    const items = getMenuItems();
    return items.find(item => item.id === id);
  } catch (error) {
    console.error('Error getting item by id:', error);
    return undefined;
  }
}