import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
  { name: 'Tables', href: '/admin/tables', icon: QrCode },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Staff', href: '/admin/staff', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { user, staffProfiles, currentRestaurantId, logout, setCurrentRestaurant } = useAuthStore();
  const location = useLocation();
  const [restaurantMenuOpen, setRestaurantMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentProfile = staffProfiles.find(p => p.restaurant === currentRestaurantId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-xl font-bold text-primary">TapMenu</h1>
          </div>

          {/* Restaurant Selector */}
          {staffProfiles.length > 0 && (
            <div className="border-b p-4">
              <button
                onClick={() => setRestaurantMenuOpen(!restaurantMenuOpen)}
                className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="font-medium truncate">
                  {currentProfile?.restaurant_name || 'Select Restaurant'}
                </span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', restaurantMenuOpen && 'rotate-180')} />
              </button>

              {restaurantMenuOpen && staffProfiles.length > 1 && (
                <div className="mt-2 space-y-1">
                  {staffProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        setCurrentRestaurant(profile.restaurant);
                        setRestaurantMenuOpen(false);
                      }}
                      className={cn(
                        'w-full rounded px-3 py-1.5 text-left text-sm',
                        profile.restaurant === currentRestaurantId
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {profile.restaurant_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={logout}
                className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
}
