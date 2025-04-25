import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Check, ShoppingBag } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    // If no order ID is provided, redirect to home
    if (!orderId) {
      navigate('/');
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="container-custom max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden text-center py-12 px-6">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-12 w-12 text-secondary-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-4">Order Received!</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Thank you for your order. We've received your request and will start preparing it right away.
            </p>
            <p className="text-lg">
              Your order number is: <span className="font-semibold">{orderId}</span>
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded mb-8 inline-block mx-auto">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="h-5 w-5 text-secondary-500 mr-2">1.</span>
                <span>We're preparing your order now.</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-secondary-500 mr-2">2.</span>
                <span>You'll receive updates about your order status.</span>
              </li>
              <li className="flex items-start">
                <span className="h-5 w-5 text-secondary-500 mr-2">3.</span>
                <span>Our delivery team will bring your food to your doorstep.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link to="/menu" className="btn btn-primary flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Order Again
            </Link>
            <Link to="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;