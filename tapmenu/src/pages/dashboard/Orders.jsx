import { useState } from 'react'
import { Search, Filter, Eye, Check, X } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const orders = [
  { id: '#001', table: 'Meja 5', customer: 'Walk-in', items: ['Nasi Goreng x2', 'Es Teh x2'], total: 50000, status: 'pending', time: '14:32', payment: 'QRIS' },
  { id: '#002', table: 'Meja 3', customer: 'Budi Santoso', items: ['Ayam Bakar', 'Nasi Putih', 'Es Jeruk'], total: 45000, status: 'preparing', time: '14:28', payment: 'Cash' },
  { id: '#003', table: 'Meja 8', customer: 'Walk-in', items: ['Mie Goreng x3'], total: 45000, status: 'ready', time: '14:20', payment: 'QRIS' },
  { id: '#004', table: 'Meja 1', customer: 'Siti Aminah', items: ['Soto Ayam x2', 'Kerupuk'], total: 35000, status: 'completed', time: '14:15', payment: 'Transfer' },
  { id: '#005', table: 'Meja 7', customer: 'Walk-in', items: ['Gado-gado', 'Es Campur'], total: 30000, status: 'completed', time: '14:10', payment: 'QRIS' },
  { id: '#006', table: 'Meja 2', customer: 'Andi Wijaya', items: ['Nasi Goreng Spesial', 'Jus Alpukat'], total: 35000, status: 'preparing', time: '14:05', payment: 'Cash' },
  { id: '#007', table: 'Meja 4', customer: 'Walk-in', items: ['Bakso x2', 'Es Teh x2'], total: 40000, status: 'pending', time: '14:00', payment: 'QRIS' },
]

const statusConfig = {
  pending: { label: 'Menunggu', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' },
  preparing: { label: 'Diproses', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  ready: { label: 'Siap', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

export function Orders() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.table.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pesanan</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kelola semua pesanan yang masuk
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="preparing">Diproses</option>
              <option value="ready">Siap</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Meja</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pembayaran</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Waktu</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{order.table}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {order.items.slice(0, 2).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2}`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{order.payment}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{order.time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <>
                            <button className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Tidak ada pesanan ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
