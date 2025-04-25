import { getAllOrders, OrderStatus } from '../../data/orderData';
import { useMenu } from '../../hooks/useMenu';
import { 
  ShoppingBag, CheckCheck, Clock, ChefHat, Truck, 
  XCircle, DollarSign, Users, Package 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertToIQD, formatIQD } from '../../utils/currency';

const AdminDashboardPage = () => {
  const { items } = useMenu();
  const orders = getAllOrders();

  const pendingOrders = orders.filter(order => order.status === OrderStatus.PENDING);
  const preparingOrders = orders.filter(order => order.status === OrderStatus.PREPARING);
  const deliveringOrders = orders.filter(order => order.status === OrderStatus.DELIVERING);
  const completedOrders = orders.filter(
    order => order.status === OrderStatus.DELIVERED || order.status === OrderStatus.READY
  );
  const canceledOrders = orders.filter(order => order.status === OrderStatus.CANCELED);

  // Calculate total revenue from completed orders
  const totalRevenue = completedOrders.reduce((total, order) => total + order.totalPrice, 0);

  // Get sales by menu item
  const salesByItem = completedOrders.flatMap(order => order.items).reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
      existing.total += item.price * item.quantity;
    } else {
      acc.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        total: item.price * item.quantity
      });
    }
    return acc;
  }, [] as { id: string; name: string; quantity: number; total: number }[]);

  // Sort by highest quantity
  salesByItem.sort((a, b) => b.quantity - a.quantity);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">لوحة التحكم</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">{formatIQD(convertToIQD(totalRevenue))} د.ع</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <DollarSign className="h-6 w-6 text-secondary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">عدد الطلبات</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">عناصر القائمة</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-md">
              <Package className="h-6 w-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">العملاء</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b">
          <h2 className="font-medium">نظرة عامة على حالة الطلبات</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-yellow-50 p-4 rounded-md text-center">
              <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">قيد الانتظار</p>
              <p className="text-xl font-bold">{pendingOrders.length}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-md text-center">
              <ChefHat className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">قيد التحضير</p>
              <p className="text-xl font-bold">{preparingOrders.length}</p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-md text-center">
              <Truck className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">قيد التوصيل</p>
              <p className="text-xl font-bold">{deliveringOrders.length}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-md text-center">
              <CheckCheck className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">مكتمل</p>
              <p className="text-xl font-bold">{completedOrders.length}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-md text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">ملغي</p>
              <p className="text-xl font-bold">{canceledOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-gray-50 text-center">
          <Link to="/admin/orders" className="text-primary-500 hover:text-primary-600 font-medium">
            عرض جميع الطلبات
          </Link>
        </div>
      </div>

      {/* Recent Orders and Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-medium">آخر الطلبات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">رقم الطلب</th>
                  <th className="px-6 py-3">العميل</th>
                  <th className="px-6 py-3">الحالة</th>
                  <th className="px-6 py-3">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerInfo.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === OrderStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === OrderStatus.CONFIRMED
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === OrderStatus.PREPARING
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === OrderStatus.DELIVERING
                          ? 'bg-indigo-100 text-indigo-800'
                          : order.status === OrderStatus.DELIVERED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatIQD(convertToIQD(order.totalPrice))} د.ع</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-medium">الأصناف الأكثر مبيعاً</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">الصنف</th>
                  <th className="px-6 py-3">الكمية المباعة</th>
                  <th className="px-6 py-3">الإيرادات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesByItem.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatIQD(convertToIQD(item.total))} د.ع</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;