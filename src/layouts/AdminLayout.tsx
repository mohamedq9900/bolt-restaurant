import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, LogOut, LayoutDashboard, ShoppingBag, FileText, ChefHat, Settings
} from 'lucide-react';

const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!isAuthenticated && pathname !== '/admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, pathname, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // If on the login page and not authenticated, don't show the admin layout
  if (pathname === '/admin' && !isAuthenticated) {
    return <Outlet />;
  }

  const navItems = [
    { path: '/admin/dashboard', label: 'لوحة التحكم', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/admin/orders', label: 'الطلبات', icon: <ShoppingBag className="h-5 w-5" /> },
    { path: '/admin/menu', label: 'القائمة', icon: <FileText className="h-5 w-5" /> },
    { path: '/admin/settings', label: 'الإعدادات', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary-500" />
            <span className="font-serif text-xl font-semibold">لوحة التحكم</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full text-left text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary-500" />
          <span className="font-serif text-lg font-semibold">لوحة التحكم</span>
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white p-4 animate-fade-in">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                  pathname === item.path
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 w-full text-left text-gray-300 hover:bg-gray-800 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;