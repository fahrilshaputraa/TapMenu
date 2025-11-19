import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, Trash2 } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const categories = [
  { id: 'food', name: 'Makanan' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Snack' },
]

export function MenuForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    description: '',
    basePrice: '',
    ppn: '11',
    ppnIncluded: true,
    discount: '0',
    discountType: 'percent',
    stock: true,
    variants: [],
  })

  const [newVariant, setNewVariant] = useState({ name: '', price: '' })

  useEffect(() => {
    if (isEdit) {
      // Simulate fetching menu data
      // In real app, fetch from API
      setFormData({
        name: 'Nasi Goreng Spesial',
        category: 'food',
        description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
        basePrice: '15000',
        ppn: '11',
        ppnIncluded: true,
        discount: '0',
        discountType: 'percent',
        stock: true,
        variants: [
          { id: 1, name: 'Porsi Kecil', price: '12000' },
          { id: 2, name: 'Porsi Jumbo', price: '20000' },
        ],
      })
    }
  }, [isEdit, id])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle save logic here
    console.log('Save menu:', formData)
    navigate('/dashboard/menu')
  }

  const addVariant = () => {
    if (newVariant.name && newVariant.price) {
      setFormData({
        ...formData,
        variants: [
          ...formData.variants,
          { id: Date.now(), ...newVariant }
        ]
      })
      setNewVariant({ name: '', price: '' })
    }
  }

  const removeVariant = (variantId) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter(v => v.id !== variantId)
    })
  }

  // Calculate final price
  const calculateFinalPrice = () => {
    let price = parseFloat(formData.basePrice) || 0

    // Apply discount
    if (formData.discount) {
      if (formData.discountType === 'percent') {
        price = price - (price * parseFloat(formData.discount) / 100)
      } else {
        price = price - parseFloat(formData.discount)
      }
    }

    // Apply PPN if not included
    if (!formData.ppnIncluded && formData.ppn) {
      price = price + (price * parseFloat(formData.ppn) / 100)
    }

    return Math.max(0, price)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/menu"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {isEdit ? 'Edit Menu' : 'Tambah Menu'}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isEdit ? 'Ubah informasi menu' : 'Tambah menu baru ke daftar'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Informasi Dasar
            </h2>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Foto Menu
                </label>
                <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-emerald-500 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Klik untuk upload</p>
                    <p className="text-xs text-zinc-400">PNG, JPG max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Nama Menu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Nama menu"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="Deskripsi menu"
                />
              </div>

              {/* Stock */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Menu tersedia</span>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Harga & Pajak
            </h2>

            <div className="space-y-4">
              {/* Base Price */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Harga Dasar <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">Rp</span>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    required
                    min="0"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* PPN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    PPN (%)
                  </label>
                  <input
                    type="number"
                    value={formData.ppn}
                    onChange={(e) => setFormData({ ...formData, ppn: e.target.value })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="11"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 pb-2.5">
                    <input
                      type="checkbox"
                      checked={formData.ppnIncluded}
                      onChange={(e) => setFormData({ ...formData, ppnIncluded: e.target.checked })}
                      className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">PPN sudah termasuk</span>
                  </label>
                </div>
              </div>

              {/* Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Diskon
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    min="0"
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Tipe Diskon
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="percent">Persen (%)</option>
                    <option value="fixed">Nominal (Rp)</option>
                  </select>
                </div>
              </div>

              {/* Final Price Preview */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Harga Akhir</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {calculateFinalPrice().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
              Varian (Opsional)
            </h2>

            <div className="space-y-4">
              {/* Existing variants */}
              {formData.variants.length > 0 && (
                <div className="space-y-2">
                  {formData.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{variant.name}</p>
                        <p className="text-xs text-zinc-500">Rp {parseInt(variant.price).toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new variant */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Nama Varian
                  </label>
                  <input
                    type="text"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Porsi Jumbo"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Harga
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">Rp</span>
                    <input
                      type="number"
                      value={newVariant.price}
                      onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                      min="0"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/menu"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Menu'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
