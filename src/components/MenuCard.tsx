import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../data/menuData';
import { useCart, CartItem } from '../contexts/CartContext';
import { convertToIQD, formatIQD } from '../utils/currency';

type MenuCardProps = {
  item: MenuItem;
};

const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: calculateTotalPrice(),
      quantity,
      image: item.image,
      options: Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
    };
    
    addItem(cartItem);
    
    // Reset after adding to cart
    setQuantity(1);
    setSelectedOptions({});
    setIsExpanded(false);
    
    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleOptionChange = (optionName: string, choiceName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choiceName,
    }));
  };

  const calculateTotalPrice = () => {
    let totalPrice = item.price;
    
    if (item.options) {
      item.options.forEach(option => {
        const selectedChoice = option.choices.find(
          choice => choice.name === selectedOptions[option.name]
        );
        
        if (selectedChoice && selectedChoice.price) {
          totalPrice += selectedChoice.price;
        }
      });
    }
    
    return totalPrice;
  };

  return (
    <div className="card group hover:scale-[1.01] transition-transform duration-300">
      <div 
        className="h-48 sm:h-56 overflow-hidden relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-serif text-lg sm:text-xl">{item.name}</h3>
          <p className="text-white/90 text-sm line-clamp-1">{item.description}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg">{formatIQD(convertToIQD(calculateTotalPrice()))} د.ع</p>
          <div className="flex items-center border rounded-md">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(prev => Math.max(1, prev - 1));
              }}
              className="p-2 text-gray-500 hover:text-primary-500 touch-feedback"
              aria-label="تقليل الكمية"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 min-w-[2rem] text-center">{quantity}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(prev => prev + 1);
              }}
              className="p-2 text-gray-500 hover:text-primary-500 touch-feedback"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Options section - shown when expanded or when item has options */}
        {isExpanded && item.options && (
          <div className="mt-2 space-y-3 animate-slide-up">
            <p className="text-sm font-medium text-gray-700">خصص طلبك:</p>
            {item.options.map((option, optionIndex) => (
              <div key={optionIndex} className="space-y-1">
                <label className="text-sm text-gray-600">{option.name}:</label>
                <div className="grid grid-cols-2 gap-2">
                  {option.choices.map((choice, choiceIndex) => (
                    <button
                      key={choiceIndex}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionChange(option.name, choice.name);
                      }}
                      className={`text-sm px-3 py-2 rounded border touch-feedback ${
                        selectedOptions[option.name] === choice.name
                          ? 'bg-primary-500 text-white border-primary-500'
                          : 'bg-white border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      {choice.name}
                      {choice.price ? ` (+${formatIQD(convertToIQD(choice.price))} د.ع)` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          {!isExpanded && item.options && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-sm text-gray-600 hover:text-primary-500 underline touch-feedback"
            >
              تخصيص
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isAdding}
            className={`btn btn-primary flex items-center space-x-1 ml-auto transition-all duration-200 ${
              isAdding ? 'bg-secondary-500' : ''
            }`}
          >
            <ShoppingCart className={`h-4 w-4 ${isAdding ? 'animate-bounce' : ''}`} />
            <span>{isAdding ? 'تمت الإضافة!' : 'إضافة للسلة'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;