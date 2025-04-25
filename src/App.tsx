import { Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import DeliveryLoginPage from './pages/delivery/DeliveryLoginPage';
import DeliveryOrdersPage from './pages/delivery/DeliveryOrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminLoginPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Delivery Routes */}
          <Route path="/delivery">
            <Route index element={<DeliveryLoginPage />} />
            <Route path="orders" element={<DeliveryOrdersPage />} />
          </Route>

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;