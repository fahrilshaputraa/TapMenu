import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const DEFAULT_LOGO = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'

const restaurantInfo = {
  name: 'Warung Bu Dewi',
  description: 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau.',
  address: 'Jl. Merdeka No. 123, Jakarta Selatan',
  openTime: '08:00',
  closeTime: '22:00',
  logo: DEFAULT_LOGO,
  banner: DEFAULT_BANNER,
}

const categories = [
  { id: 'all', name: 'Semua', icon: 'fa-solid fa-border-all' },
  { id: 'makanan', name: 'Makanan', icon: 'fa-solid fa-utensils' },
  { id: 'minuman', name: 'Minuman', icon: 'fa-solid fa-mug-hot' },
  { id: 'cemilan', name: 'Cemilan', icon: 'fa-solid fa-cookie-bite' },
]

const menuItems = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    description: "Dengan telur mata sapi, sate ayam, dan kerupuk udang.",
    price: 25000,
    stock: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    category: "makanan",
    popular: true,
  },
  {
    id: 2,
    name: "Ayam Bakar Madu",
    description: "Ayam kampung bakar dengan olesan madu dan sambal terasi.",
    price: 28000,
    stock: true,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80",
    category: "makanan",
    popular: false,
  },
  {
    id: 3,
    name: "Sate Ayam Madura",
    description: "10 tusuk sate ayam dengan bumbu kacang kental.",
    price: 30000,
    stock: true,
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=400&q=80",
    category: "makanan",
    popular: true,
  },
  {
    id: 4,
    name: "Es Kopi Susu Gula Aren",
    description: "Kopi arabika house blend dengan susu fresh milk.",
    price: 18000,
    stock: true,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80",
    category: "minuman",
    popular: false,
  },
  {
    id: 5,
    name: "Es Teh Manis Jumbo",
    description: "Teh tubruk wangi melati dengan gula asli.",
    price: 8000,
    stock: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80",
    category: "minuman",
    popular: false,
  },
  {
    id: 6,
    name: "Pisang Goreng Keju",
    description: "Pisang kepok kuning digoreng crispy topping keju.",
    price: 15000,
    stock: true,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a3a2b7b?auto=format&fit=crop&w=400&q=80",
    category: "cemilan",
    popular: false,
  }
]

export function CustomerMenu() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const tableName = tableId ? `Meja ${tableId}` : 'Bawa Pulang'
  const bannerImage = restaurantInfo.banner || DEFAULT_BANNER
  const logoImage = restaurantInfo.logo || DEFAULT_LOGO

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (normalizedQuery) {
      const haystack = `${item.name} ${item.description}`.toLowerCase()
      if (!haystack.includes(normalizedQuery)) return false
    }
    return true
  })

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

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
        return { ...item, quantity: newQuantity }
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

    setShowCart(false)
    // Simulasi loading
    setTimeout(() => {
      setShowOrderSuccess(true)
    }, 300)
  }

  const resetOrder = () => {
    setCart([])
    setShowOrderSuccess(false)
    window.location.reload()
  }

  const goToOrderTracking = () => {
    setShowSidebar(false)
    navigate('/order/status')
  }

  const goToVoucherPage = () => {
    setShowSidebar(false)
    navigate('/order/vouchers')
  }

  const goToOrderHistory = () => {
    setShowSidebar(false)
    navigate('/order/history')
  }

  const goToFavorites = () => {
    setShowSidebar(false)
    navigate('/order/favorites')
  }

  const goToAbout = () => {
    setShowSidebar(false)
    navigate('/order/about')
  }

  const goToRegister = () => {
    setShowSidebar(false)
    navigate('/customer/register')
  }

  return (
    <div id="app-view" className="h-screen fade-in bg-[#F7F5F2] flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scroll">
          {/* Store Hero */}
          <section className="relative bg-white pb-4">
          <div className="h-48 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <img
              src={bannerImage}
              alt={`${restaurantInfo.name} banner`}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 z-20">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center gap-2">
                <i className="fa-solid fa-circle text-green-400 text-[8px] animate-pulse"></i>
                Buka
              </div>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFavorite(prev => !prev)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-white text-accent shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}
                aria-label="Favorit"
              >
                <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-xs`}></i>
              </button>
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                aria-label="Buka menu samping"
              >
                <i className="fa-solid fa-bars text-sm"></i>
              </button>
            </div>
          </div>

          <div className="px-5 relative z-20 -mt-12 pb-4">
            <div className="flex items-end justify-between">
              <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-lg">
                <img
                  src={logoImage}
                  alt={`${restaurantInfo.name} logo`}
                  className="w-full h-full object-cover rounded-xl bg-gray-100"
                />
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-xl">
                <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                <span className="text-xs font-bold text-yellow-700">4.8</span>
                <span className="text-[10px] text-gray-400">(120+)</span>
              </div>
            </div>

            <div className="mt-3">
              <h1 className="text-2xl font-extrabold text-dark leading-tight">{restaurantInfo.name}</h1>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{restaurantInfo.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-primary"></i>
                  {restaurantInfo.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-primary"></i>
                  {restaurantInfo.openTime} - {restaurantInfo.closeTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-chair text-primary"></i>
                  {tableName}
                </span>
              </div>
            </div>
          </div>
        </section>

          {/* Sticky Search & Categories */}
          <header className="sticky top-0 z-40 bg-[#F7F5F2] pt-2 border-b border-gray-200/70 backdrop-blur-md">
            <div className="px-5 space-y-3 pb-3">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari menu favoritmu..."
                  className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-sm"
                />
              </div>

              <div className="overflow-x-auto no-scrollbar flex gap-2 pb-1">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`cat-btn px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${isActive
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                        : 'bg-white text-gray-500 border-gray-200'
                        }`}
                    >
                      {category.icon && <i className={`${category.icon} text-xs`}></i>}
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          {/* Menu List */}
          <main className="px-5 pt-4 pb-28 md:pb-36 grid grid-cols-1 gap-4" id="menu-container">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                Menu tidak ditemukan untuk pencarian atau kategori ini.
              </div>
            ) : (
              filteredItems.map((item) => {
                const qty = getItemQuantity(item.id)
                return (
                  <div key={item.id} className="bg-white p-3 rounded-2xl shadow-card border border-gray-50 flex gap-3 relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-dark text-base line-clamp-1">{item.name}</h3>
                        {item.popular && <i className="fa-solid fa-fire text-orange-500 text-xs animate-pulse" title="Populer"></i>}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight line-clamp-2 mt-1 mb-auto">{item.description}</p>

                      <div className="flex justify-between items-end mt-3">
                        <span className="font-extrabold text-dark text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="w-9 h-9 rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm border border-gray-200"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-primary text-white rounded-full px-2 py-1 shadow-md">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                            >
                              <i className="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                              <i className="fa-solid fa-plus text-[10px]"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </main>
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${showSidebar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowSidebar(false)}
        ></div>
        <div className={`absolute top-0 right-0 w-72 max-w-full h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 bg-primary text-white relative">
            <button
              type="button"
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              aria-label="Tutup menu samping"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <div className="flex items-center gap-3 mb-1 mt-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/30">
                <i className="fa-regular fa-user"></i>
              </div>
              <div>
                <p className="text-xs text-green-100 uppercase font-bold tracking-wider">Selamat Datang</p>
                <h3 className="font-bold text-lg">Tamu</h3>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scroll">
            <nav className="space-y-1">
              <button type="button" onClick={goToOrderTracking} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-receipt w-5 text-center"></i>
                <span className="font-bold text-sm">Cek Pesanan</span>
              </button>
              <button type="button" onClick={goToVoucherPage} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-ticket w-5 text-center"></i>
                <span className="font-bold text-sm">Voucher Saya</span>
              </button>
              <button type="button" onClick={goToOrderHistory} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-clock-rotate-left w-5 text-center"></i>
                <span className="font-bold text-sm">Riwayat Pesanan</span>
              </button>
              <button type="button" onClick={goToFavorites} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-heart w-5 text-center"></i>
                <span className="font-bold text-sm">Favorit Saya</span>
              </button>
              <hr className="border-gray-100 my-2 mx-6" />
              <button type="button" onClick={goToAbout} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-circle-info w-5 text-center"></i>
                <span className="font-bold text-sm">Tentang Kami</span>
              </button>
            </nav>
          </div>

          <div className="p-6 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSidebar(false)
                  navigate('/customer/login')
                }}
                className="py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={goToRegister}
                className="py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primaryLight transition-colors shadow-lg shadow-primary/20"
              >
                Daftar
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-4">Versi 1.2.0 &copy; TapMenu</p>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div
          id="cart-bar"
          className="sticky bottom-0 z-40 w-full px-4 pb-4 pt-4 "
        >
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
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">Keranjang kosong</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-dark text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">Rp {item.price.toLocaleString('id-ID')} / porsi</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-[#F7F5F2] rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 bg-white text-gray-500 rounded flex items-center justify-center shadow-sm hover:text-primary"
                          >
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="font-bold text-dark text-xs w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 bg-primary text-white rounded flex items-center justify-center shadow-sm"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                        <span className="font-bold text-primary text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Details & Checkout */}
            <div className="bg-white p-6 rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
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
                <i className="fa-solid fa-paper-plane"></i> Pesan Sekarang
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
