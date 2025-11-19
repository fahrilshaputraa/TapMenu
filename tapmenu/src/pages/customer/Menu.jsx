import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  ChevronRight,
  ChevronLeft,
  Store,
  Clock,
  MapPin,
  Check,
  Star,
  Ticket,
  Heart
} from 'lucide-react'

const restaurantInfo = {
  name: 'Warung Pak Joko',
  description: 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau.',
  address: 'Jl. Merdeka No. 123, Jakarta Selatan',
  openTime: '08:00',
  closeTime: '22:00',
  logo: null,
}

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'food', name: 'Makanan Utama' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Camilan' },
  { id: 'promo', name: 'Promo' },
]

const promos = [
  {
    id: 1,
    title: 'Diskon Spesial!',
    description: 'Diskon 50% untuk semua menu ayam',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    title: 'Promo Minuman Gratis',
    description: 'Beli 1 makanan utama, gratis 1 minuman',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=60',
  },
]

const addOns = [
  { id: 'telur', name: 'Tambah Telur', price: 5000 },
  { id: 'keju', name: 'Tambah Keju', price: 7000 },
  { id: 'sambal', name: 'Extra Sambal', price: 3000 },
  { id: 'nasi', name: 'Extra Nasi', price: 5000 },
  { id: 'ayam', name: 'Extra Ayam', price: 10000 },
  { id: 'sayur', name: 'Extra Sayuran', price: 4000 },
]

const menuItems = [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'food', price: 25000, stock: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=60', description: 'Nasi goreng dengan telur, ayam, dan sayuran segar', rating: 4.8, reviews: 156, badge: 'Terlaris', addOns: ['telur', 'keju', 'sambal', 'ayam'] },
  { id: 2, name: 'Ayam Bakar', category: 'food', price: 35000, stock: true, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&auto=format&fit=crop&q=60', description: 'Ayam bakar bumbu kecap dengan sambal dan lalapan', rating: 4.9, reviews: 203, addOns: ['nasi', 'sambal', 'sayur'] },
  { id: 3, name: 'Mie Goreng', category: 'food', price: 20000, stock: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=60', description: 'Mie goreng dengan telur dan sayuran', rating: 4.6, reviews: 98, addOns: ['telur', 'keju', 'ayam'] },
  { id: 4, name: 'Soto Ayam', category: 'food', price: 22000, stock: false, image: 'https://images.unsplash.com/photo-1547928576-b822bc410f7c?w=800&auto=format&fit=crop&q=60', description: 'Soto ayam dengan kuah kuning yang gurih', rating: 4.7, reviews: 134, addOns: ['telur', 'nasi', 'ayam'] },
  { id: 5, name: 'Ayam Geprek', category: 'food', price: 28000, originalPrice: 35000, stock: true, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=60', description: 'Ayam crispy dengan sambal geprek pedas', rating: 4.8, reviews: 187, badge: 'Promo', isPromo: true, addOns: ['nasi', 'keju', 'sambal', 'telur'] },
  { id: 6, name: 'Gado-gado', category: 'food', price: 18000, stock: true, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=60', description: 'Sayuran segar dengan bumbu kacang', rating: 4.5, reviews: 76, addOns: ['telur', 'sayur'] },
  { id: 7, name: 'Ramen Sapi', category: 'food', price: 45000, stock: true, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60', description: 'Ramen dengan kuah kaldu sapi yang kaya rasa', rating: 4.9, reviews: 212, badge: 'Baru', addOns: ['telur', 'keju', 'sayur'] },
  { id: 8, name: 'Es Teh Manis', category: 'drink', price: 8000, stock: true, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=60', description: 'Teh manis dingin yang menyegarkan', rating: 4.4, reviews: 89 },
  { id: 9, name: 'Es Jeruk', category: 'drink', price: 10000, stock: true, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop&q=60', description: 'Jeruk peras segar dengan es', rating: 4.5, reviews: 67 },
  { id: 10, name: 'Es Kopi Susu', category: 'drink', price: 22000, stock: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=60', description: 'Kopi susu dengan es yang creamy', rating: 4.7, reviews: 145 },
  { id: 11, name: 'Jus Alpukat', category: 'drink', price: 15000, stock: true, image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=60', description: 'Jus alpukat creamy dengan susu', rating: 4.6, reviews: 92 },
  { id: 12, name: 'Kue Coklat', category: 'snack', price: 30000, stock: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60', description: 'Kue coklat lembut dengan topping coklat leleh', rating: 4.8, reviews: 178 },
  { id: 13, name: 'Kerupuk', category: 'snack', price: 5000, stock: true, image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=60', description: 'Kerupuk udang renyah', rating: 4.3, reviews: 45 },
  { id: 14, name: 'Tempe Goreng', category: 'snack', price: 8000, stock: true, image: 'https://images.unsplash.com/photo-1632709810780-b5a4343cebec?w=800&auto=format&fit=crop&q=60', description: 'Tempe goreng crispy dengan tepung', rating: 4.4, reviews: 56 },
]

export function CustomerMenu() {
  const { tableId } = useParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showItemDetail, setShowItemDetail] = useState(null)
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const toggleAddOn = (addOnId) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  const getAddOnDetails = (addOnIds) => {
    return addOnIds.map(id => addOns.find(a => a.id === id)).filter(Boolean)
  }

  const calculateAddOnsPrice = (addOnIds) => {
    return addOnIds.reduce((sum, id) => {
      const addOn = addOns.find(a => a.id === id)
      return sum + (addOn ? addOn.price : 0)
    }, 0)
  }

  const tableName = tableId ? `Meja ${tableId}` : 'Bawa Pulang'

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory === 'promo') return item.isPromo
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const addToCart = (item, quantity = 1) => {
    if (!item.stock) return

    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity, note: '' }])
    }
  }

  const updateQuantity = (cartItemId, delta) => {
    setCart(cart.map(item => {
      const itemKey = item.cartItemId || item.id
      if (itemKey === cartItemId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => {
    const addOnsPrice = item.selectedAddOns ? calculateAddOnsPrice(item.selectedAddOns) : 0
    return sum + ((item.price + addOnsPrice) * item.quantity)
  }, 0)
  const tax = Math.round(subtotal * 0.11)
  const total = subtotal + tax

  const handleOrder = () => {
    if (cart.length === 0) return

    const newOrderNumber = '#' + String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    setOrderNumber(newOrderNumber)
    setShowCart(false)
    setShowOrderSuccess(true)
  }

  const resetOrder = () => {
    setCart([])
    setShowOrderSuccess(false)
  }

  const handleAddFromDetail = () => {
    if (showItemDetail) {
      const itemWithAddOns = {
        ...showItemDetail,
        selectedAddOns: [...selectedAddOns],
        cartItemId: Date.now() // Unique ID for cart items with different add-ons
      }
      setCart([...cart, { ...itemWithAddOns, quantity: detailQuantity, note: '' }])
      setShowItemDetail(null)
      setDetailQuantity(1)
      setSelectedAddOns([])
    }
  }

  const getItemQuantityInCart = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
            <Search className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{restaurantInfo.name}</h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{tableName}</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 -mr-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-emerald-500 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-tight pt-6 pb-4">
          Mau makan apa hari ini?
        </h2>

        {/* Promo Carousel */}
        <div className="flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {promos.map((promo) => (
            <div key={promo.id} className="flex-shrink-0 w-72 sm:w-80">
              <div
                className="w-full aspect-video bg-cover bg-center rounded-xl mb-2"
                style={{ backgroundImage: `url("${promo.image}")` }}
              />
              <p className="text-sm font-medium text-zinc-900 dark:text-white">{promo.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{promo.description}</p>
            </div>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 pb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-32">
          {filteredItems.map((item) => {
            const quantityInCart = getItemQuantityInCart(item.id)

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden ${
                  !item.stock ? 'opacity-50' : 'hover:border-emerald-500/50'
                } transition-colors`}
              >
                {/* Image */}
                <button
                  onClick={() => item.stock && setShowItemDetail(item)}
                  disabled={!item.stock}
                  className="w-full"
                >
                  <div
                    className="w-full aspect-square bg-cover bg-center relative"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  >
                    {item.badge && (
                      <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full ${
                        item.badge === 'Terlaris' ? 'bg-emerald-500' :
                        item.badge === 'Baru' ? 'bg-blue-500' :
                        item.badge === 'Promo' ? 'bg-red-500' : 'bg-emerald-500'
                      }`}>
                        {item.badge}
                      </div>
                    )}
                    {!item.stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">Habis</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Content */}
                <div className="p-3">
                  <button
                    onClick={() => item.stock && setShowItemDetail(item)}
                    disabled={!item.stock}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1 mb-1">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      {item.originalPrice && (
                        <p className="text-xs text-zinc-400 line-through">
                          Rp {item.originalPrice.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </button>

                  {/* Add to cart button */}
                  {item.stock && (
                    <div className="flex items-center justify-between">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="flex-1 text-center text-sm font-medium text-zinc-900 dark:text-white">
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center justify-center gap-1 w-full py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Tambah
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cart Button - Fixed */}
      {totalItems > 0 && !showCart && !showItemDetail && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full flex items-center justify-between px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">{totalItems} item</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Rp {total.toLocaleString('id-ID')}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Modal - Responsive */}
      {showItemDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Detail Header */}
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Detail Produk</h2>
              <button
                onClick={() => {
                  setShowItemDetail(null)
                  setDetailQuantity(1)
                }}
                className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detail Content */}
            <div className="p-4">
              {/* Image */}
              <div
                className="w-full aspect-video bg-cover bg-center rounded-xl mb-4"
                style={{ backgroundImage: `url("${showItemDetail.image}")` }}
              />

              {/* Title */}
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {showItemDetail.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {showItemDetail.originalPrice && (
                    <p className="text-sm text-zinc-400 line-through">
                      Rp {showItemDetail.originalPrice.toLocaleString('id-ID')}
                    </p>
                  )}
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {showItemDetail.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-zinc-900 dark:text-white">{showItemDetail.rating}</span>
                  <span>({showItemDetail.reviews})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {showItemDetail.description}
              </p>

              {/* Add-ons */}
              {showItemDetail.addOns && showItemDetail.addOns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Tambahan</h3>
                  <div className="space-y-2">
                    {showItemDetail.addOns.map(addOnId => {
                      const addOn = addOns.find(a => a.id === addOnId)
                      if (!addOn) return null
                      const isSelected = selectedAddOns.includes(addOnId)
                      return (
                        <button
                          key={addOnId}
                          onClick={() => toggleAddOn(addOnId)}
                          className={`flex items-center justify-between w-full p-3 rounded-lg border transition-colors ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-zinc-300 dark:border-zinc-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-zinc-900 dark:text-white">{addOn.name}</span>
                          </div>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            +Rp {addOn.price.toLocaleString('id-ID')}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Total Price */}
              {selectedAddOns.length > 0 && (
                <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-500 dark:text-zinc-400">Harga dasar</span>
                    <span className="text-zinc-900 dark:text-white">Rp {showItemDetail.price.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-500 dark:text-zinc-400">Tambahan</span>
                    <span className="text-zinc-900 dark:text-white">Rp {calculateAddOnsPrice(selectedAddOns).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-1 mt-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-zinc-900 dark:text-white">Total per item</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {(showItemDetail.price + calculateAddOnsPrice(selectedAddOns)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity & Add */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white w-8 text-center">
                    {detailQuantity}
                  </span>
                  <button
                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddFromDetail}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Tambah - Rp {((showItemDetail.price + calculateAddOnsPrice(selectedAddOns)) * detailQuantity).toLocaleString('id-ID')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal - Responsive */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Cart Header */}
            <div className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Keranjang Anda</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                  <ShoppingCart className="w-12 h-12 mb-3" />
                  <p className="font-medium">Keranjang kosong</p>
                  <p className="text-sm">Tambahkan menu untuk memulai</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => {
                      const itemKey = item.cartItemId || item.id
                      const addOnsPrice = item.selectedAddOns ? calculateAddOnsPrice(item.selectedAddOns) : 0
                      const itemTotal = item.price + addOnsPrice

                      return (
                        <div key={itemKey} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-14 h-14 bg-cover bg-center rounded-lg flex-shrink-0"
                              style={{ backgroundImage: `url("${item.image}")` }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">
                                {item.name}
                              </p>
                              {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                                  + {getAddOnDetails(item.selectedAddOns).map(a => a.name).join(', ')}
                                </p>
                              )}
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                Rp {itemTotal.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => updateQuantity(itemKey, -1)}
                                className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-zinc-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemKey, 1)}
                                className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500 text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Voucher */}
                  <button className="flex items-center justify-between w-full p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">Gunakan Voucher</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>

                  {/* Cost Details */}
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                      <span className="text-zinc-900 dark:text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-400">PPN (11%)</span>
                      <span className="text-zinc-900 dark:text-white">Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-zinc-900 dark:text-white">Total</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {total.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="flex-shrink-0 p-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={handleOrder}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Lanjutkan ke Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-xl text-center">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                Pesanan Dikirim!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                Nomor pesanan Anda
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                {orderNumber}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Pesanan Anda sedang diproses. Silakan tunggu di {tableName}.
              </p>

              <button
                onClick={resetOrder}
                className="w-full py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
              >
                Pesan Lagi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
