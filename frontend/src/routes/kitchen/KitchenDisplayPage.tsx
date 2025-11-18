import { Clock } from 'lucide-react';

export function KitchenDisplayPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active Orders</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Auto-refresh: 10s</span>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Empty State */}
        <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
          <p className="text-gray-500">No pending orders</p>
          <p className="mt-1 text-sm text-gray-600">
            Orders will appear here when confirmed
          </p>
        </div>
      </div>
    </div>
  );
}
