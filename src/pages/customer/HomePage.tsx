import { Link } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, Clock, Truck } from 'lucide-react';
import MenuCard from '../../components/MenuCard';
import { useEffect, useState } from 'react';
import type { MenuItem } from '../../types/menu';
import { getFeaturedItems } from '../../lib/storage';

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedItems = () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = getFeaturedItems();
      setFeaturedItems(items);
    } catch (err) {
      console.error('Error loading featured items:', err);
      setError('Failed to load featured items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedItems();
    
    // Listen for menu updates
    const handleMenuUpdate = () => {
      loadFeaturedItems();
    };
    
    window.addEventListener('menuUpdated', handleMenuUpdate);
    
    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Restaurant interior"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 container-custom h-full flex flex-col justify-center">
          <div className="max-w-xl animate-slide-up">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white">
              Delicious Food, <br />Delivered to Your Door
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Experience the finest culinary delights from our kitchen to your home.
              Quick, easy, and always delicious.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu" className="btn btn-primary text-center text-base">
                Browse Menu
              </Link>
              <a href="#featured" className="btn bg-white text-gray-900 hover:bg-gray-100 text-center text-base">
                Featured Items
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take pride in providing exceptional food and service to our customers.
              Here's what makes us special.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Food</h3>
              <p className="text-gray-600">
                We use only the freshest ingredients to prepare our dishes, ensuring every bite is delicious.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Preparation</h3>
              <p className="text-gray-600">
                Our expert chefs prepare your food quickly without compromising on quality or taste.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 p-3 w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick Delivery</h3>
              <p className="text-gray-600">
                Our delivery team ensures your food arrives hot and fresh at your doorstep in no time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items */}
      <section id="featured" className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold">Featured Dishes</h2>
            <Link to="/menu" className="flex items-center text-primary-500 hover:text-primary-600 font-medium">
              <span>View Full Menu</span>
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-pulse">Loading featured items...</div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                {error}
              </div>
            ) : featuredItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No featured items available at the moment.
              </div>
            ) : (
              featuredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Testimonials / Call to Action */}
      <section className="py-12 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-4">Our Happy Customers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. See what our customers have to say about their dining experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "The food was absolutely amazing! Delivery was prompt and everything was still hot when it arrived. Will definitely order again!"
              </p>
              <div className="font-medium">- Sarah Johnson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "Best burger I've ever had! The online ordering system was so easy to use. I love that I could customize my order with all the toppings I wanted."
              </p>
              <div className="font-medium">- Mike Thompson</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "I order for my family every weekend and the food never disappoints. Great selection, great prices, and always on time!"
              </p>
              <div className="font-medium">- Lisa Rodriguez</div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/menu" className="btn btn-primary inline-block">
              Order Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;