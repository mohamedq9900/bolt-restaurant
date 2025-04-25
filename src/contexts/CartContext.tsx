import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: { [key: string]: string };
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, options?: { [key: string]: string }) => void;
  updateQuantity: (id: string, quantity: number, options?: { [key: string]: string }) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

// Create context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

// Hook for using cart context
export const useCart = () => useContext(CartContext);

// Helper function to validate CartItem
const isValidCartItem = (item: any): item is CartItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number'
  );
};

// Helper function to validate cart array
const isValidCartArray = (arr: any): arr is CartItem[] => {
  return Array.isArray(arr) && arr.every(isValidCartItem);
};

// Helper function to generate a unique key for an item
const getItemKey = (item: CartItem): string => {
  const optionsKey = item.options 
    ? Object.entries(item.options)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join('|')
    : '';
  
  return `${item.id}${optionsKey ? `|${optionsKey}` : ''}`;
};

// Helper function to find item index in cart
const findItemIndex = (items: CartItem[], id: string, options?: { [key: string]: string }): number => {
  const searchKey = getItemKey({ id, options } as CartItem);
  return items.findIndex(item => getItemKey(item) === searchKey);
};

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return [];
      
      const parsedCart = JSON.parse(savedCart);
      return isValidCartArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Calculate totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Add item to cart
  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const itemKey = getItemKey(newItem);
      const existingIndex = prevItems.findIndex(item => getItemKey(item) === itemKey);

      if (existingIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity
        };
        return updatedItems;
      }

      // Add new item
      return [...prevItems, { ...newItem }];
    });
  };

  // Remove item from cart
  const removeItem = (id: string, options?: { [key: string]: string }) => {
    setItems(prevItems => {
      const index = findItemIndex(prevItems, id, options);
      if (index === -1) return prevItems;
      
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number, options?: { [key: string]: string }) => {
    if (quantity <= 0) {
      removeItem(id, options);
      return;
    }

    setItems(prevItems => {
      const index = findItemIndex(prevItems, id, options);
      if (index === -1) return prevItems;

      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], quantity };
      return newItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};