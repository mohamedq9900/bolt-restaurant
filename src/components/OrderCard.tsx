import { useState } from 'react';
import { ChevronDown, ChevronUp, Printer } from 'lucide-react';
import { Order, OrderStatus, updateOrderStatus } from '../data/orderData';
import { convertToIQD, formatIQD } from '../utils/currency';
import { printInvoice } from '../utils/invoice';

type OrderCardProps = {
  order: Order;
  onStatusUpdate?: () => void;
};

const OrderCard = ({ order, onStatusUpdate }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const updatedOrder = updateOrderStatus(order.id, newStatus);
      if (updatedOrder) {
        setStatus(newStatus);
        onStatusUpdate?.();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-IQ', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  // Status color mappings
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PREPARING]: 'bg-purple-100 text-purple-800',
    [OrderStatus.READY]: 'bg-green-100 text-green-800',
    [OrderStatus.DELIVERING]: 'bg-indigo-100 text-indigo-800',
    [OrderStatus.DELIVERED]: 'bg-gray-100 text-gray-800',
    [OrderStatus.CANCELED]: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium">{order.id}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
                {status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <p className="font-medium">{formatIQD(convertToIQD(order.totalPrice))} د.ع</p>
            <button
              onClick={() => printInvoice(order)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="طباعة الفاتورة"
            >
              <Printer className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label={expanded ? "طي تفاصيل الطلب" : "عرض تفاصيل الطلب"}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-gray-200 animate-fade-in">
          {/* Customer Info */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">معلومات العميل</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-600">الاسم:</span> {order.customerInfo.name}</p>
              <p><span className="text-gray-600">الهاتف:</span> {order.customerInfo.phone}</p>
              <p className="md:col-span-2"><span className="text-gray-600">العنوان:</span> {order.customerInfo.address}</p>
              {order.customerInfo.email && (
                <p><span className="text-gray-600">البريد الإلكتروني:</span> {order.customerInfo.email}</p>
              )}
              {order.customerInfo.notes && (
                <p className="md:col-span-2"><span className="text-gray-600">ملاحظات:</span> {order.customerInfo.notes}</p>
              )}
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">عناصر الطلب</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded overflow-hidden ml-2">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.options && 
                          Object.entries(item.options)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('، ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{item.quantity} × {formatIQD(convertToIQD(item.price))}</p>
                    <p className="font-medium">{formatIQD(convertToIQD(item.quantity * item.price))} د.ع</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Status Management */}
          <div>
            <h4 className="font-medium mb-2">تحديث الحالة</h4>
            <div className="flex flex-wrap gap-2">
              {Object.values(OrderStatus).map((orderStatus) => (
                <button
                  key={orderStatus}
                  onClick={() => handleStatusChange(orderStatus)}
                  disabled={isUpdating || status === orderStatus}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    status === orderStatus
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {orderStatus}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;