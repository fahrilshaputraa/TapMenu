import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { Receipt, ClipboardList, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Orders', href: '/cashier', icon: ClipboardList },
  { name: 'Payments', href: '/cashier/payments', icon: Receipt },
];

export function CashierLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Cashier</h1>
                <p className="text-sm text-gray-500">TapMenu</p>
              </div>

              <nav className="flex gap-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.full_name}</span>
              <button
                onClick={logout}
                className="rounded p-2 text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
