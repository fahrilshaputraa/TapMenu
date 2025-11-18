import { useAuthStore } from '@/stores/auth';

export function DashboardPage() {
  const { user, staffProfiles, currentRestaurantId } = useAuthStore();
  const currentProfile = staffProfiles.find(p => p.restaurant === currentRestaurantId);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.full_name}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">Rp 0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Tables</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Restaurant Info */}
      {currentProfile && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Restaurant Info</h2>
          <div className="mt-4 space-y-2">
            <p><span className="text-gray-500">Name:</span> {currentProfile.restaurant_name}</p>
            <p><span className="text-gray-500">Your Role:</span> {currentProfile.role}</p>
            <p><span className="text-gray-500">Status:</span> {currentProfile.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
