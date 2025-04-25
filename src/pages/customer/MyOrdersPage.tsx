import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCheck, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../data/orderData';
import { convertToIQD, formatIQD } from '../../utils/currency';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('userOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const currentOrders = orders.filter(order => 
    order.status !== OrderStatus.DELIVERED && 
    order.status !== OrderStatus.CANCELED
  );

  const pastOrders = orders.filter(order => 
    order.status === OrderStatus.DELIVERED || 
    order.status === OrderStatus.CANCELED
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PREPARING:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.READY:
        return 'bg-green-100 text-green-800';
      case OrderStatus.DELIVERING:
        return 'bg-indigo-100 text-indigo-800';
      case OrderStatus.DELIVERED:
        return 'bg-gray-100 text-gray-800';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-serif font-bold mb-6">طلباتي</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'current'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الطلبات الحالية ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'past'
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الطلبات السابقة ({pastOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {(activeTab === 'current' ? currentOrders : pastOrders).length > 0 ? (
            (activeTab === 'current' ? currentOrders : pastOrders).map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">رقم الطلب: {order.id}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="font-medium">{formatIQD(convertToIQD(order.totalPrice))} د.ع</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover rounded"
                          />
                        </div>
                        <div className="mr-4 flex-1">
                          <p className="font-medium">{item.name}</p>
                          {item.options && Object.entries(item.options).length > 0 && (
                            <p className="text-sm text-gray-500">
                              {Object.entries(item.options)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('، ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{item.quantity} × {formatIQD(convertToIQD(item.price))} د.ع</p>
                          <p className="font-medium">{formatIQD(convertToIQD(item.quantity * item.price))} د.ع</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.customerInfo.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">ملاحظات: </span>
                        {order.customerInfo.notes}
                      </p>
                    </div>
                  )}
                </div>

                {order.status === OrderStatus.DELIVERED && (
                  <div className="p-4 bg-gray-50 border-t">
                    <button className="btn btn-primary w-full">
                      طلب مرة أخرى
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="flex justify-center mb-4">
                {activeTab === 'current' ? (
                  <Clock className="h-16 w-16 text-gray-300" />
                ) : (
                  <ShoppingBag className="h-16 w-16 text-gray-300" />
                )}
              </div>
              <h2 className="text-xl font-medium mb-2">
                {activeTab === 'current' 
                  ? 'لا توجد طلبات حالية'
                  : 'لا توجد طلبات سابقة'}
              </h2>
              <p className="text-gray-500 mb-6">
                {activeTab === 'current'
                  ? 'لم تقم بتقديم أي طلبات حالية.'
                  : 'لم تقم بتقديم أي طلبات سابقة.'}
              </p>
              <Link to="/menu" className="btn btn-primary">
                تصفح القائمة
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;