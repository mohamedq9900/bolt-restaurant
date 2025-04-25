import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { 
  ShoppingBag, Menu, X, Home, ChefHat, Phone, MapPin, 
  Clock, ClipboardList, Search 
} from 'lucide-react';

const footerLinks = [
  { title: 'من نحن', href: '#' },
  { title: 'وظائف', href: '#' },
  { title: 'سياسة الخصوصية', href: '#' },
  { title: 'الشروط والأحكام', href: '#' },
];

const CustomerLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { totalItems } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  // Clean up scroll lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-primary-500" />
              <span className="font-serif text-2xl font-bold">مطعمنا</span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 touch-feedback"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-base font-medium transition-colors ${
                  pathname === '/' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                الرئيسية
              </Link>
              <Link
                to="/menu"
                className={`text-base font-medium transition-colors ${
                  pathname === '/menu' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                القائمة
              </Link>
              <Link
                to="/my-orders"
                className={`text-base font-medium transition-colors ${
                  pathname === '/my-orders' ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'
                }`}
              >
                طلباتي
              </Link>
              <Link
                to="/cart"
                className="relative p-1 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <ShoppingBag className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden">
            <div className="mobile-menu-content">
              <div className="p-4 space-y-4">
                <Link
                  to="/"
                  onClick={toggleMenu}
                  className={`block py-2 text-base font-medium touch-feedback ${
                    pathname === '/' ? 'text-primary-500' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>الرئيسية</span>
                  </div>
                </Link>
                <Link
                  to="/menu"
                  onClick={toggleMenu}
                  className={`block py-2 text-base font-medium touch-feedback ${
                    pathname === '/menu' ? 'text-primary-500' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5" />
                    <span>القائمة</span>
                  </div>
                </Link>
                <Link
                  to="/my-orders"
                  onClick={toggleMenu}
                  className={`block py-2 text-base font-medium touch-feedback ${
                    pathname === '/my-orders' ? 'text-primary-500' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5" />
                    <span>طلباتي</span>
                  </div>
                </Link>
                <Link
                  to="/cart"
                  onClick={toggleMenu}
                  className={`block py-2 text-base font-medium touch-feedback ${
                    pathname === '/cart' ? 'text-primary-500' : 'text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="h-5 w-5" />
                    <span>السلة {totalItems > 0 && `(${totalItems})`}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bottom-nav">
        <Link to="/" className="bottom-nav-item">
          <Home className="bottom-nav-icon" />
          <span className="bottom-nav-label">الرئيسية</span>
        </Link>
        <Link to="/menu" className="bottom-nav-item">
          <Search className="bottom-nav-icon" />
          <span className="bottom-nav-label">القائمة</span>
        </Link>
        <Link to="/cart" className="bottom-nav-item relative">
          <ShoppingBag className="bottom-nav-icon" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="bottom-nav-label">السلة</span>
        </Link>
        <Link to="/my-orders" className="bottom-nav-item">
          <ClipboardList className="bottom-nav-icon" />
          <span className="bottom-nav-label">طلباتي</span>
        </Link>
      </nav>

      {/* Footer - Hidden on mobile */}
      <footer className="bg-gray-900 text-white py-10 hidden md:block">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand and About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-primary-500" />
                <span className="font-serif text-2xl font-bold">مطعمنا</span>
              </div>
              <p className="text-gray-400 mb-4">
                طعام لذيذ يصل إلى باب منزلك. استمتع بأفضل تجربة طعام من راحة منزلك.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">123 شارع المطعم، المدينة الغذائية</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-400">+966 50 123 4567</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-400">السبت-الخميس: 11 ص - 10 م</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-400 hover:text-primary-500 transition-colors">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">اشترك معنا</h3>
              <p className="text-gray-400 mb-4">اشترك في نشرتنا الإخبارية للحصول على العروض والتحديثات.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="px-4 py-2 rounded-r-md flex-grow text-gray-900 focus:outline-none"
                />
                <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-l-md transition-colors">
                  اشترك
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} مطعمنا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;