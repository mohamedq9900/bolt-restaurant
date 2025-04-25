import { useState, useEffect } from 'react';
import { getAllOrders, Order, OrderStatus } from '../../data/orderData';
import OrderCard from '../../components/OrderCard';
import { Search, Loader } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const allOrders = getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders based on selected status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    const matchesSearch = 
      searchTerm === '' ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Count orders by status
  const countByStatus = {
    all: orders.length,
    [OrderStatus.PENDING]: orders.filter(order => order.status === OrderStatus.PENDING).length,
    [OrderStatus.CONFIRMED]: orders.filter(order => order.status === OrderStatus.CONFIRMED).length,
    [OrderStatus.PREPARING]: orders.filter(order => order.status === OrderStatus.PREPARING).length,
    [OrderStatus.READY]: orders.filter(order => order.status === OrderStatus.READY).length,
    [OrderStatus.DELIVERING]: orders.filter(order => order.status === OrderStatus.DELIVERING).length,
    [OrderStatus.DELIVERED]: orders.filter(order => order.status === OrderStatus.DELIVERED).length,
    [OrderStatus.CANCELED]: orders.filter(order => order.status === OrderStatus.CANCELED).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="h-6 w-6 animate-spin" />
          <span>جاري تحميل الطلبات...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">إدارة الطلبات</h1>
      
      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث برقم الطلب، اسم العميل أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
          </div>
          
          <div className="shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
              className="input"
            >
              <option value="all">جميع الطلبات ({countByStatus.all})</option>
              <option value={OrderStatus.PENDING}>قيد الانتظار ({countByStatus[OrderStatus.PENDING]})</option>
              <option value={OrderStatus.CONFIRMED}>مؤكد ({countByStatus[OrderStatus.CONFIRMED]})</option>
              <option value={OrderStatus.PREPARING}>قيد التحضير ({countByStatus[OrderStatus.PREPARING]})</option>
              <option value={OrderStatus.READY}>جاهز ({countByStatus[OrderStatus.READY]})</option>
              <option value={OrderStatus.DELIVERING}>قيد التوصيل ({countByStatus[OrderStatus.DELIVERING]})</option>
              <option value={OrderStatus.DELIVERED}>تم التوصيل ({countByStatus[OrderStatus.DELIVERED]})</option>
              <option value={OrderStatus.CANCELED}>ملغي ({countByStatus[OrderStatus.CANCELED]})</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusUpdate={loadOrders} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">لا توجد طلبات تطابق معايير البحث.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;