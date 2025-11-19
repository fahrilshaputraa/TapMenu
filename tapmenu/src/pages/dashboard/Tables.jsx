import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, QrCode, Download, Edit2, Trash2, Users } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const initialTables = [
  { id: 1, name: 'Meja 1', capacity: 4, status: 'occupied', currentOrder: '#004' },
  { id: 2, name: 'Meja 2', capacity: 4, status: 'occupied', currentOrder: '#006' },
  { id: 3, name: 'Meja 3', capacity: 2, status: 'occupied', currentOrder: '#002' },
  { id: 4, name: 'Meja 4', capacity: 6, status: 'occupied', currentOrder: '#007' },
  { id: 5, name: 'Meja 5', capacity: 4, status: 'available', currentOrder: null },
  { id: 6, name: 'Meja 6', capacity: 2, status: 'available', currentOrder: null },
  { id: 7, name: 'Meja 7', capacity: 4, status: 'occupied', currentOrder: '#005' },
  { id: 8, name: 'Meja 8', capacity: 6, status: 'occupied', currentOrder: '#003' },
  { id: 9, name: 'Meja 9', capacity: 4, status: 'available', currentOrder: null },
  { id: 10, name: 'Meja 10', capacity: 2, status: 'available', currentOrder: null },
  { id: 11, name: 'Meja 11', capacity: 8, status: 'reserved', currentOrder: null },
  { id: 12, name: 'Meja 12', capacity: 4, status: 'available', currentOrder: null },
]

const statusConfig = {
  available: { label: 'Tersedia', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', borderColor: 'border-emerald-500' },
  occupied: { label: 'Terisi', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', borderColor: 'border-amber-500' },
  reserved: { label: 'Dipesan', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', borderColor: 'border-blue-500' },
}

export function Tables() {
  const [tables, setTables] = useState(initialTables)
  const [filter, setFilter] = useState('all')

  const handleDelete = (id) => {
    const table = tables.find(t => t.id === id)
    if (table.status === 'occupied') {
      alert('Tidak dapat menghapus meja yang sedang terisi')
      return
    }
    if (confirm('Apakah Anda yakin ingin menghapus meja ini?')) {
      setTables(tables.filter(t => t.id !== id))
    }
  }

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true
    return table.status === filter
  })

  const availableCount = tables.filter(t => t.status === 'available').length
  const occupiedCount = tables.filter(t => t.status === 'occupied').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Meja & QR Code</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kelola meja dan cetak QR code untuk pemesanan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Semua QR
            </button>
            <Link
              to="/dashboard/tables/add"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Meja
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Meja</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{tables.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Tersedia</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{availableCount}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Terisi</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{occupiedCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === 'available'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
            }`}
          >
            Tersedia
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === 'occupied'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
            }`}
          >
            Terisi
          </button>
          <button
            onClick={() => setFilter('reserved')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === 'reserved'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
            }`}
          >
            Dipesan
          </button>
        </div>

        {/* Tables grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl border-2 ${statusConfig[table.status].borderColor} p-4 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{table.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span>{table.capacity} orang</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[table.status].color}`}>
                  {statusConfig[table.status].label}
                </span>
              </div>

              {table.currentOrder && (
                <div className="mb-4 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Pesanan aktif</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{table.currentOrder}</p>
                </div>
              )}

              {/* QR Code placeholder */}
              <div className="flex items-center justify-center w-full aspect-square mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <QrCode className="w-16 h-16 text-zinc-400" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/dashboard/tables/edit/${table.id}`}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
