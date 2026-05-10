import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Image, Upload, Heart, Star, Info, X } from 'lucide-react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'
import { api } from '../../services/api'

const DEFAULT_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  discount: '',
  tax: '10',
  stock: '',
  image: '',
  isActive: true,
  isFavorite: false,
  isNew: false,
  trackStock: false,
  variants: [],
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function mapMenuItem(item) {
  return {
    id: item.id,
    name: item.name,
    category: String(item.category),
    categoryName: item.category_name,
    price: Number(item.price || 0),
    effectivePrice: Number(item.effective_price || item.price || 0),
    stock: item.in_stock,
    stockAmount: item.stock_quantity || 0,
    image: item.image_url || '',
    description: item.description || '',
    discount: item.discount_percentage || 0,
    tax: item.tax_percentage || 10,
    isActive: item.is_available,
    isFavorite: item.is_featured,
    isNew: item.is_new || false,
    variants: item.variants || [],
    trackStock: item.track_stock || false,
    preparationTime: item.preparation_time_minutes || 10,
  }
}

export function MenuManagement() {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState(DEFAULT_FORM)

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const [categoryPayload, itemPayload] = await Promise.all([
          api.get('/api/v1/catalogs/categories/'),
          api.get('/api/v1/catalogs/items/'),
        ])

        if (!active) return

        const loadedCategories = Array.isArray(categoryPayload?.results) ? categoryPayload.results : categoryPayload || []
        const loadedItems = Array.isArray(itemPayload?.results) ? itemPayload.results : itemPayload || []

        setCategories(loadedCategories)
        setMenuItems(loadedItems.map(mapMenuItem))
        setError('')
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  const categoryTabs = useMemo(
    () => [{ id: 'all', name: 'Semua' }, ...categories.map((category) => ({ id: String(category.id), name: category.name }))],
    [categories],
  )

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
      if (normalizedQuery && !item.name.toLowerCase().includes(normalizedQuery)) return false
      return true
    })
  }, [menuItems, searchQuery, selectedCategory])

  const resetForm = (overrides = {}) => {
    setFormData({
      ...DEFAULT_FORM,
      category: categories[0] ? String(categories[0].id) : '',
      ...overrides,
    })
  }

  const openAddModal = () => {
    if (!categories.length) {
      setError('Tambahkan kategori dulu sebelum membuat menu.')
      return
    }

    setEditingItem(null)
    resetForm()
    setActiveTab('basic')
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: String(item.category),
      description: item.description || '',
      price: String(item.price || ''),
      discount: String(item.discount || ''),
      tax: String(item.tax || '10'),
      stock: item.stockAmount ? String(item.stockAmount) : '',
      image: item.image || '',
      isActive: item.isActive !== false,
      isFavorite: item.isFavorite || false,
      isNew: item.isNew || false,
      trackStock: item.trackStock || false,
      variants: item.variants || [],
    })
    setActiveTab('basic')
    setShowModal(true)
  }

  const buildMenuPayload = () => ({
    category: Number(formData.category),
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: Number(formData.price || 0),
    discount_percentage: Number(formData.discount || 0),
    tax_percentage: Number(formData.tax || 10),
    image_url: formData.image || '',
    track_stock: formData.trackStock,
    stock_quantity: formData.trackStock ? Math.max(Number(formData.stock || 0), 0) : 0,
    preparation_time_minutes: 10,
    is_available: formData.isActive,
    is_featured: formData.isFavorite,
    is_new: formData.isNew,
    variants: formData.variants,
  })

  const handleSaveMenu = async () => {
    if (!formData.name.trim() || !formData.price || !formData.category) {
      setError('Nama menu, kategori, dan harga wajib diisi.')
      return
    }

    if (formData.trackStock && (formData.stock === '' || formData.stock === null || formData.stock === undefined)) {
      setError('Jumlah stok wajib diisi ketika pelacakan stok aktif.')
      return
    }

    for (const group of formData.variants) {
      if (!group.name.trim()) {
        setError('Nama grup varian wajib diisi.')
        return
      }
      for (const option of group.options) {
        if (!option.name.trim()) {
          setError('Nama opsi varian wajib diisi.')
          return
        }
      }
    }

    setSaving(true)
    setError('')

    try {
      const payload = buildMenuPayload()
      if (editingItem) {
        const updated = await api.put(`/api/v1/catalogs/items/${editingItem.id}/`, payload)
        setMenuItems((current) => current.map((item) => (item.id === editingItem.id ? mapMenuItem(updated) : item)))
      } else {
        const created = await api.post('/api/v1/catalogs/items/', payload)
        setMenuItems((current) => [...current, mapMenuItem(created)])
      }
      setShowModal(false)
      setEditingItem(null)
      resetForm()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) return

    try {
      await api.delete(`/api/v1/catalogs/items/${id}/`)
      setMenuItems((current) => current.filter((item) => item.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleItemStatus = async (item) => {
    try {
      const updated = await api.patch(`/api/v1/catalogs/items/${item.id}/`, { is_available: !item.isActive })
      setMenuItems((current) => current.map((entry) => (entry.id === item.id ? mapMenuItem(updated) : entry)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const addVariantGroup = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: '',
      type: 'radio',
      options: [{ id: `${Date.now()}-opt`, name: '', price: 0 }],
    }
    setFormData((current) => ({ ...current, variants: [...current.variants, newGroup] }))
  }

  const removeVariantGroup = (groupId) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.filter((group) => group.id !== groupId),
    }))
  }

  const updateVariantGroup = (groupId, field, value) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((group) => (group.id === groupId ? { ...group, [field]: value } : group)),
    }))
  }

  const addVariantOption = (groupId) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((group) =>
        group.id === groupId
          ? { ...group, options: [...group.options, { id: Date.now().toString(), name: '', price: 0 }] }
          : group,
      ),
    }))
  }

  const removeVariantOption = (groupId, optionId) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((group) =>
        group.id === groupId ? { ...group, options: group.options.filter((option) => option.id !== optionId) } : group,
      ),
    }))
  }

  const updateVariantOption = (groupId, optionId, field, value) => {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.map((option) =>
                option.id === optionId ? { ...option, [field]: value } : option,
              ),
            }
          : group,
      ),
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      window.alert('Ukuran file maksimal 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((current) => ({ ...current, image: reader.result || '' }))
    }
    reader.readAsDataURL(file)
  }

  const calculateFinalPrice = () => {
    const price = Number(formData.price) || 0
    const discount = Number(formData.discount) || 0
    return price - (price * discount) / 100
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-dark">Daftar Menu</h1>
            <p className="text-xs text-gray-500">Kelola produk, harga, dan ketersediaan stok</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Menu</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 fade-in">
          {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

          <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {categoryTabs.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-gray-500 hover:text-primary hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama menu..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center text-sm text-gray-500">Memuat daftar menu...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const hasDiscount = item.discount > 0
                const finalPrice = hasDiscount ? item.effectivePrice : item.price
                const categoryLabel = item.categoryName || categories.find((category) => String(category.id) === item.category)?.name || 'Tanpa Kategori'

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col h-full ${
                      !item.isActive ? 'opacity-75 grayscale-[0.5]' : ''
                    }`}
                  >
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg text-red-400 hover:text-red-600 flex items-center justify-center shadow-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <span className="bg-black/60 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold">{categoryLabel}</span>
                        {hasDiscount ? <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">-{item.discount}%</span> : null}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-dark text-lg leading-tight line-clamp-1">{item.name}</h3>
                      </div>

                      <div className="mb-2 flex flex-wrap gap-1 items-center">
                        {item.isFavorite ? (
                          <span className="bg-[#FFF0EB] text-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/20">Favorit</span>
                        ) : null}
                        {item.isNew ? (
                          <span className="bg-secondary text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">Baru</span>
                        ) : null}
                        {item.variants?.length ? (
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">{item.variants.length} Varian</span>
                        ) : null}
                      </div>

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{item.description || 'Belum ada deskripsi menu.'}</p>

                      <div className="mb-4">
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-400 text-xs line-through mr-1">{formatCurrency(item.price)}</span>
                            <span className="text-accent font-extrabold text-lg">{formatCurrency(finalPrice)}</span>
                          </>
                        ) : (
                          <span className="text-accent font-extrabold text-lg">{formatCurrency(item.price)}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isActive}
                              onChange={() => toggleItemStatus(item)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                          <span className={`text-xs font-bold ${item.isActive ? 'text-primary' : 'text-red-500'}`}>
                            {item.isActive ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>

                        <button
                          onClick={() => openEditModal(item)}
                          className="text-primary hover:bg-secondary/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                        >
                          Edit <Edit2 className="w-3 h-3 inline ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <i className="fa-solid fa-burger text-3xl"></i>
              </div>
              <h3 className="text-dark font-bold">Tidak ada menu ditemukan</h3>
              <p className="text-gray-500 text-sm">Coba kata kunci lain atau tambahkan menu baru.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Menu' : 'Tambah Menu Baru'} size="2xl">
        <div className="flex border-b border-gray-100 bg-gray-50 px-5 pt-2 gap-4 overflow-x-auto -mx-6 -mt-4 mb-6">
          <button onClick={() => setActiveTab('basic')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}>
            Info Dasar
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'pricing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}>
            Harga & Pajak
          </button>
          <button onClick={() => setActiveTab('variants')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'variants' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}>
            Varian
          </button>
          <button onClick={() => setActiveTab('others')} className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'others' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}>
            Stok & Lainnya
          </button>
        </div>

        {activeTab === 'basic' ? (
          <div className="space-y-5 fade-in">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Foto Menu</label>
                <div className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center group cursor-pointer overflow-hidden hover:border-primary transition-colors">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400 group-hover:text-primary">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-[10px] font-bold uppercase">Upload</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Min. 500x500px (JPG/PNG)</p>
              </div>

              <div className="w-full sm:w-2/3 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Menu <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium" placeholder="Contoh: Nasi Goreng Spesial" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Kategori <span className="text-red-500">*</span></label>
                  <select value={formData.category} onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium">
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Deskripsi</label>
                  <textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium resize-none" placeholder="Jelaskan bahan utama atau rasa..." />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'pricing' ? (
          <div className="space-y-5 fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Harga Dasar (Rp) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                  <input type="number" value={formData.price} onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg font-bold text-dark" placeholder="0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Diskon (%)</label>
                <div className="relative">
                  <input type="number" value={formData.discount} onChange={(event) => setFormData((current) => ({ ...current, discount: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium" placeholder="0" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Sementara hanya untuk preview UI, backend belum menyimpan diskon terpisah.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Pajak / PPN (%)</label>
                <div className="relative">
                  <input type="number" value={formData.tax} onChange={(event) => setFormData((current) => ({ ...current, tax: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium" placeholder="10" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Sementara hanya untuk preview UI, backend memakai harga final menu.</p>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 border border-secondary mt-4">
              <p className="text-xs font-bold text-primary mb-2 uppercase">Preview Harga Pelanggan</p>
              <div className="flex justify-between items-center">
                <div>
                  {Number(formData.discount) > 0 ? (
                    <>
                      <p className="text-sm text-gray-500">Harga Normal: <span className="line-through">{formatCurrency(formData.price || 0)}</span></p>
                      <p className="text-xs text-accent font-bold">Hemat {formData.discount}%</p>
                    </>
                  ) : null}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">{formatCurrency(calculateFinalPrice())}</p>
                  <p className="text-[10px] text-gray-500">*Belum termasuk PPN</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'variants' ? (
          <div className="space-y-6 fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-blue-800">Info Varian</h4>
                <p className="text-[10px] text-blue-600">Form varian tetap dipertahankan di UI, tapi backend saat ini belum menyimpan varian menu secara terpisah.</p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.variants.map((group) => (
                <div key={group.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nama Grup</label>
                        <input type="text" value={group.name} onChange={(event) => updateVariantGroup(group.id, 'name', event.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" placeholder="Cth: Level Pedas" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipe Pilihan</label>
                        <select value={group.type} onChange={(event) => updateVariantGroup(group.id, 'type', event.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                          <option value="radio">Pilih Satu (Wajib)</option>
                          <option value="checkbox">Pilih Banyak (Opsional)</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => removeVariantGroup(group.id)} className="ml-3 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.id} className="flex gap-2 items-center">
                        <input type="text" value={option.name} onChange={(event) => updateVariantOption(group.id, option.id, 'name', event.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary" placeholder="Nama Opsi (Cth: Sedang)" />
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">+Rp</span>
                          <input type="number" value={option.price} onChange={(event) => updateVariantOption(group.id, option.id, 'price', Number(event.target.value) || 0)} className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2 py-2 text-xs focus:outline-none focus:border-primary" placeholder="0" />
                        </div>
                        <button onClick={() => removeVariantOption(group.id, option.id)} className="text-gray-300 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => addVariantOption(group.id)} className="mt-3 text-xs font-bold text-primary hover:underline">+ Tambah Opsi</button>
                </div>
              ))}
            </div>

            <button onClick={addVariantGroup} className="w-full py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Grup Varian
            </button>
          </div>
        ) : null}

        {activeTab === 'others' ? (
          <div className="space-y-6 fade-in">
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-dark text-sm">Manajemen Stok</h4>
                  <p className="text-[10px] text-gray-500">Aktifkan untuk melacak jumlah stok.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.trackStock} onChange={(event) => setFormData((current) => ({ ...current, trackStock: event.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {formData.trackStock ? (
                <div className="transition-all">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Jumlah Stok Saat Ini</label>
                  <input type="number" value={formData.stock} onChange={(event) => setFormData((current) => ({ ...current, stock: event.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium" placeholder="Contoh: 50" />
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Label Menu (Opsional)</label>
              <div className="flex gap-3">
                <label className="cursor-pointer select-none">
                  <input type="checkbox" checked={formData.isFavorite} onChange={(event) => setFormData((current) => ({ ...current, isFavorite: event.target.checked }))} className="peer sr-only" />
                  <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold peer-checked:bg-[#FFF0EB] peer-checked:text-accent peer-checked:border-accent transition-all flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Favorit
                  </div>
                </label>
                <label className="cursor-pointer select-none">
                  <input type="checkbox" checked={formData.isNew} onChange={(event) => setFormData((current) => ({ ...current, isNew: event.target.checked }))} className="peer sr-only" />
                  <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold peer-checked:bg-secondary peer-checked:text-primary peer-checked:border-primary transition-all flex items-center gap-1">
                    <Star className="w-3 h-3" /> Baru
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={(event) => setFormData((current) => ({ ...current, isActive: event.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <p className="text-sm font-bold text-dark">Tampilkan di Menu</p>
                <p className="text-[10px] text-gray-500">Menu ini bisa dipesan oleh pelanggan.</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex gap-3 pt-2">
          <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
          <button onClick={handleSaveMenu} disabled={saving} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors disabled:opacity-70">{saving ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
