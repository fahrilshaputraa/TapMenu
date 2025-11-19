import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, QrCode, Download, Edit2, Trash2, Printer, X, Fan, CloudSun, Armchair } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const initialTables = [
  { id: 1, name: 'Meja 1', area: 'Indoor' },
  { id: 2, name: 'Meja 2', area: 'Indoor' },
  { id: 3, name: 'Meja 3', area: 'Indoor' },
  { id: 4, name: 'Meja 4 (Jendela)', area: 'Indoor' },
  { id: 5, name: 'Meja 5', area: 'Outdoor' },
  { id: 6, name: 'Meja 6', area: 'Outdoor' },
]

export function Tables() {
  const [tables, setTables] = useState(initialTables)
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [newTableName, setNewTableName] = useState('')
  const [newTableArea, setNewTableArea] = useState('Indoor')

  const handleDelete = (id) => {
    if (confirm('Hapus meja ini?')) {
      setTables(tables.filter(t => t.id !== id))
    }
  }

  const handleSaveTable = () => {
    if (!newTableName) {
      alert('Nama meja tidak boleh kosong')
      return
    }
    const newId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1
    setTables([...tables, { id: newId, name: newTableName, area: newTableArea }])
    setNewTableName('')
    setNewTableArea('Indoor')
    setShowAddModal(false)
  }

  const openQrModal = (table) => {
    setSelectedTable(table)
    setShowQrModal(true)
  }

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true
    return table.area === filter
  })

  const indoorCount = tables.filter(t => t.area === 'Indoor').length
  const outdoorCount = tables.filter(t => t.area === 'Outdoor').length

  const getQrUrl = (tableId) => {
    const qrData = encodeURIComponent(`https://tapmenu.app/menu?table=${tableId}`)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&color=1B4332&bgcolor=ffffff&margin=10`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">Manajemen Meja</h1>
            <p className="text-sm text-gray-500">
              Kelola area makan dan cetak QR Code
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex px-4 py-2.5 bg-white border border-primary text-primary text-sm font-bold rounded-lg hover:bg-gray-50 transition-all items-center gap-2">
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Cetak Semua QR</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Meja</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase">Total Meja</p>
            <p className="text-2xl font-extrabold text-dark mt-1">{tables.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase">Area Indoor</p>
            <p className="text-2xl font-extrabold text-primary mt-1">{indoorCount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-card border border-gray-100">
            <p className="text-gray-400 text-xs font-bold uppercase">Area Outdoor</p>
            <p className="text-2xl font-extrabold text-accent mt-1">{outdoorCount}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all shadow-sm ${
              filter === 'all'
                ? 'bg-white ring-2 ring-primary text-primary'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            Semua Area
          </button>
          <button
            onClick={() => setFilter('Indoor')}
            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all shadow-sm ${
              filter === 'Indoor'
                ? 'bg-white ring-2 ring-primary text-primary'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            Indoor (AC)
          </button>
          <button
            onClick={() => setFilter('Outdoor')}
            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all shadow-sm ${
              filter === 'Outdoor'
                ? 'bg-white ring-2 ring-primary text-primary'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            Outdoor (Smoking)
          </button>
        </div>

        {/* Tables grid */}
        {filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Armchair className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-dark">Belum ada meja</h3>
            <p className="text-gray-500 text-sm mb-6">Tambahkan meja untuk mulai mencetak QR Code.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Tambah Meja Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => {
              const isIndoor = table.area === 'Indoor'
              return (
                <div
                  key={table.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-10 -mt-10 transition-colors group-hover:bg-secondary/30" />

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 text-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                        <Armchair className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                        <Link
                          to={`/dashboard/tables/edit/${table.id}`}
                          className="w-8 h-8 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-primary transition-colors flex items-center justify-center"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(table.id)}
                          className="w-8 h-8 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-dark mb-1">{table.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-6 ${
                      isIndoor
                        ? 'bg-secondary text-primary'
                        : 'bg-[#FFF0EB] text-accent'
                    }`}>
                      {isIndoor ? <Fan className="w-3 h-3" /> : <CloudSun className="w-3 h-3" />}
                      {table.area}
                    </span>

                    <button
                      onClick={() => openQrModal(table)}
                      className="w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      <QrCode className="w-4 h-4" />
                      Lihat QR Code
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-dark">Tambah Meja Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Nama / Nomor Meja
                </label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Cth: Meja 1, Meja VIP"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Area
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="area"
                      value="Indoor"
                      checked={newTableArea === 'Indoor'}
                      onChange={(e) => setNewTableArea(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="p-3 rounded-xl border border-gray-200 text-center peer-checked:border-primary peer-checked:bg-secondary peer-checked:text-primary transition-all hover:bg-gray-50">
                      <Fan className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-bold">Indoor (AC)</div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="area"
                      value="Outdoor"
                      checked={newTableArea === 'Outdoor'}
                      onChange={(e) => setNewTableArea(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="p-3 rounded-xl border border-gray-200 text-center peer-checked:border-accent peer-checked:bg-[#FFF0EB] peer-checked:text-accent transition-all hover:bg-gray-50">
                      <CloudSun className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-bold">Outdoor</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveTable}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Preview Modal */}
      {showQrModal && selectedTable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative slide-up">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Printable Area */}
            <div className="p-8 flex flex-col items-center text-center bg-white">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl shadow-md mx-auto">
                  <i className="fa-solid fa-utensils" />
                </div>
                <h3 className="text-lg font-bold text-primary mt-2">Warung Bu Dewi</h3>
              </div>

              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-300 mb-4">
                <img
                  src={getQrUrl(selectedTable.id)}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <h2 className="text-2xl font-extrabold text-dark mb-1">{selectedTable.name}</h2>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                selectedTable.area === 'Indoor'
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-[#FFF0EB] text-accent'
              }`}>
                {selectedTable.area}
              </span>

              <p className="text-sm text-gray-400 mt-6 max-w-[200px]">
                Scan QR ini dengan kamera HP untuk melihat menu dan memesan.
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button
                onClick={() => window.print()}
                className="py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak
              </button>
              <button className="py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
