import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Image, Upload, Heart, Star, Info } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'food', name: 'Makanan' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Cemilan' },
]

const menuCategories = [
  { id: 'food', name: 'Makanan' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Cemilan' },
  { id: 'dessert', name: 'Penutup' },
]

const initialMenuItems = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    category: 'food',
    price: 25000,
    stock: true,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
    description: 'Lengkap dengan telur dan sate.',
    discount: 0,
    tax: 10,
    isActive: true,
    isFavorite: true,
    isNew: false,
    variants: [
      {
        name: 'Level Pedas',
        type: 'radio',
        options: [
          { name: 'Tidak Pedas', price: 0 },
          { name: 'Sedang', price: 0 },
          { name: 'Pedas', price: 0 }
        ]
      }
    ]
  },
  { id: 2, name: 'Es Teh Manis', category: 'drink', price: 5000, stock: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80', description: 'Teh asli menyegarkan.', discount: 0, tax: 10, isActive: true, isFavorite: false, isNew: false, variants: [] },
  { id: 3, name: 'Ayam Bakar Madu', category: 'food', price: 35000, stock: true, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80', description: 'Ayam kampung bumbu madu.', discount: 15, tax: 10, isActive: true, isFavorite: false, isNew: true, variants: [] },
  { id: 4, name: 'Pisang Keju', category: 'snack', price: 15000, stock: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2b7b?auto=format&fit=crop&w=300&q=80', description: 'Pisang kepok pilihan.', discount: 0, tax: 10, isActive: true, isFavorite: false, isNew: false, variants: [] },
]

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('basic')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
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
  })

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      setMenuItems(menuItems.filter(item => item.id !== id))
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      category: 'food',
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
    })
    setActiveTab('basic')
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: String(item.price),
      discount: String(item.discount || ''),
      tax: String(item.tax || '10'),
      stock: item.stockAmount ? String(item.stockAmount) : '',
      image: item.image || '',
      isActive: item.isActive !== false,
      isFavorite: item.isFavorite || false,
      isNew: item.isNew || false,
      trackStock: !!item.stockAmount,
      variants: item.variants || [],
    })
    setActiveTab('basic')
    setShowModal(true)
  }

  const toggleItemStatus = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
  }

  // Variant management functions
  const addVariantGroup = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: '',
      type: 'radio',
      options: [{ id: Date.now().toString() + '-opt', name: '', price: 0 }]
    }
    setFormData({ ...formData, variants: [...formData.variants, newGroup] })
  }

  const removeVariantGroup = (groupId) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter(g => g.id !== groupId)
    })
  }

  const updateVariantGroup = (groupId, field, value) => {
    setFormData({
      ...formData,
      variants: formData.variants.map(g =>
        g.id === groupId ? { ...g, [field]: value } : g
      )
    })
  }

  const addVariantOption = (groupId) => {
    setFormData({
      ...formData,
      variants: formData.variants.map(g =>
        g.id === groupId
          ? { ...g, options: [...g.options, { id: Date.now().toString(), name: '', price: 0 }] }
          : g
      )
    })
  }

  const removeVariantOption = (groupId, optionId) => {
    setFormData({
      ...formData,
      variants: formData.variants.map(g =>
        g.id === groupId
          ? { ...g, options: g.options.filter(o => o.id !== optionId) }
          : g
      )
    })
  }

  const updateVariantOption = (groupId, optionId, field, value) => {
    setFormData({
      ...formData,
      variants: formData.variants.map(g =>
        g.id === groupId
          ? {
            ...g,
            options: g.options.map(o =>
              o.id === optionId ? { ...o, [field]: value } : o
            )
          }
          : g
      )
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveMenu = () => {
    if (!formData.name || !formData.price) {
      alert('Nama menu dan harga wajib diisi!')
      return
    }

    // Clean up variants - remove empty options and groups
    const cleanedVariants = formData.variants
      .map(group => ({
        ...group,
        options: group.options.filter(opt => opt.name.trim() !== '')
      }))
      .filter(group => group.name.trim() !== '' && group.options.length > 0)

    const menuData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseInt(formData.price),
      discount: parseInt(formData.discount) || 0,
      tax: parseInt(formData.tax) || 10,
      stock: formData.trackStock ? parseInt(formData.stock) > 0 : true,
      stockAmount: formData.trackStock ? parseInt(formData.stock) : null,
      image: formData.image,
      isActive: formData.isActive,
      isFavorite: formData.isFavorite,
      isNew: formData.isNew,
      variants: cleanedVariants,
    }

    if (editingItem) {
      setMenuItems(menuItems.map(item =>
        item.id === editingItem.id ? { ...item, ...menuData } : item
      ))
    } else {
      const newId = menuItems.length > 0 ? Math.max(...menuItems.map(m => m.id)) + 1 : 1
      setMenuItems([...menuItems, { id: newId, ...menuData }])
    }

    setShowModal(false)
  }

  const calculateFinalPrice = () => {
    const price = parseInt(formData.price) || 0
    const discount = parseInt(formData.discount) || 0
    return price - (price * discount / 100)
  }

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-dark">Daftar Menu</h1>
            <p className="text-xs text-gray-500">
              Kelola produk, harga, dan ketersediaan stok
            </p>
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
          {/* Stats & Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${selectedCategory === category.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-500 hover:text-primary hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Menu List (Grid) */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const hasDiscount = item.discount > 0
                const finalPrice = hasDiscount ? item.price * ((100 - item.discount) / 100) : item.price
                const categoryLabel = item.category === 'food' ? 'Makanan' : item.category === 'drink' ? 'Minuman' : 'Cemilan'

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col h-full ${!item.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}
                  >
                    {/* Image */}
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
                        <span className="bg-black/60 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold">
                          {categoryLabel}
                        </span>
                        {hasDiscount && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-dark text-lg leading-tight line-clamp-1">{item.name}</h3>
                      </div>

                      {/* Labels */}
                      <div className="mb-2 flex flex-wrap gap-1 items-center">
                        {item.isFavorite && (
                          <span className="bg-[#FFF0EB] text-accent text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent/20">
                            Favorit
                          </span>
                        )}
                        {item.isNew && (
                          <span className="bg-secondary text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                            Baru
                          </span>
                        )}
                        {item.variants && item.variants.length > 0 && (
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                            {item.variants.length} Varian
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{item.description}</p>

                      {/* Price */}
                      <div className="mb-4">
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-400 text-xs line-through mr-1">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-accent font-extrabold text-lg">
                              Rp {finalPrice.toLocaleString('id-ID')}
                            </span>
                          </>
                        ) : (
                          <span className="text-accent font-extrabold text-lg">
                            Rp {item.price.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.isActive}
                              onChange={() => toggleItemStatus(item.id)}
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
            /* Empty State */
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

      {/* Add/Edit Menu Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
        size="2xl"
      >
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50 px-5 pt-2 gap-4 overflow-x-auto -mx-6 -mt-4 mb-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'basic'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-dark'
              }`}
          >
            Info Dasar
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'pricing'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-dark'
              }`}
          >
            Harga & Pajak
          </button>
          <button
            onClick={() => setActiveTab('variants')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'variants'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-dark'
              }`}
          >
            Varian
          </button>
          <button
            onClick={() => setActiveTab('others')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'others'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-dark'
              }`}
          >
            Stok & Lainnya
          </button>
        </div>

        {/* Modal Body (Scrollable) */}

        {/* TAB 1: INFO DASAR */}
        {activeTab === 'basic' && (
          <div className="space-y-5 fade-in">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image Upload */}
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
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 text-center">Min. 500x500px (JPG/PNG)</p>
              </div>

              {/* Basic Inputs */}
              <div className="w-full sm:w-2/3 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Nama Menu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                    placeholder="Contoh: Nasi Goreng Spesial"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                  >
                    {menuCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium resize-none"
                    placeholder="Jelaskan bahan utama atau rasa..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HARGA & PAJAK */}
        {activeTab === 'pricing' && (
          <div className="space-y-5 fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                  Harga Dasar (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg font-bold text-dark"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Diskon (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ada diskon.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Pajak / PPN (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                    placeholder="10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Standar PPN restoran 10%.</p>
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-secondary mt-4">
              <p className="text-xs font-bold text-primary mb-2 uppercase">Preview Harga Pelanggan</p>
              <div className="flex justify-between items-center">
                <div>
                  {parseInt(formData.discount) > 0 && (
                    <>
                      <p className="text-sm text-gray-500">
                        Harga Normal: <span className="line-through">Rp {parseInt(formData.price || 0).toLocaleString('id-ID')}</span>
                      </p>
                      <p className="text-xs text-accent font-bold">Hemat {formData.discount}%</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">
                    Rp {calculateFinalPrice().toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-gray-500">*Belum termasuk PPN</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VARIAN */}
        {activeTab === 'variants' && (
          <div className="space-y-6 fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-blue-800">Info Varian</h4>
                <p className="text-[10px] text-blue-600">
                  Gunakan varian untuk opsi tambahan seperti "Level Pedas" (Pilih Satu) atau "Toping Tambahan" (Pilih Banyak).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {formData.variants.map((group) => (
                <div key={group.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nama Grup</label>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => updateVariantGroup(group.id, 'name', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          placeholder="Cth: Level Pedas"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tipe Pilihan</label>
                        <select
                          value={group.type}
                          onChange={(e) => updateVariantGroup(group.id, 'type', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        >
                          <option value="radio">Pilih Satu (Wajib)</option>
                          <option value="checkbox">Pilih Banyak (Opsional)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeVariantGroup(group.id)}
                      className="ml-3 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => (
                      <div key={option.id} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => updateVariantOption(group.id, option.id, 'name', e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary"
                          placeholder="Nama Opsi (Cth: Sedang)"
                        />
                        <div className="relative w-24">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">+Rp</span>
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => updateVariantOption(group.id, option.id, 'price', parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-2 py-2 text-xs focus:outline-none focus:border-primary"
                            placeholder="0"
                          />
                        </div>
                        <button
                          onClick={() => removeVariantOption(group.id, option.id)}
                          className="text-gray-300 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addVariantOption(group.id)}
                    className="mt-3 text-xs font-bold text-primary hover:underline"
                  >
                    + Tambah Opsi
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addVariantGroup}
              className="w-full py-3 border-2 border-dashed border-primary/30 rounded-xl text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Grup Varian
            </button>
          </div>
        )}

        {/* TAB 4: STOK & LAINNYA */}
        {activeTab === 'others' && (
          <div className="space-y-6 fade-in">

            {/* Stock Management */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-bold text-dark text-sm">Manajemen Stok</h4>
                  <p className="text-[10px] text-gray-500">Aktifkan untuk melacak jumlah stok.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.trackStock}
                    onChange={(e) => setFormData({ ...formData, trackStock: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {formData.trackStock && (
                <div className="transition-all">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Jumlah Stok Saat Ini</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm font-medium"
                    placeholder="Contoh: 50"
                  />
                </div>
              )}
            </div>

            {/* Labels */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Label Menu (Opsional)</label>
              <div className="flex gap-3">
                <label className="cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold peer-checked:bg-[#FFF0EB] peer-checked:text-accent peer-checked:border-accent transition-all flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Favorit
                  </div>
                </label>
                <label className="cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-bold peer-checked:bg-secondary peer-checked:text-primary peer-checked:border-primary transition-all flex items-center gap-1">
                    <Star className="w-3 h-3" /> Baru
                  </div>
                </label>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <div>
                <p className="text-sm font-bold text-dark">Tampilkan di Menu</p>
                <p className="text-[10px] text-gray-500">Menu ini bisa dipesan oleh pelanggan.</p>
              </div>
            </div>

          </div>
        )}

      </Modal>

    </DashboardLayout >
  )
}
