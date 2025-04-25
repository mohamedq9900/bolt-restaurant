import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, User } from 'lucide-react';

const DeliveryLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Mock login for demo purposes
      if (username === 'driver' && password === 'password123') {
        localStorage.setItem('deliveryDriver', JSON.stringify({ id: '1', username: 'driver' }));
        navigate('/delivery/orders');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md w-full">
        <div className="bg-gray-900 p-6 text-white text-center">
          <div className="flex justify-center mb-2">
            <ChefHat className="h-12 w-12 text-primary-500" />
          </div>
          <h1 className="text-2xl font-serif font-bold">واجهة التوصيل</h1>
          <p className="text-gray-400">قم بتسجيل الدخول للوصول إلى طلبات التوصيل</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-accent-600 p-3 rounded-md text-sm text-right">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="label">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pr-10"
                placeholder="أدخل اسم المستخدم"
                autoComplete="username"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="label">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-10"
                placeholder="أدخل كلمة المرور"
                autoComplete="current-password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>للتجربة، استخدم:</p>
            <p className="font-medium text-gray-700">اسم المستخدم: driver / كلمة المرور: password123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLoginPage;