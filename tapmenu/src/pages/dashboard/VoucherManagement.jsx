import { useEffect, useMemo, useState } from 'react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'
import { api } from '../../services/api'

function toDateInput(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

function toApiDate(value, endOfDay = false) {
  if (!value) return null
  return `${value}T${endOfDay ? '23:59:59' : '00:00:00'}`
}

export function VoucherManagement() {
  const [vouchers, setVouchers] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount_type: 'percentage',
    amount: '',
    minimum_spend: '',
    max_discount: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  })

  useEffect(() => {
    let active = true

    async function loadVouchers() {
      try {
        const payload = await api.get('/api/v1/settings/vouchers/')
        const results = Array.isArray(payload?.results) ? payload.results : payload
        if (active) setVouchers(results || [])
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadVouchers()
    return () => {
      active = false
    }
  }, [])

  const filteredVouchers = useMemo(() => {
    const keyword = searchInput.toLowerCase()
    return vouchers.filter((voucher) => {
      const matchCode = String(voucher.code || '').toLowerCase().includes(keyword)
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && voucher.is_active) ||
        (statusFilter === 'expired' && !voucher.is_active)
      return matchCode && matchStatus
    })
  }, [searchInput, statusFilter, vouchers])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(num || 0))
  }

  const toggleStatus = async (voucher) => {
    try {
      const updated = await api.patch(`/api/v1/settings/vouchers/${voucher.id}/`, { is_active: !voucher.is_active })
      setVouchers((current) => current.map((item) => (item.id === voucher.id ? updated : item)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const openAddModal = () => {
    setEditingVoucher(null)
    setFormData({
      code: '',
      name: '',
      discount_type: 'percentage',
      amount: '',
      minimum_spend: '',
      max_discount: '',
      valid_from: '',
      valid_until: '',
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const editVoucher = (voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      code: voucher.code || '',
      name: voucher.name || '',
      discount_type: voucher.discount_type || 'percentage',
      amount: voucher.amount || '',
      minimum_spend: voucher.minimum_spend || '',
      max_discount: voucher.max_discount || '',
      valid_from: toDateInput(voucher.valid_from),
      valid_until: toDateInput(voucher.valid_until),
      is_active: voucher.is_active,
    })
    setIsModalOpen(true)
  }

  const saveVoucher = async () => {
    if (!formData.code || !formData.name || !formData.amount) {
      setError('Kode, nama voucher, dan nilai diskon wajib diisi.')
      return
    }

    setSaving(true)
    setError('')
    const payload = {
      code: formData.code.toUpperCase(),
      name: formData.name,
      discount_type: formData.discount_type,
      amount: Number(formData.amount),
      minimum_spend: Number(formData.minimum_spend || 0),
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      valid_from: toApiDate(formData.valid_from),
      valid_until: toApiDate(formData.valid_until, true),
      is_active: formData.is_active,
    }

    try {
      if (editingVoucher) {
        const updated = await api.put(`/api/v1/settings/vouchers/${editingVoucher.id}/`, payload)
        setVouchers((current) => current.map((voucher) => (voucher.id === editingVoucher.id ? updated : voucher)))
      } else {
        const created = await api.post('/api/v1/settings/vouchers/', payload)
        setVouchers((current) => [created, ...current])
      }
      setIsModalOpen(false)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteVoucher = async (id) => {
    if (!window.confirm('Hapus voucher ini secara permanen?')) return

    try {
      await api.delete(`/api/v1/settings/vouchers/${id}/`)
      setVouchers((current) => current.filter((voucher) => voucher.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
            <div>
              <h2 className="text-2xl font-bold text-dark tracking-tight">Voucher & Promo</h2>
              <p className="text-xs text-gray-500 font-medium">Buat kode diskon untuk menarik pelanggan</p>
            </div>
          </div>
          <button onClick={openAddModal} className="group relative px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-all flex items-center gap-2 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              <i className="fa-solid fa-plus"></i> Buat Voucher
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-8 fade-in">
            {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="flex items-center gap-8 w-full md:w-auto pl-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Voucher</p>
                  <p className="text-3xl font-extrabold text-dark leading-none">{vouchers.length}</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Aktif</p>
                  <p className="text-3xl font-extrabold text-green-600 leading-none">{vouchers.filter((voucher) => voucher.is_active).length}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto flex-1 justify-end">
                <div className="relative">
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-50">
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="expired">Berakhir</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>

                <div className="relative w-full md:w-64">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input type="text" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Cari kode voucher..." className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[250px]">Kode Voucher</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nilai Diskon</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Min. Belanja</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Promo</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Masa Berlaku</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-10 text-sm text-gray-500">Memuat voucher...</td>
                      </tr>
                    ) : filteredVouchers.length === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                              <i className="fa-solid fa-ticket-simple text-2xl"></i>
                            </div>
                            <h3 className="text-dark font-bold text-sm">Belum ada voucher</h3>
                            <p className="text-gray-400 text-xs mt-1">Buat kode promo pertama Anda untuk menarik pelanggan.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredVouchers.map((voucher) => {
                        const opacity = voucher.is_active ? '' : 'opacity-50 grayscale bg-gray-50/50'
                        return (
                          <tr key={voucher.id} className={`hover:bg-gray-50 transition-colors group ${opacity}`}>
                            <td className="px-6 py-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                                  <i className="fa-solid fa-ticket"></i>
                                </div>
                                <div>
                                  <div className="font-bold text-dark text-sm tracking-wide">{voucher.code}</div>
                                  <div className="text-[10px] text-gray-400 font-mono uppercase">{voucher.discount_type}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              {voucher.discount_type === 'percentage' ? (
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-100">{voucher.amount}% OFF</span>
                              ) : (
                                <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold border border-orange-100">{formatRupiah(voucher.amount)} OFF</span>
                              )}
                            </td>
                            <td className="px-6 py-4 align-middle"><span className="text-sm font-medium text-gray-600">{formatRupiah(voucher.minimum_spend)}</span></td>
                            <td className="px-6 py-4 align-middle"><span className="text-sm font-medium text-gray-600">{voucher.name}</span></td>
                            <td className="px-6 py-4 align-middle">
                              <div className="text-xs text-gray-500 font-medium flex flex-col">
                                <span>{toDateInput(voucher.valid_from) || '-'}</span>
                                <span className="text-[9px] text-gray-400">s/d {toDateInput(voucher.valid_until) || '-'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-middle text-center">
                              <div className="flex flex-col items-center gap-1">
                                <div className="relative inline-block w-8 align-middle select-none">
                                  <input type="checkbox" checked={voucher.is_active} onChange={() => toggleStatus(voucher)} className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary" />
                                  <label onClick={() => toggleStatus(voucher)} className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${voucher.is_active ? 'bg-primary' : 'bg-gray-300'}`}></label>
                                </div>
                                {voucher.is_active ? <span className="text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-md border border-green-100">Aktif</span> : <span className="text-gray-500 font-bold text-[10px] bg-gray-100 px-2 py-1 rounded-md border border-gray-200">Nonaktif</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-middle text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => editVoucher(voucher)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm">
                                  <i className="fa-solid fa-pen text-xs"></i>
                                </button>
                                <button onClick={() => deleteVoucher(voucher.id)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm">
                                  <i className="fa-solid fa-trash text-xs"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVoucher ? 'Edit Voucher' : 'Tambah Voucher'} size="md">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Kode Voucher</label>
              <input type="text" value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" placeholder="PROMO10" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Promo</label>
              <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" placeholder="Promo Akhir Pekan" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tipe Diskon</label>
                <select value={formData.discount_type} onChange={(event) => setFormData({ ...formData, discount_type: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark">
                  <option value="percentage">Persentase</option>
                  <option value="fixed">Nominal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nilai Diskon</label>
                <input type="number" value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Minimal Belanja</label>
                <input type="number" value={formData.minimum_spend} onChange={(event) => setFormData({ ...formData, minimum_spend: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Maksimum Diskon</label>
                <input type="number" value={formData.max_discount} onChange={(event) => setFormData({ ...formData, max_discount: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mulai Berlaku</label>
                <input type="date" value={formData.valid_from} onChange={(event) => setFormData({ ...formData, valid_from: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Akhir Berlaku</label>
                <input type="date" value={formData.valid_until} onChange={(event) => setFormData({ ...formData, valid_until: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" />
              </div>
            </div>

            <label className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-dark">Status Aktif</p>
                <p className="text-[10px] text-gray-400">Voucher bisa langsung dipakai pelanggan</p>
              </div>
              <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })} />
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={saveVoucher} disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors disabled:opacity-70">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
