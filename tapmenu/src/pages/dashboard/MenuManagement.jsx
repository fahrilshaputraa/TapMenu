import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Image } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'food', name: 'Makanan' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Snack' },
]

const initialMenuItems = [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'food', price: 15000, stock: true, image: null, description: 'Nasi goreng dengan telur, ayam, dan sayuran' },
  { id: 2, name: 'Ayam Bakar', category: 'food', price: 25000, stock: true, image: null, description: 'Ayam bakar bumbu kecap dengan sambal' },
  { id: 3, name: 'Mie Goreng', category: 'food', price: 12000, stock: true, image: null, description: 'Mie goreng dengan telur dan sayuran' },
  { id: 4, name: 'Soto Ayam', category: 'food', price: 15000, stock: false, image: null, description: 'Soto ayam dengan kuah kuning' },
  { id: 5, name: 'Gado-gado', category: 'food', price: 12000, stock: true, image: null, description: 'Sayuran segar dengan bumbu kacang' },
  { id: 6, name: 'Es Teh Manis', category: 'drink', price: 5000, stock: true, image: null, description: 'Teh manis dingin' },
  { id: 7, name: 'Es Jeruk', category: 'drink', price: 6000, stock: true, image: null, description: 'Jeruk peras dengan es' },
  { id: 8, name: 'Jus Alpukat', category: 'drink', price: 10000, stock: true, image: null, description: 'Jus alpukat dengan susu' },
  { id: 9, name: 'Kerupuk', category: 'snack', price: 3000, stock: true, image: null, description: 'Kerupuk udang' },
]

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      setMenuItems(menuItems.filter(item => item.id !== id))
    }
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
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Menu</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kelola daftar menu dan harga
            </p>
          </div>
          <Link
            to="/dashboard/menu/add"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Menu
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-emerald-500/50 transition-colors"
            >
              {/* Image */}
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-zinc-400" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.stock
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {item.stock ? 'Tersedia' : 'Habis'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/dashboard/menu/edit/${item.id}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Tidak ada menu ditemukan</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
