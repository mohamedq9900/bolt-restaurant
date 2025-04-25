import { useState } from 'react';
import { categories, MenuItem, Category } from '../../data/menuData';
import { convertToIQD, formatIQD } from '../../utils/currency';
import { useMenu } from '../../hooks/useMenu';
import { 
  Plus, Edit, Trash, Image, X, Filter, Loader 
} from 'lucide-react';

const AdminMenuPage = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = useMenu();
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [allCategories] = useState<Category[]>(categories);

  // Filter items based on search term and category
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddNewItem = () => {
    setIsAddModalOpen(true);
    setCurrentItem(null);
    setFormError(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
    setFormError(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('حدث خطأ أثناء حذف العنصر');
      }
    }
  };

  const validateForm = (formData: FormData): boolean => {
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const category = formData.get('category') as string;

    if (!name?.trim()) {
      setFormError('اسم العنصر مطلوب');
      return false;
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setFormError('السعر يجب أن يكون رقماً موجباً');
      return false;
    }

    if (!description?.trim()) {
      setFormError('وصف العنصر مطلوب');
      return false;
    }

    if (!image?.trim()) {
      setFormError('رابط الصورة مطلوب');
      return false;
    }

    if (!category) {
      setFormError('التصنيف مطلوب');
      return false;
    }

    const validCategory = allCategories.find(cat => cat.id === category);
    if (!validCategory) {
      setFormError('التصنيف المحدد غير صالح');
      return false;
    }

    return true;
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    
    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newItem = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')) / 1300, // Convert from IQD to USD
        image: formData.get('image') as string,
        category: formData.get('category') as string,
        featured: formData.get('featured') === 'on',
      };

      await addItem(newItem);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
      setFormError('حدث خطأ أثناء إضافة العنصر');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentItem) return;
    
    setFormError(null);
    
    const formData = new FormData(e.currentTarget);
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedItem = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')) / 1300, // Convert from IQD to USD
        image: formData.get('image') as string,
        category: formData.get('category') as string,
        featured: formData.get('featured') === 'on',
      };

      await updateItem(currentItem.id, updatedItem);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating item:', error);
      setFormError('حدث خطأ أثناء تحديث العنصر');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>جاري تحميل القائمة...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-accent-600">حدث خطأ أثناء تحميل القائمة</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">إدارة القائمة</h1>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 text-center py-3 font-medium ${
              activeTab === 'items'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            عناصر القائمة
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 text-center py-3 font-medium ${
              activeTab === 'categories'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            التصنيفات
          </button>
        </div>
      </div>
      
      {/* Menu Items Tab Content */}
      {activeTab === 'items' && (
        <>
          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="البحث في القائمة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pr-10"
                />
              </div>
              
              <div className="shrink-0 flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="input pr-10"
                  >
                    <option value="all">جميع التصنيفات</option>
                    {allCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleAddNewItem}
                  className="btn btn-primary flex items-center"
                >
                  <Plus className="h-5 w-5 ml-1" />
                  <span>إضافة عنصر</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Items List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">العنصر</th>
                    <th className="px-6 py-3">التصنيف</th>
                    <th className="px-6 py-3">السعر</th>
                    <th className="px-6 py-3">مميز</th>
                    <th className="px-6 py-3 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded overflow-hidden ml-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {allCategories.find(cat => cat.id === item.category)?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatIQD(convertToIQD(item.price))} د.ع
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            مميز
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">غير مميز</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-indigo-600 hover:text-indigo-900 ml-3"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">لم يتم العثور على عناصر.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Categories Tab Content */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-medium">جميع التصنيفات</h2>
            <button className="btn btn-primary flex items-center">
              <Plus className="h-5 w-5 ml-1" />
              <span>إضافة تصنيف</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">الاسم</th>
                  <th className="px-6 py-3">عدد العناصر</th>
                  <th className="px-6 py-3 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{category.name}</td>
                    <td className="px-6 py-4">
                      {items.filter(item => item.category === category.id).length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 ml-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-medium">إضافة عنصر جديد</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="label">
                      اسم العنصر <span className="text-accent-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      placeholder="مثال: برجر كلاسيكي"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="label">
                      السعر (د.ع) <span className="text-accent-600">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="500"
                      min="0"
                      className="input"
                      placeholder="مثال: 12000"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="label">
                    الوصف <span className="text-accent-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="input"
                    placeholder="وصف العنصر..."
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="label">
                      التصنيف <span className="text-accent-600">*</span>
                    </label>
                    <select id="category" name="category" className="input" required>
                      <option value="">اختر تصنيفاً</option>
                      {allCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="label">
                      رابط الصورة <span className="text-accent-600">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="image"
                        name="image"
                        className="input rounded-l-none"
                        placeholder="أدخل رابط الصورة"
                        required
                      />
                      <button
                        type="button"
                        className="px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                      >
                        <Image className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="mr-2 text-sm text-gray-700">
                    تمييز العنصر
                  </label>
                </div>
                
                <div className="border-t pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة العنصر'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Item Modal */}
      {isEditModalOpen && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-medium">تعديل العنصر</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {formError}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="label">
                      اسم العنصر <span className="text-accent-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      defaultValue={currentItem.name}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="label">
                      السعر (د.ع) <span className="text-accent-600">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      step="500"
                      min="0"
                      className="input"
                      defaultValue={convertToIQD(currentItem.price)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="label">
                    الوصف <span className="text-accent-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="input"
                    defaultValue={currentItem.description}
                    required
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="label">
                      التصنيف <span className="text-accent-600">*</span>
                    </label>
                    <select 
                      id="category" 
                      name="category"
                      className="input" 
                      defaultValue={currentItem.category}
                      required
                    >
                      {allCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="label">
                      رابط الصورة <span className="text-accent-600">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="image"
                        name="image"
                        className="input rounded-l-none"
                        defaultValue={currentItem.image}
                        required
                      />
                      <button
                        type="button"
                        className="px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-200"
                      >
                        <Image className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    defaultChecked={currentItem.featured}
                  />
                  <label htmlFor="featured" className="mr-2 text-sm text-gray-700">
                    تمييز العنصر
                  </label>
                </div>
                
                <div className="border-t pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;