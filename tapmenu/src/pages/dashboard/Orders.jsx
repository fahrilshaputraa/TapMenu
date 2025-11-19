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
  pending: { label: 'Menunggu', color: 'bg-gray-100 text-gray-600' },
  preparing: { label: 'Diproses', color: 'bg-orange-100 text-orange-700' },
  ready: { label: 'Siap', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Selesai', color: 'bg-secondary text-primary' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
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
            <h1 className="text-2xl font-bold text-primary">Pesanan</h1>
            <p className="text-sm text-gray-500">
              Kelola semua pesanan yang masuk
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-600"
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
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Meja</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pembayaran</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{order.table}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {order.items.slice(0, 2).join(', ')}
                        {order.items.length > 2 && ` +${order.items.length - 2}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">
                        Rp {order.total.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.payment}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{order.time}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <>
                            <button className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-secondary/20 transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-primary mb-1">Tidak ada pesanan ditemukan</h3>
              <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian atau filter status</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
