import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, Order, OrderStatus, updateOrderStatus } from '../../data/orderData';
import { LogOut, MapPin, Phone, Navigation2 } from 'lucide-react';
import { convertToIQD, formatIQD } from '../../utils/currency';

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const driver = localStorage.getItem('deliveryDriver');
    if (!driver) {
      navigate('/delivery');
      return;
    }

    loadOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadOrders = () => {
    try {
      const allOrders = getAllOrders();
      const relevantOrders = allOrders.filter(order => 
        order.status === OrderStatus.READY || 
        order.status === OrderStatus.DELIVERING
      );
      setOrders(relevantOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('deliveryDriver');
    navigate('/delivery');
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">جاري تحميل الطلبات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">طلبات التوصيل</h1>
          <button
            onClick={handleLogout}
            className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center"
          >
            <LogOut className="h-5 w-5 ml-2" />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-medium mb-2">طلب #{order.id}</h2>
                      <p className="text-gray-600">
                        {new Intl.DateTimeFormat('ar-IQ', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }).format(new Date(order.createdAt))}
                      </p>
                    </div>
                    <div className="text-left">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === OrderStatus.READY
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-200 py-4 mb-4">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-gray-400 ml-2" />
                      <span className="font-medium">عنوان التوصيل:</span>
                    </div>
                    <p className="text-gray-600 mb-2">{order.customerInfo.address}</p>
                    <button
                      onClick={() => openGoogleMaps(order.customerInfo.address)}
                      className="btn bg-blue-500 text-white hover:bg-blue-600 flex items-center"
                    >
                      <Navigation2 className="h-5 w-5 ml-2" />
                      فتح في خرائط جوجل
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <Phone className="h-5 w-5 text-gray-400 ml-2" />
                      <span className="font-medium">معلومات العميل:</span>
                    </div>
                    <p className="text-gray-600">الاسم: {order.customerInfo.name}</p>
                    <p className="text-gray-600">الهاتف: {order.customerInfo.phone}</p>
                    {order.customerInfo.notes && (
                      <p className="text-gray-600 mt-2">
                        <span className="font-medium">ملاحظات: </span>
                        {order.customerInfo.notes}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-3">تفاصيل الطلب:</h3>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.quantity}x</span> {item.name}
                            {item.options && Object.entries(item.options).length > 0 && (
                              <p className="text-sm text-gray-500">
                                {Object.entries(item.options)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join('، ')}
                              </p>
                            )}
                          </div>
                          <div className="text-gray-600">
                            {formatIQD(convertToIQD(item.price * item.quantity))} د.ع
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>المجموع الفرعي:</span>
                        <span>{formatIQD(convertToIQD(order.totalPrice))} د.ع</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>رسوم التوصيل:</span>
                        <span>{formatIQD(order.deliveryFee)} د.ع</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg mt-2">
                        <span>الإجمالي:</span>
                        <span>{formatIQD(convertToIQD(order.totalPrice) + order.deliveryFee)} د.ع</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    {order.status === OrderStatus.READY && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, OrderStatus.DELIVERING)}
                        className="btn btn-primary"
                      >
                        استلام الطلب للتوصيل
                      </button>
                    )}
                    {order.status === OrderStatus.DELIVERING && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, OrderStatus.DELIVERED)}
                        className="btn btn-primary"
                      >
                        تأكيد التوصيل
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-medium mb-2">لا توجد طلبات للتوصيل حالياً</h2>
            <p className="text-gray-500">ستظهر الطلبات الجديدة هنا عندما تكون جاهزة للتوصيل</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryOrdersPage;