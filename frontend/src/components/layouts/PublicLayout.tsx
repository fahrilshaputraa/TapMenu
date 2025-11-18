import { Outlet } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cart';
import { Link } from 'react-router-dom';

export function PublicLayout() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="text-lg font-bold text-primary">
              TapMenu
            </Link>

            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg">
        <Outlet />
      </main>
    </div>
  );
}
