export function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
        <p className="text-gray-600">View all completed transactions</p>
      </div>

      {/* Payment History Table */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No payments yet today
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
