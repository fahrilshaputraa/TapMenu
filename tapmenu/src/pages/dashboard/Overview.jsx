import { useEffect, useMemo, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

import { DashboardLayout } from '../../components/DashboardLayout'
import { Table } from '../../components/Table'
import { getStoredAuth } from '../../services/auth'
import { loadOverview } from '../../services/overview'
import {
  buildOverviewLatestOrderRows,
  formatOverviewCurrency,
  getOverviewChartData,
} from '../../utils/overview'

export function DashboardOverview() {
  const role = Number(getStoredAuth()?.user?.role)
  const isCashier = role === 3
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchOverview() {
      try {
        const payload = await loadOverview()
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

    fetchOverview()
    return () => {
      active = false
    }
  }, [])

  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const chartData = useMemo(() => getOverviewChartData(summary), [summary])

  useEffect(() => {
    if (!chartRef.current || !summary) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Jumlah Pesanan',
          data: chartData.values,
          backgroundColor: ['#1B4332', '#d06a50'],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartData, summary])

  const latestOrders = useMemo(() => buildOverviewLatestOrderRows(summary), [summary])

  return (
    <DashboardLayout>
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Omzet Hari Ini</p>
              <h3 className="text-2xl font-bold text-dark">{loading ? 'Memuat...' : formatOverviewCurrency(summary?.revenue)}</h3>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-primary">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <i className="fa-solid fa-circle-check"></i> {summary?.paid_orders || 0}
            </span>
            <span className="text-gray-400">pesanan sudah dibayar</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-accent relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pesanan Masuk</p>
              <h3 className="text-2xl font-bold text-dark">{loading ? 'Memuat...' : `${summary?.today_orders || 0} Pesanan`}</h3>
            </div>
            <div className="w-10 h-10 bg-[#FFF0EB] rounded-lg flex items-center justify-center text-accent">
              <i className="fa-solid fa-receipt"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-accent font-bold">{summary?.pending_orders || 0} Pesanan</span>
            <span className="text-gray-400">Belum diproses</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Aset Restoran</p>
              <h3 className="text-2xl font-bold text-dark">{loading ? 'Memuat...' : `${summary?.menu_count || 0} Menu`}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-bowl-food"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">
              <span className="font-bold text-dark">{summary?.table_count || 0} meja</span> dan {summary?.employee_count || 0} staf aktif
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-dark">Pesanan Terbaru</h3>
            <Link to="/dashboard/orders" className="text-sm text-primary font-bold hover:underline">Lihat Semua</Link>
          </div>

          <Table
            columns={[
              {
                header: 'ID Pesanan',
                accessor: (item) => <span className="font-medium text-primary">{item.id}</span>,
              },
              {
                header: 'Menu',
                accessor: (item) => (
                  <div className="flex flex-col">
                    <span className="font-bold text-dark">{item.table}</span>
                    <span className="text-xs text-gray-500">{item.items}</span>
                  </div>
                ),
              },
              {
                header: 'Total',
                accessor: (item) => <span className="font-bold text-dark">{item.total}</span>,
              },
              {
                header: 'Status',
                accessor: (item) => {
                  if (item.status === 'Baru') {
                    return <span className="bg-[#FFF0EB] text-accent px-2.5 py-1 rounded-full text-xs font-bold">Baru</span>
                  }
                  if (item.status === 'Dimasak') {
                    return <span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-xs font-bold">Dimasak</span>
                  }
                  return <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold">Selesai</span>
                },
              },
            ]}
            data={latestOrders}
            keyExtractor={(item) => item.id}
            isLoading={loading}
          />

          <div className="p-4 border-t border-gray-100 text-center bg-white rounded-b-2xl shadow-card -mt-4 relative z-10">
            <Link to="/dashboard/orders" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">
              Lihat semua pesanan hari ini <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
            <h3 className="font-bold text-lg mb-4 relative z-10">{isCashier ? 'Navigasi Kasir' : 'Aksi Cepat'}</h3>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {isCashier ? (
                <>
                  <Link to="/dashboard/cashier" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-wallet text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Login Kasir</span>
                  </Link>
                  <Link to="/dashboard/orders" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-file-invoice text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Pesanan</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard/menu" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-plus-circle text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Tambah Menu</span>
                  </Link>
                  <Link to="/dashboard/tables" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-print text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Kelola QR</span>
                  </Link>
                  <Link to="/dashboard/orders" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-file-invoice text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Pesanan</span>
                  </Link>
                  <Link to="/dashboard/settings/store" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                    <i className="fa-solid fa-store text-xl text-secondary"></i>
                    <span className="text-xs font-semibold">Profil Toko</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-dark">Ringkasan Cepat</h3>
              <i className="fa-solid fa-circle-info text-primary"></i>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-500"><span>Nama Restoran</span><span className="font-bold text-dark">{summary?.restaurant_name || '-'}</span></div>
              <div className="flex justify-between text-gray-500"><span>Status Toko</span><span className={`font-bold ${summary?.is_open ? 'text-green-600' : 'text-red-500'}`}>{summary?.is_open ? 'Buka' : 'Tutup'}</span></div>
              <div className="flex justify-between text-gray-500"><span>Voucher Aktif</span><span className="font-bold text-dark">{summary?.voucher_count || 0}</span></div>
              <div className="flex justify-between text-gray-500"><span>Staf Terdaftar</span><span className="font-bold text-dark">{summary?.employee_count || 0}</span></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="font-bold text-dark mb-4">Statistik Hari Ini</h3>
            <div className="h-48 w-full">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
