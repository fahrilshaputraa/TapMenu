import { useEffect, useMemo, useState } from 'react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'
import { Table } from '../../components/Table'
import {
  createCategory as createCategoryRequest,
  deleteCategory as deleteCategoryRequest,
  loadCategories,
  toggleCategoryStatus,
  updateCategory as updateCategoryRequest,
} from '../../services/categories'
import {
  buildCategoryPayload,
  CATEGORY_ICONS,
  createCategoryFormData,
  createDefaultCategoryFormData,
} from '../../utils/categories'

export function Category() {
  const [categories, setCategories] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(createDefaultCategoryFormData())

  useEffect(() => {
    let active = true

    async function fetchCategories() {
      try {
        const results = await loadCategories()
        if (active) setCategories(results)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchCategories()
    return () => {
      active = false
    }
  }, [])

  const filteredCategories = useMemo(() => categories, [categories])

  const handleToggleStatus = async (category) => {
    try {
      const updated = await toggleCategoryStatus(category)
      setCategories((current) => current.map((item) => (item.id === category.id ? updated : item)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const openAddModal = () => {
    setEditingCategory(null)
    setFormData(createDefaultCategoryFormData(categories.length))
    setIsModalOpen(true)
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setFormData(createCategoryFormData(category))
    setIsModalOpen(true)
  }

  const saveCategory = async () => {
    if (!formData.name) {
      setError('Nama kategori wajib diisi.')
      return
    }

    setSaving(true)
    setError('')
    const payload = buildCategoryPayload(formData)

    try {
      if (editingCategory) {
        const updated = await updateCategoryRequest(editingCategory.id, payload, formData.icon)
        setCategories((current) => current.map((item) => (item.id === editingCategory.id ? updated : item)))
      } else {
        const created = await createCategoryRequest(payload, formData.icon)
        setCategories((current) => [...current, created])
      }
      setIsModalOpen(false)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return

    try {
      await deleteCategoryRequest(id)
      setCategories((current) => current.filter((item) => item.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
            <div>
              <h2 className="text-xl font-bold text-dark">Manajemen Kategori</h2>
              <p className="text-xs text-gray-500">Kelola kategori menu yang dipakai halaman katalog</p>
            </div>
          </div>
          <button onClick={openAddModal} className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primaryLight transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i>
            <span className="hidden sm:inline">Tambah Kategori</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
          <div className="max-w-6xl mx-auto space-y-8 fade-in">
            {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            <Table
              columns={[
                {
                  header: 'Nama Kategori',
                  className: 'w-1/3',
                  accessor: (category) => (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-primary shadow-sm">
                        <i className={`fa-solid ${category.icon}`}></i>
                      </div>
                      <div>
                        <div className="font-bold text-dark text-sm">{category.name}</div>
                        <div className="text-xs text-gray-400">{category.description || 'Tanpa deskripsi'}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Tipe',
                  accessor: () => <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Menu</span>,
                },
                {
                  header: 'Jumlah Item',
                  accessor: (category) => <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">{category.menu_count || 0} Item</span>,
                },
                {
                  header: 'Status',
                  accessor: (category) => (
                    <div className="flex items-center gap-3">
                      <div className="relative inline-block w-9 align-middle select-none">
                        <input type="checkbox" checked={category.is_active} onChange={() => handleToggleStatus(category)} className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary" />
                        <label onClick={() => handleToggleStatus(category)} className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${category.is_active ? 'bg-primary' : 'bg-gray-300'}`}></label>
                      </div>
                      {category.is_active ? <span className="text-green-600 font-bold text-xs">Aktif</span> : <span className="text-gray-400 font-bold text-xs">Nonaktif</span>}
                    </div>
                  ),
                },
                {
                  header: 'Aksi',
                  className: 'text-right',
                  cellClassName: 'text-right',
                  accessor: (category) => (
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editCategory(category)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm">
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => deleteCategory(category.id)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm">
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredCategories.map((category) => ({ ...category, _rowClass: !category.is_active ? 'opacity-50 bg-gray-50' : '' }))}
              isLoading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
                    <i className="fa-solid fa-tags text-2xl"></i>
                  </div>
                  <h3 className="text-dark font-bold text-sm">Belum ada kategori</h3>
                  <p className="text-gray-500 text-xs mt-1">Tambahkan kategori baru.</p>
                </div>
              }
            />
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'} size="md">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Kategori</label>
              <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400" placeholder="Contoh: Makanan Berat" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Deskripsi</label>
              <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400" rows="3" placeholder="Deskripsi singkat kategori"></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Urutan Tampil</label>
              <input type="number" value={formData.sort_order} onChange={(event) => setFormData({ ...formData, sort_order: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark" min="0" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Ikon</label>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto custom-scroll p-1">
                {CATEGORY_ICONS.map((icon) => (
                  <div key={icon} onClick={() => setFormData({ ...formData, icon })} className={`w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 ${formData.icon === icon ? 'bg-secondary border-primary text-primary' : ''}`}>
                    <i className={`fa-solid ${icon}`}></i>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-dark">Status Aktif</p>
                <p className="text-[10px] text-gray-400">Tampilkan di aplikasi</p>
              </div>
              <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })} />
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
              <button onClick={saveCategory} disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors disabled:opacity-70">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}
