import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { createOrder, CustomerInfo } from '../../data/orderData';
import { convertToIQD, formatIQD } from '../../utils/currency';
import { getSettings } from '../../data/settingsData';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const settings = getSettings();
  const deliveryFee = settings.deliveryFee;
  const totalInIQD = convertToIQD(totalPrice);
  const finalTotal = totalInIQD + deliveryFee;
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    email: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [items, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\+?\d{10,15}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'الرجاء إدخال رقم هاتف صحيح';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    if (customerInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'الرجاء إدخال بريد إلكتروني صحيح';
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const order = createOrder(items, customerInfo);
      
      // Save order to user's orders
      const savedOrders = localStorage.getItem('userOrders');
      const userOrders = savedOrders ? JSON.parse(savedOrders) : [];
      userOrders.push(order);
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
      
      // Clear the cart
      clearCart();
      
      // Navigate to success page with order ID
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('حدث خطأ أثناء تقديم الطلب. الرجاء المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-serif font-bold mb-6">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-lg">ملخص الطلب</h2>
              </div>
              
              <div className="p-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <div className="text-sm text-gray-500">
                        {item.options && 
                          Object.entries(item.options)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('، ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{item.quantity} × {formatIQD(convertToIQD(item.price))} د.ع</p>
                      <p className="font-medium">{formatIQD(convertToIQD(item.quantity * item.price))} د.ع</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>المجموع الفرعي</span>
                  <span>{formatIQD(totalInIQD)} د.ع</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>رسوم التوصيل</span>
                  <span>{formatIQD(deliveryFee)} د.ع</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>الإجمالي</span>
                  <span>{formatIQD(finalTotal)} د.ع</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-lg">معلومات التوصيل</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="label">
                    الاسم الكامل <span className="text-accent-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={`input ${errors.name ? 'border-accent-600 focus:ring-accent-600 focus:border-accent-600' : ''}`}
                    required
                  />
                  {errors.name && <p className="text-accent-600 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="label">
                    رقم الهاتف <span className="text-accent-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`input ${errors.phone ? 'border-accent-600 focus:ring-accent-600 focus:border-accent-600' : ''}`}
                    placeholder="+964 XXX XXX XXXX"
                    required
                  />
                  {errors.phone && <p className="text-accent-600 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="address" className="label">
                    عنوان التوصيل <span className="text-accent-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={`input ${errors.address ? 'border-accent-600 focus:ring-accent-600 focus:border-accent-600' : ''}`}
                    placeholder="الشارع، المبنى، الشقة، إلخ."
                    required
                  />
                  {errors.address && <p className="text-accent-600 text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`input ${errors.email ? 'border-accent-600 focus:ring-accent-600 focus:border-accent-600' : ''}`}
                    placeholder="example@email.com"
                  />
                  {errors.email && <p className="text-accent-600 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="notes" className="label">
                    ملاحظات خاصة (اختياري)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    className="input h-24"
                    placeholder="تعليمات التوصيل، الحساسية من الطعام، إلخ."
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري معالجة الطلب...' : 'تأكيد الطلب'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;