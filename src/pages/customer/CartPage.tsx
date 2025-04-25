import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/CartItem';
import { convertToIQD, formatIQD } from '../../utils/currency';
import { getSettings } from '../../data/settingsData';

const CartPage = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const settings = getSettings();
  const deliveryFee = settings.deliveryFee;
  const finalTotal = convertToIQD(totalPrice) + deliveryFee;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleClearCart = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إفراغ السلة؟')) {
      clearCart();
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif font-bold">سلة التسوق</h1>
          <Link to="/menu" className="text-primary-500 hover:text-primary-600 flex items-center">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>متابعة التسوق</span>
          </Link>
        </div>

        {items.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className="p-4 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>المجموع الفرعي ({totalItems} عناصر)</p>
                  <p>{formatIQD(convertToIQD(totalPrice))} د.ع</p>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <p>رسوم التوصيل</p>
                  <p>{formatIQD(deliveryFee)} د.ع</p>
                </div>
                
                <div className="flex justify-between text-lg font-bold mb-4">
                  <p>الإجمالي</p>
                  <p>{formatIQD(finalTotal)} د.ع</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleClearCart}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                إفراغ السلة
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 ml-2" />
                متابعة الطلب
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium mb-4">سلة التسوق فارغة</h2>
            <p className="text-gray-500 mb-6">يبدو أنك لم تضف أي عناصر إلى سلة التسوق بعد.</p>
            <Link to="/menu" className="btn btn-primary inline-block">
              تصفح القائمة
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;