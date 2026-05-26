import { useEffect, useMemo, useState } from 'react'
import { Download, Fan, Plus, Printer, QrCode, Trash2, X, CloudSun, Armchair } from 'lucide-react'
import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../components/DashboardLayout'
import {
  createTable as createTableRequest,
  deleteTable as deleteTableRequest,
  loadTables,
} from '../../services/tables'
import {
  buildTableOrderUrl,
  buildTablePayload,
  buildTableQrUrl,
  createDefaultTableFormData,
  filterTablesByArea,
  getTableAreaStats,
} from '../../utils/tables'

export function Tables() {
  const [tables, setTables] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(createDefaultTableFormData())

  useEffect(() => {
    let active = true

    async function fetchTables() {
      try {
        const results = await loadTables()
        if (active) setTables(results || [])
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchTables()
    return () => {
      active = false
    }
  }, [])

  const filteredTables = useMemo(() => filterTablesByArea(tables, filter), [filter, tables])

  const { indoorCount, outdoorCount } = useMemo(() => getTableAreaStats(tables), [tables])

  const handleSaveTable = async () => {
    if (!formData.name || !formData.code) {
      setError('Nama meja dan kode meja wajib diisi.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const created = await createTableRequest(buildTablePayload(formData))
      setTables((current) => [...current, created])
      setFormData(createDefaultTableFormData())
      setShowAddModal(false)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus meja ini?')) return

    try {
      await deleteTableRequest(id)
      setTables((current) => current.filter((table) => table.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const openQrModal = (table) => {
    setSelectedTable(table)
    setShowQrModal(true)
  }

  return (
    <DashboardLayout>
      <div className="hidden print:flex print:flex-wrap print:gap-8 print:absolute print:inset-0 print:w-full print:h-max print:bg-white print:z-[9999] print:p-8 justify-center items-start">
        {tables.map(table => (
          <div key={table.id} className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl break-inside-avoid print:w-[45%] flex flex-col items-center">
            <h2 className="text-2xl font-extrabold text-dark mb-4">{table.name}</h2>
            <img src={buildTableQrUrl(window.location.origin, table.public_token)} className="w-48 h-48 mx-auto" alt={`QR ${table.name}`} />
            <p className="mt-4 text-[10px] font-mono text-gray-500">{buildTableOrderUrl(window.location.origin, table.public_token)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">Manajemen Meja</h1>
            <p className="text-sm text-gray-500">Kelola area makan dan cetak QR Code</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="hidden sm:flex px-4 py-2.5 bg-white border border-primary text-primary text-sm font-bold rounded-lg hover:bg-gray-50 transition-all items-center gap-2">
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Cetak Semua QR</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Meja</span>
            </button>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

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

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'Indoor', 'Outdoor'].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all shadow-sm ${
                filter === value
                  ? 'bg-white ring-2 ring-primary text-primary'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {value === 'all' ? 'Semua Area' : value === 'Indoor' ? 'Indoor (AC)' : 'Outdoor'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-sm text-gray-500">Memuat meja...</div>
        ) : filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Armchair className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-dark">Belum ada meja</h3>
            <p className="text-gray-500 text-sm mb-6">Tambahkan meja untuk mulai mencetak QR Code.</p>
            <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">Tambah Meja Pertama</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => {
              const isIndoor = table.area === 'Indoor'
              return (
                <div key={table.id} className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-10 -mt-10 transition-colors group-hover:bg-secondary/30" />

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 text-xl group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                        <Armchair className="w-6 h-6" />
                      </div>
                      <div className="flex gap-1">
                        <Link to={`/dashboard/tables/edit/${table.id}`} className="w-8 h-8 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-primary transition-colors flex items-center justify-center">
                          <i className="fa-solid fa-pen text-sm"></i>
                        </Link>
                        <button onClick={() => handleDelete(table.id)} className="w-8 h-8 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-dark mb-1">{table.name}</h3>
                    <div className="mb-4 text-xs text-gray-400 font-mono">{table.code}</div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-6 ${isIndoor ? 'bg-secondary text-primary' : 'bg-[#FFF0EB] text-accent'}`}>
                      {isIndoor ? <Fan className="w-3 h-3" /> : <CloudSun className="w-3 h-3" />}
                      {table.area}
                    </span>

                    <button onClick={() => openQrModal(table)} className="w-full py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md">
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

      {showAddModal ? (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-dark">Tambah Meja Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama / Nomor Meja</label>
                <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Cth: Meja 1, Meja VIP" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Kode Meja</label>
                <input type="text" value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Cth: T01" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Kapasitas Kursi</label>
                <input type="number" value={formData.seats} onChange={(event) => setFormData({ ...formData, seats: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" min="1" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Area</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input type="radio" name="area" value="Indoor" checked={formData.area === 'Indoor'} onChange={(event) => setFormData({ ...formData, area: event.target.value })} className="peer sr-only" />
                    <div className="p-3 rounded-xl border border-gray-200 text-center peer-checked:border-primary peer-checked:bg-secondary peer-checked:text-primary transition-all hover:bg-gray-50">
                      <Fan className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-bold">Indoor (AC)</div>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="area" value="Outdoor" checked={formData.area === 'Outdoor'} onChange={(event) => setFormData({ ...formData, area: event.target.value })} className="peer sr-only" />
                    <div className="p-3 rounded-xl border border-gray-200 text-center peer-checked:border-accent peer-checked:bg-[#FFF0EB] peer-checked:text-accent transition-all hover:bg-gray-50">
                      <CloudSun className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-sm font-bold">Outdoor</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={handleSaveTable} disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-70">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      ) : null}

      {showQrModal && selectedTable ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative slide-up">
            <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 z-10">
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 flex flex-col items-center text-center bg-white">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl shadow-md mx-auto">
                  <i className="fa-solid fa-utensils" />
                </div>
                <h3 className="text-lg font-bold text-primary mt-2">Warung Bu Dewi</h3>
              </div>

              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-300 mb-4">
                <img src={buildTableQrUrl(window.location.origin, selectedTable.public_token)} alt="QR Code" className="w-48 h-48 object-contain" />
              </div>

              <h2 className="text-2xl font-extrabold text-dark mb-1">{selectedTable.name}</h2>
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${selectedTable.area === 'Indoor' ? 'bg-gray-100 text-gray-500' : 'bg-[#FFF0EB] text-accent'}`}>{selectedTable.area}</span>

              <p className="text-sm text-gray-400 mt-6 max-w-[200px]">Scan QR ini dengan kamera HP untuk melihat menu dan memesan.</p>
              <a href={buildTableOrderUrl(window.location.origin, selectedTable.public_token)} className="mt-3 text-xs text-primary underline">{buildTableOrderUrl(window.location.origin, selectedTable.public_token)}</a>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button onClick={() => window.print()} className="py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/90 flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                Cetak
              </button>
              <a href={buildTableQrUrl(window.location.origin, selectedTable.public_token)} target="_blank" rel="noreferrer" className="py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Simpan
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
