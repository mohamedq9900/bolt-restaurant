import { CartItem } from '../contexts/CartContext';
import { getSettings } from './settingsData';

// Order status options
export enum OrderStatus {
  PENDING = 'قيد الانتظار',
  CONFIRMED = 'مؤكد',
  PREPARING = 'قيد التحضير',
  READY = 'جاهز',
  DELIVERING = 'قيد التوصيل',
  DELIVERED = 'تم التوصيل',
  CANCELED = 'ملغي',
}

// Customer information type
export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
  email?: string;
  notes?: string;
};

// Order type
export type Order = {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  status: OrderStatus;
  totalPrice: number;
  deliveryFee: number;
  createdAt: Date;
  updatedAt: Date;
};

// Get orders from localStorage
const getStoredOrders = (): Order[] => {
  const savedOrders = localStorage.getItem('allOrders');
  return savedOrders ? JSON.parse(savedOrders) : [];
};

// Save orders to localStorage
const saveOrders = (orders: Order[]) => {
  localStorage.setItem('allOrders', JSON.stringify(orders));
};

// Get all orders
export const getAllOrders = (): Order[] => {
  return getStoredOrders().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get order by ID
export const getOrderById = (id: string): Order | undefined => {
  return getStoredOrders().find(order => order.id === id);
};

// Get orders by status
export const getOrdersByStatus = (status: OrderStatus): Order[] => {
  return getStoredOrders().filter(order => order.status === status);
};

// Create new order
export const createOrder = (
  items: CartItem[],
  customerInfo: CustomerInfo
): Order => {
  const settings = getSettings();
  
  // Calculate total price
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Generate order ID with date prefix
  const date = new Date();
  const dateStr = date.getFullYear().toString().slice(-2) +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const orderId = `ORD-${dateStr}-${randomNum}`;

  // Create new order
  const newOrder: Order = {
    id: orderId,
    items,
    customerInfo,
    status: OrderStatus.PENDING,
    totalPrice,
    deliveryFee: settings.deliveryFee,
    createdAt: date,
    updatedAt: date,
  };

  // Get existing orders and add new order
  const orders = getStoredOrders();
  orders.push(newOrder);
  saveOrders(orders);

  return newOrder;
};

// Update order status
export const updateOrderStatus = (
  id: string,
  status: OrderStatus
): Order | undefined => {
  const orders = getStoredOrders();
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) return undefined;
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date()
  };
  
  saveOrders(orders);
  
  // Also update user's orders in their localStorage
  const userOrders = localStorage.getItem('userOrders');
  if (userOrders) {
    const parsedUserOrders = JSON.parse(userOrders);
    const userOrderIndex = parsedUserOrders.findIndex((order: Order) => order.id === id);
    if (userOrderIndex !== -1) {
      parsedUserOrders[userOrderIndex] = orders[orderIndex];
      localStorage.setItem('userOrders', JSON.stringify(parsedUserOrders));
    }
  }
  
  return orders[orderIndex];
};