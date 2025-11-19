import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock
} from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const stats = [
  {
    name: 'Pendapatan Hari Ini',
    value: 'Rp 2.450.000',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Total Pesanan',
    value: '47',
    change: '+5',
    trend: 'up',
    icon: ShoppingCart,
  },
  {
    name: 'Pelanggan Baru',
    value: '12',
    change: '+3',
    trend: 'up',
    icon: Users,
  },
  {
    name: 'Rata-rata Waktu',
    value: '15 mnt',
    change: '-2 mnt',
    trend: 'up',
    icon: Clock,
  },
]

const recentOrders = [
  { id: '#001', table: 'Meja 5', items: 'Nasi Goreng x2, Es Teh x2', total: 'Rp 50.000', status: 'completed', time: '5 menit lalu' },
  { id: '#002', table: 'Meja 3', items: 'Ayam Bakar, Nasi Putih, Es Jeruk', total: 'Rp 45.000', status: 'preparing', time: '10 menit lalu' },
  { id: '#003', table: 'Meja 8', items: 'Mie Goreng x3', total: 'Rp 45.000', status: 'pending', time: '12 menit lalu' },
  { id: '#004', table: 'Meja 1', items: 'Soto Ayam x2, Kerupuk', total: 'Rp 35.000', status: 'completed', time: '20 menit lalu' },
  { id: '#005', table: 'Meja 7', items: 'Gado-gado, Es Campur', total: 'Rp 30.000', status: 'preparing', time: '25 menit lalu' },
]

const topProducts = [
  { name: 'Nasi Goreng Spesial', sold: 45, revenue: 'Rp 675.000' },
  { name: 'Ayam Bakar', sold: 38, revenue: 'Rp 570.000' },
  { name: 'Mie Goreng', sold: 32, revenue: 'Rp 320.000' },
  { name: 'Es Teh Manis', sold: 67, revenue: 'Rp 201.000' },
  { name: 'Soto Ayam', sold: 25, revenue: 'Rp 375.000' },
]

function getStatusColor(status) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'preparing':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'pending':
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
    default:
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'completed':
      return 'Selesai'
    case 'preparing':
      return 'Diproses'
    case 'pending':
      return 'Menunggu'
    default:
      return status
  }
}

export function DashboardOverview() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent orders */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pesanan Terbaru</h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{order.id}</span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">- {order.table}</span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">{order.items}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">{order.total}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                Lihat semua pesanan
              </button>
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Produk Terlaris</h2>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {topProducts.map((product, index) => (
                <div key={product.name} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{product.sold} terjual</p>
                    </div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
