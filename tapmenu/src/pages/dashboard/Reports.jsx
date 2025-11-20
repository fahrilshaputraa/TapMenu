import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Table } from '../../components/Table'

// Data dummy
const reportData = {
  today: {
    revenue: 1250000,
    transactions: 45,
    average: 27777,
    chartLabels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    chartData: [150000, 300000, 550000, 200000, 400000, 600000, 350000],
    employees: [
      { name: "Siti Aminah", transactions: 20, total: 600000, avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Andi Setiawan", transactions: 15, total: 450000, avatar: "https://i.pravatar.cc/150?img=3" },
      { name: "Rini Wati", transactions: 10, total: 200000, avatar: "https://i.pravatar.cc/150?img=5" }
    ]
  },
  week: {
    revenue: 8450000,
    transactions: 320,
    average: 26406,
    chartLabels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    chartData: [1100000, 1250000, 900000, 1400000, 1800000, 2100000, 1600000],
    employees: [
      { name: "Siti Aminah", transactions: 120, total: 3500000, avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Andi Setiawan", transactions: 110, total: 3000000, avatar: "https://i.pravatar.cc/150?img=3" },
      { name: "Rini Wati", transactions: 90, total: 1950000, avatar: "https://i.pravatar.cc/150?img=5" }
    ]
  },
  month: {
    revenue: 35600000,
    transactions: 1450,
    average: 24551,
    chartLabels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
    chartData: [8500000, 9200000, 8100000, 9800000],
    employees: [
      { name: "Siti Aminah", transactions: 500, total: 14000000, avatar: "https://i.pravatar.cc/150?img=1" },
      { name: "Andi Setiawan", transactions: 480, total: 12500000, avatar: "https://i.pravatar.cc/150?img=3" },
      { name: "Rini Wati", transactions: 470, total: 9100000, avatar: "https://i.pravatar.cc/150?img=5" }
    ]
  }
}

const transactions = [
  { id: "ORD-0094", time: "14:30", cashier: "Siti Aminah", method: "Tunai", total: 45000 },
  { id: "ORD-0093", time: "14:15", cashier: "Andi Setiawan", method: "QRIS", total: 120000 },
  { id: "ORD-0092", time: "13:45", cashier: "Siti Aminah", method: "Tunai", total: 25000 },
  { id: "ORD-0091", time: "13:30", cashier: "Rini Wati", method: "QRIS", total: 78000 },
  { id: "ORD-0090", time: "13:10", cashier: "Siti Aminah", method: "Tunai", total: 33000 },
]

export function Reports() {
  const [filter, setFilter] = useState('today')
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const [animatedTransactions, setAnimatedTransactions] = useState(0)
  const [animatedAverage, setAnimatedAverage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const data = reportData[filter]

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num)
  }

  // Animate values
  useEffect(() => {
    const duration = 500
    const steps = 30
    const interval = duration / steps

    const revenueStep = data.revenue / steps
    const transStep = data.transactions / steps
    const avgStep = data.average / steps

    let current = 0
    const timer = setInterval(() => {
      current++
      setAnimatedRevenue(Math.floor(revenueStep * current))
      setAnimatedTransactions(Math.floor(transStep * current))
      setAnimatedAverage(Math.floor(avgStep * current))

      if (current >= steps) {
        setAnimatedRevenue(data.revenue)
        setAnimatedTransactions(data.transactions)
        setAnimatedAverage(data.average)
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [filter, data])

  // Initialize Chart
  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return

      // Dynamically import Chart.js
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)

      const ctx = chartRef.current.getContext('2d')

      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Gradient Fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, 'rgba(27, 67, 50, 0.2)')
      gradient.addColorStop(1, 'rgba(27, 67, 50, 0)')

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.chartLabels,
          datasets: [{
            label: 'Pemasukan (Rp)',
            data: data.chartData,
            borderColor: '#1B4332',
            backgroundColor: gradient,
            borderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#1B4332',
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1B4332',
              titleFont: { family: 'Plus Jakarta Sans' },
              bodyFont: { family: 'Plus Jakarta Sans' },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function (context) {
                  return formatRupiah(context.raw)
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              },
              ticks: {
                callback: function (value) {
                  if (value >= 1000000) return (value / 1000000) + 'jt'
                  if (value >= 1000) return (value / 1000) + 'rb'
                  return value
                },
                font: { family: 'Plus Jakarta Sans', size: 10 },
                color: '#9ca3af'
              }
            },
            x: {
              grid: { display: false },
              ticks: {
                font: { family: 'Plus Jakarta Sans', size: 10 },
                color: '#9ca3af'
              }
            }
          }
        }
      })
    }

    loadChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [filter, data])

  // Sort employees by total
  const sortedEmployees = [...data.employees].sort((a, b) => b.total - a.total)
  const maxTotal = sortedEmployees[0]?.total || 1

  // Filter transactions
  const filteredTransactions = transactions.filter(trx =>
    trx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trx.cashier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark">Laporan & Keuangan</h2>
          <p className="text-xs text-gray-500">Analisa penjualan toko dan kinerja tim</p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'today'
                ? 'bg-gray-100 text-dark shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'week'
                ? 'bg-gray-100 text-dark shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'month'
                ? 'bg-gray-100 text-dark shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            Bulan Ini
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button className="px-2 py-1.5 text-gray-400 hover:text-primary text-xs">
            <i className="fa-regular fa-calendar"></i>
          </button>
        </div>
      </div>

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Omzet */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Pemasukan</p>
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-1">{formatRupiah(animatedRevenue)}</h3>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <i className="fa-solid fa-arrow-trend-up"></i> +12% <span className="text-gray-400 font-normal">vs periode lalu</span>
            </p>
          </div>
        </div>

        {/* Transaksi */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Transaksi</p>
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-1">{animatedTransactions}</h3>
            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <i className="fa-solid fa-check-double"></i> +5 <span className="text-gray-400 font-normal">pesanan baru</span>
            </p>
          </div>
        </div>

        {/* Rata-rata */}
        <div className="bg-white p-5 rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <i className="fa-solid fa-basket-shopping"></i>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">Rata-rata Order</p>
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-1">{formatRupiah(animatedAverage)}</h3>
            <p className="text-xs text-gray-400 font-normal">
              Per pelanggan per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* 2. CHART & EMPLOYEE STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-dark text-lg">Grafik Penjualan</h3>
            <button className="text-xs text-primary font-bold border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              Download PDF
            </button>
          </div>
          <div className="relative h-64 w-full">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col">
          <h3 className="font-bold text-dark text-lg mb-1">Top Performa Kasir</h3>
          <p className="text-xs text-gray-400 mb-6">Berdasarkan total nominal transaksi.</p>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {sortedEmployees.map((emp, index) => {
              const rankColor = index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-700'
              const percent = Math.round((emp.total / maxTotal) * 100)

              return (
                <div key={emp.name} className="flex items-center gap-3 group">
                  <div className={`w-6 text-center font-bold text-sm ${rankColor}`}>#{index + 1}</div>
                  <div className="relative">
                    <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-sm text-dark truncate">{emp.name}</h4>
                      <span className="font-bold text-xs text-primary">{formatRupiah(emp.total)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{emp.transactions} Transaksi</p>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="w-full mt-6 py-2.5 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            Lihat Detail Absensi
          </button>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-dark text-lg">Riwayat Transaksi Terakhir</h3>
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              placeholder="Cari No. Order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table
            columns={[
              {
                header: 'No. Order',
                accessor: (trx) => <span className="font-mono text-xs font-bold text-primary">{trx.id}</span>
              },
              {
                header: 'Waktu',
                accessor: (trx) => <span className="text-gray-500">{trx.time}</span>
              },
              {
                header: 'Kasir',
                accessor: (trx) => <span className="font-bold text-dark">{trx.cashier}</span>
              },
              {
                header: 'Metode',
                accessor: (trx) => (
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${trx.method === 'QRIS'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-green-50 text-green-600'
                    }`}>
                    {trx.method}
                  </span>
                )
              },
              {
                header: 'Total',
                className: 'text-right',
                cellClassName: 'text-right',
                accessor: (trx) => <span className="font-bold text-dark">{formatRupiah(trx.total)}</span>
              }
            ]}
            data={filteredTransactions}
            keyExtractor={(trx) => trx.id}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
