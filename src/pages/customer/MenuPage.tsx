import { useState, useEffect } from 'react';
import MenuCard from '../../components/MenuCard';
import { categories, MenuItem } from '../../data/menuData';
import { Loader } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { getItemsByCategory } from '../../lib/storage';

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMenuItems = () => {
    try {
      setLoading(true);
      const items = getItemsByCategory(activeCategory);
      setMenuItems(items);
      setFilteredItems(items);
      setError(null);
    } catch (err) {
      console.error('Error loading menu items:', err);
      setError('حدث خطأ أثناء تحميل القائمة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
    
    // Listen for menu updates
    const handleMenuUpdate = () => {
      loadMenuItems();
    };
    
    window.addEventListener('menuUpdated', handleMenuUpdate);
    
    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, [activeCategory]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(menuItems);
      return;
    }

    const filtered = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="جاري تحميل القائمة..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <ErrorMessage 
          message={error}
          onRetry={loadMenuItems}
        />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">قائمة الطعام</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            استكشف مجموعتنا الواسعة من الأطباق اللذيذة، المحضرة بمكونات طازجة وبكل حب.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في القائمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 mb-8 hide-scrollbar">
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">لم يتم العثور على أي عناصر. جرب بحثًا مختلفًا أو تصنيفًا آخر.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;