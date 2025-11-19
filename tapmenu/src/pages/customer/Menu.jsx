import { useState } from 'react'
import { useParams } from 'react-router-dom'

const restaurantInfo = {
  name: 'Warung Bu Dewi',
  description: 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau.',
  address: 'Jl. Merdeka No. 123, Jakarta Selatan',
  openTime: '08:00',
  closeTime: '22:00',
  logo: null,
}

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'food', name: 'Makanan Berat' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Cemilan' },
  { id: 'promo', name: 'Promo' },
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
  const [showSearch, setShowSearch] = useState(false)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const tableName = tableId ? `Meja ${tableId}` : 'Bawa Pulang'

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory === 'promo') return item.isPromo
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const addToCart = (item) => {
    if (!item.stock) return

    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
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
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = Math.round(subtotal * 0.1) // 10% tax as per design
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
    setPaymentMethod('cash')
    window.location.reload()
  }

  return (
    <div id="app-view" className="min-h-screen pb-32 fade-in bg-[#F7F5F2]">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-[#F7F5F2]/95 backdrop-blur-md border-b border-gray-200/50">
        <div className="px-4 py-3 flex justify-between items-center h-16">
          {showSearch ? (
            <div className="flex-1 flex items-center gap-3 animate-fade-in">
              <div className="flex-1 relative">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchQuery('')
                }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="font-bold text-primary text-lg">{restaurantInfo.name}</h2>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Buka • {tableName}
                </div>
              </div>
              <button
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center text-dark hover:text-primary"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </>
          )}
        </div>

        {/* Category Filter (Horizontal Scroll) */}
        <div className="px-4 pb-3 overflow-x-auto no-scrollbar flex gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id
                ? 'bg-primary text-white font-bold shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu List Grid */}
      <main className="px-4 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6" id="menu-container">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-card flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              {!item.stock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Habis</span>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-dark line-clamp-2">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex justify-between items-end mt-3">
                <span className="font-bold text-primary">Rp {item.price.toLocaleString('id-ID')}</span>
                {item.stock ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 bg-secondary text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                ) : (
                  <span className="text-xs text-red-500 font-medium">Stok Habis</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div id="cart-bar" className="fixed bottom-4 left-4 right-4 z-40 slide-up">
          <div
            className="bg-primary text-white rounded-2xl p-4 shadow-2xl flex justify-between items-center cursor-pointer"
            onClick={() => setShowCart(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg" id="total-items-badge">
                {totalItems}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-green-100">Total Pembayaran</span>
                <span className="font-bold text-lg" id="total-price-bar">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm bg-accent px-4 py-2 rounded-xl hover:bg-[#d06a50] transition-colors">
              Lihat Pesanan <i className="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div id="cart-modal" className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowCart(false)}
          ></div>

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 w-full bg-[#F7F5F2] rounded-t-[2rem] shadow-2xl h-[85vh] flex flex-col slide-up">
            {/* Handle bar */}
            <div className="w-full flex justify-center pt-4 pb-2" onClick={() => setShowCart(false)}>
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div className="px-6 pb-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">Pesanan Anda</h2>
              <button
                onClick={() => setShowCart(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll" id="cart-items-container">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dark line-clamp-1">{item.name}</h4>
                    <p className="text-primary font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3 h-8">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <i className="fa-solid fa-minus text-xs"></i>
                    </button>
                    <span className="font-bold text-dark w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-[#143326]"
                    >
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Details & Checkout */}
            <div className="bg-white p-6 rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-dark mb-3">Metode Pembayaran</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cash'
                        ? 'border-primary bg-secondary text-primary font-bold'
                        : 'border-gray-200 text-gray-500 hover:border-primary'
                      }`}
                  >
                    <i className="fa-solid fa-money-bill-wave"></i> Tunai
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'qris'
                        ? 'border-primary bg-secondary text-primary font-bold'
                        : 'border-gray-200 text-gray-500 hover:border-primary'
                      }`}
                  >
                    <i className="fa-solid fa-qrcode"></i> QRIS
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark" id="bill-subtotal">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Pajak & Layanan (10%)</span>
                  <span className="font-bold text-dark" id="bill-tax">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-primary">Total</span>
                  <span className="font-extrabold text-accent" id="bill-total">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all flex justify-center items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane"></i>
                {paymentMethod === 'qris' ? 'Bayar & Pesan' : 'Pesan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showOrderSuccess && (
        <div id="success-view" className="fixed inset-0 z-[60] bg-primary flex flex-col items-center justify-center p-6 text-center text-white fade-in">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <i className="fa-solid fa-check text-4xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold mb-2">Pesanan Diterima!</h2>
          <p className="text-green-100 mb-8 max-w-xs mx-auto">Mohon tunggu sebentar, pesanan Anda sedang disiapkan oleh dapur.</p>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-xs border border-white/10">
            <p className="text-xs text-green-200 uppercase font-bold mb-1">Estimasi Waktu</p>
            <p className="text-2xl font-bold">15 - 20 Menit</p>
          </div>

          <button
            onClick={resetOrder}
            className="mt-10 px-8 py-3 border border-white/30 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors"
          >
            Kembali ke Menu
          </button>
        </div>
      )}
    </div>
  )
}
