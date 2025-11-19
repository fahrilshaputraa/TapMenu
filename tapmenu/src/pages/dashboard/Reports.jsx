import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const periods = [
  { id: 'today', name: 'Hari Ini' },
  { id: 'week', name: 'Minggu Ini' },
  { id: 'month', name: 'Bulan Ini' },
  { id: 'year', name: 'Tahun Ini' },
]

const summaryStats = {
  today: {
    revenue: { value: 2450000, change: 12, trend: 'up' },
    orders: { value: 47, change: 5, trend: 'up' },
    customers: { value: 38, change: 8, trend: 'up' },
    avgOrder: { value: 52127, change: -3, trend: 'down' },
  },
  week: {
    revenue: { value: 15680000, change: 18, trend: 'up' },
    orders: { value: 312, change: 12, trend: 'up' },
    customers: { value: 245, change: 15, trend: 'up' },
    avgOrder: { value: 50256, change: 5, trend: 'up' },
  },
  month: {
    revenue: { value: 68450000, change: 22, trend: 'up' },
    orders: { value: 1347, change: 18, trend: 'up' },
    customers: { value: 892, change: 25, trend: 'up' },
    avgOrder: { value: 50815, change: 3, trend: 'up' },
  },
  year: {
    revenue: { value: 756000000, change: 35, trend: 'up' },
    orders: { value: 15234, change: 28, trend: 'up' },
    customers: { value: 8456, change: 42, trend: 'up' },
    avgOrder: { value: 49625, change: 7, trend: 'up' },
  },
}

const dailyRevenue = [
  { day: 'Sen', revenue: 2100000 },
  { day: 'Sel', revenue: 2350000 },
  { day: 'Rab', revenue: 1980000 },
  { day: 'Kam', revenue: 2650000 },
  { day: 'Jum', revenue: 3200000 },
  { day: 'Sab', revenue: 3800000 },
  { day: 'Min', revenue: 2450000 },
]

const topProducts = [
  { name: 'Nasi Goreng Spesial', sold: 156, revenue: 2340000, percentage: 18 },
  { name: 'Ayam Bakar', sold: 124, revenue: 3100000, percentage: 24 },
  { name: 'Mie Goreng', sold: 98, revenue: 1176000, percentage: 9 },
  { name: 'Es Teh Manis', sold: 234, revenue: 1170000, percentage: 9 },
  { name: 'Soto Ayam', sold: 87, revenue: 1305000, percentage: 10 },
]

const paymentMethods = [
  { method: 'QRIS', count: 189, amount: 9450000, percentage: 60 },
  { method: 'Cash', count: 78, amount: 3900000, percentage: 25 },
  { method: 'Transfer', count: 45, amount: 2330000, percentage: 15 },
]

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const stats = summaryStats[selectedPeriod]

  const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue))

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Laporan</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Analisis performa bisnis Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
              }`}
            >
              {period.name}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stats.revenue.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stats.revenue.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stats.revenue.change}%
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              Rp {stats.revenue.value.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Pendapatan</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stats.orders.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stats.orders.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stats.orders.change}%
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.orders.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Pesanan</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stats.customers.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stats.customers.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stats.customers.change}%
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stats.customers.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Pelanggan</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stats.avgOrder.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stats.avgOrder.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stats.avgOrder.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
              Rp {stats.avgOrder.value.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Rata-rata Pesanan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Pendapatan Mingguan</h3>
            <div className="flex items-end justify-between gap-2 h-48">
              {dailyRevenue.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg relative" style={{ height: '160px' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-lg transition-all"
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Metode Pembayaran</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{method.method}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">{method.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {method.count} transaksi - Rp {method.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Produk Terlaris</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Produk</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Terjual</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pendapatan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Kontribusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{product.sold}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        Rp {product.revenue.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${product.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">{product.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
