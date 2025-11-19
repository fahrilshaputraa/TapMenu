import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, QrCode, Download } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function TableForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    capacity: '4',
    location: '',
    notes: '',
    minOrder: '',
    reservationFee: '',
    isActive: true,
  })

  useEffect(() => {
    if (isEdit) {
      // Simulate fetching table data
      // In real app, fetch from API
      setFormData({
        name: 'Meja 1',
        capacity: '4',
        location: 'Lantai 1 - Area Indoor',
        notes: 'Dekat jendela, pemandangan taman',
        minOrder: '50000',
        reservationFee: '10000',
        isActive: true,
      })
    } else {
      // Auto-generate table name for new table
      setFormData(prev => ({
        ...prev,
        name: 'Meja Baru',
      }))
    }
  }, [isEdit, id])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle save logic here
    console.log('Save table:', formData)
    navigate('/dashboard/tables')
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/tables"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {isEdit ? 'Edit Meja' : 'Tambah Meja'}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isEdit ? 'Ubah informasi meja' : 'Tambah meja baru'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Informasi Meja
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Nama Meja <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Meja 1"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Kapasitas <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    min="1"
                    max="50"
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="4"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">orang</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Lantai 1 - Area Indoor"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Catatan tambahan untuk meja ini"
                />
              </div>

              {/* Active status */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Meja aktif</span>
              </label>
            </div>
          </div>

          {/* Pricing Rules */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Aturan Pemesanan
            </h2>

            <div className="space-y-4">
              {/* Min Order */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Minimum Order
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">Rp</span>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    min="0"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0 (tidak ada minimum)"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Kosongkan jika tidak ada minimum order</p>
              </div>

              {/* Reservation Fee */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Biaya Reservasi
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">Rp</span>
                  <input
                    type="number"
                    value={formData.reservationFee}
                    onChange={(e) => setFormData({ ...formData, reservationFee: e.target.value })}
                    min="0"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0 (gratis)"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Biaya yang dikenakan untuk reservasi meja</p>
              </div>
            </div>
          </div>

          {/* QR Code Preview (only for edit) */}
          {isEdit && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                QR Code
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* QR Preview */}
                <div className="flex items-center justify-center w-40 h-40 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <QrCode className="w-20 h-20 text-zinc-400" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    QR Code ini dapat digunakan pelanggan untuk melihat menu dan melakukan pemesanan langsung dari meja.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/tables"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Meja'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
