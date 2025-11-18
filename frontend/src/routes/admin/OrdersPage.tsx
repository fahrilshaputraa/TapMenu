export function OrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Table</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No orders yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
