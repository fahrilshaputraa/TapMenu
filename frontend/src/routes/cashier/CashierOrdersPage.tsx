export function CashierOrdersPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Orders</h2>
        <p className="text-gray-600">Process payments for orders</p>
      </div>

      {/* Orders List */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Empty State */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No pending payments</p>
          <p className="mt-1 text-sm text-gray-400">
            Orders ready for payment will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
