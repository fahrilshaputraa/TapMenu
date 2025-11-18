import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { ChefHat, LogOut } from 'lucide-react';

export function KitchenLayout() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-xl font-bold text-white">Kitchen Display</h1>
                <p className="text-sm text-gray-400">TapMenu</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{user.full_name}</span>
              <button
                onClick={logout}
                className="rounded p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
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
