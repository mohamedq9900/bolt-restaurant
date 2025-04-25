import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { convertToIQD, formatIQD } from '../utils/currency';

type CartItemProps = {
  item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex border-b border-gray-200 py-4">
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{item.name}</h3>
          <p className="ml-4">{formatIQD(convertToIQD(item.price * item.quantity))} د.ع</p>
        </div>

        {/* Item customizations if any */}
        {item.options && Object.keys(item.options).length > 0 && (
          <div className="mt-1 text-sm text-gray-500">
            {Object.entries(item.options).map(([key, value]) => (
              <span key={key} className="mr-2">
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 text-gray-500 hover:text-primary-500 touch-feedback"
              aria-label="تقليل الكمية"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 min-w-[2rem] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 text-gray-500 hover:text-primary-500 touch-feedback"
              aria-label="زيادة الكمية"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-accent-600 hover:text-accent-500 flex items-center touch-feedback"
          >
            <X className="h-4 w-4 mr-1" />
            <span>إزالة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;