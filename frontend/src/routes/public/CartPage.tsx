import { useCartStore } from '@/stores/cart';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-4">
        <p className="text-gray-500">Your cart is empty</p>
        <Link to="/" className="mt-4 text-primary hover:underline">
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                {item.variant && (
                  <p className="text-sm text-gray-500">{item.variant.name}</p>
                )}
                {item.notes && (
                  <p className="mt-1 text-sm text-gray-400">Note: {item.notes}</p>
                )}
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(index, item.quantity - 1)}
                  className="rounded-full bg-gray-100 p-1"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="rounded-full bg-gray-100 p-1"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="font-medium">
                {formatCurrency(item.product.current_price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Tax and service charge will be calculated at checkout
        </p>
      </div>

      {/* Checkout Button */}
      <button className="mt-4 w-full rounded-lg bg-primary py-3 font-medium text-white">
        Place Order
      </button>
    </div>
  );
}
