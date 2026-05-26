import { useEffect, useMemo, useRef, useState } from 'react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Table } from '../../components/Table'
import { loadReportsSummary } from '../../services/reports'
import {
  buildReportsTransactions,
  filterReportTransactions,
  formatReportsRupiah,
  getReportsChartData,
  getReportsMetrics,
} from '../../utils/reports'

export function Reports() {
  const [filter, setFilter] = useState('today')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [animatedRevenue, setAnimatedRevenue] = useState(0)
  const [animatedTransactions, setAnimatedTransactions] = useState(0)
  const [animatedAverage, setAnimatedAverage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    let active = true

    async function fetchSummary() {
      try {
        const payload = await loadReportsSummary()
        if (active) {
          setSummary(payload)
          setError('')
        }
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchSummary()
    return () => {
      active = false
    }
  }, [])

  const metrics = useMemo(() => getReportsMetrics(summary), [summary])
  const chartData = useMemo(() => getReportsChartData(summary, filter), [filter, summary])
  const transactions = useMemo(() => buildReportsTransactions(summary), [summary])

  useEffect(() => {
    const duration = 500
    const steps = 30
    const interval = duration / steps
    const revenueStep = Number(metrics.revenue) / steps
    const transStep = Number(metrics.transactions) / steps
    const avgStep = Number(metrics.average) / steps

    let current = 0
    const timer = setInterval(() => {
      current += 1
      setAnimatedRevenue(Math.floor(revenueStep * current))
      setAnimatedTransactions(Math.floor(transStep * current))
      setAnimatedAverage(Math.floor(avgStep * current))

      if (current >= steps) {
        setAnimatedRevenue(Number(metrics.revenue))
        setAnimatedTransactions(Number(metrics.transactions))
        setAnimatedAverage(Math.floor(Number(metrics.average)))
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [metrics.average, metrics.revenue, metrics.transactions])

  useEffect(() => {
    const loadChart = async () => {
      if (!chartRef.current) return
      const { Chart, registerables } = await import('chart.js')
      Chart.register(...registerables)

      const ctx = chartRef.current.getContext('2d')
      if (chartInstance.current) chartInstance.current.destroy()

      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, 'rgba(27, 67, 50, 0.2)')
      gradient.addColorStop(1, 'rgba(27, 67, 50, 0)')

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Laporan',
            data: chartData.values,
            borderColor: '#1B4332',
            backgroundColor: gradient,
            borderWidth: 2,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#1B4332',
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1B4332',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label(context) {
                  return formatReportsRupiah(context.raw)
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f3f4f6' },
              ticks: {
                callback(value) {
                  if (value >= 1000000) return `${value / 1000000}jt`
                  if (value >= 1000) return `${value / 1000}rb`
                  return value
                },
                color: '#9ca3af',
              },
            },
            x: {
              grid: { display: false },
              ticks: { color: '#9ca3af' },
            },
          },
        },
      })
    }

    loadChart()
    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [chartData])

  const filteredTransactions = useMemo(() => filterReportTransactions(transactions, searchQuery), [searchQuery, transactions])

  return (
    <DashboardLayout>
      {error ? <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark">Laporan & Keuangan</h2>
          <p className="text-xs text-gray-500">Analisa penjualan toko dan kinerja tim</p>
        </div>

        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          {[
            { id: 'today', label: 'Hari Ini' },
            { id: 'week', label: 'Minggu Ini' },
            { id: 'month', label: 'Bulan Ini' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                filter === tab.id ? 'bg-gray-100 text-dark shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">Total Pemasukan</p>
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-1">{formatReportsRupiah(animatedRevenue)}</h3>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <i className="fa-solid fa-arrow-trend-up"></i> {summary?.paid_orders || 0} pesanan lunas
            </p>
          </div>
        </div>

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
              <i className="fa-solid fa-check-double"></i> {summary?.pending_orders || 0} pesanan pending
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-card border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <i className="fa-solid fa-basket-shopping"></i>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase">Rata-rata Order</p>
            </div>
            <h3 className="text-2xl font-extrabold text-dark mb-1">{formatReportsRupiah(animatedAverage)}</h3>
            <p className="text-xs text-gray-400 font-normal">Per pesanan yang sudah dibayar</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-dark text-lg">Grafik Penjualan</h3>
            <button className="text-xs text-primary font-bold border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
              Ringkasan
            </button>
          </div>
          <div className="relative h-64 w-full">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col">
          <h3 className="font-bold text-dark text-lg mb-1">Komponen Pendapatan</h3>
          <p className="text-xs text-gray-400 mb-6">Ringkasan nilai yang disediakan backend.</p>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50"><span className="text-gray-500">Gross Sales</span><span className="font-bold text-dark">{formatReportsRupiah(summary?.gross_sales)}</span></div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50"><span className="text-gray-500">Discount</span><span className="font-bold text-dark">{formatReportsRupiah(summary?.discounts)}</span></div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50"><span className="text-gray-500">Tax</span><span className="font-bold text-dark">{formatReportsRupiah(summary?.taxes)}</span></div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50"><span className="text-gray-500">Service</span><span className="font-bold text-dark">{formatReportsRupiah(summary?.services)}</span></div>
          </div>
          <div className="mt-6 text-xs text-gray-400">{loading ? 'Memuat data laporan...' : 'Jika butuh grafik per kasir/periode detail, endpoint backend perlu ditambah.'}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-dark text-lg">Ringkasan Transaksi</h3>
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari ringkasan..."
              className="w-full sm:w-64 bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="p-6 pt-0">
          <Table
            columns={[
              { header: 'Kode', accessor: (trx) => <span className="font-mono text-xs font-bold text-primary">{trx.id}</span> },
              { header: 'Waktu', accessor: (trx) => trx.time },
              { header: 'PIC', accessor: (trx) => trx.cashier },
              { header: 'Metode', accessor: (trx) => trx.method },
              { header: 'Nilai', accessor: (trx) => <span className="font-bold text-dark">{typeof trx.total === 'number' ? formatReportsRupiah(trx.total) : trx.total}</span> },
            ]}
            data={filteredTransactions}
            isLoading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
