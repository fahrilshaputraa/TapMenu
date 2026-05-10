import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { api } from '../../services/api'

const DEFAULT_LOGO = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
const LAST_ORDER_CODE_KEY = 'tapmenu.lastOrderCode'
const ORDER_HISTORY_KEY = 'tapmenu.orderHistory'

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function mapCategoryIcon(name = '') {
  const label = name.toLowerCase()
  if (label.includes('minum')) return 'fa-solid fa-mug-hot'
  if (label.includes('cemil') || label.includes('snack')) return 'fa-solid fa-cookie-bite'
  return 'fa-solid fa-utensils'
}

export function CustomerMenu() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [error, setError] = useState('')
  const [menuPayload, setMenuPayload] = useState(null)
  const [submittedOrder, setSubmittedOrder] = useState(null)

  const tableToken = searchParams.get('table') || tableId || ''
  const restaurantSlug = searchParams.get('restaurant') || ''

  useEffect(() => {
    let active = true

    async function loadMenu() {
      try {
        const query = new URLSearchParams()
        if (tableToken) {
          query.set('table', tableToken)
        } else if (restaurantSlug) {
          query.set('restaurant', restaurantSlug)
        } else {
          const ownerRestaurant = await api.get('/api/v1/restaurants/me/')
          const fallbackSlug = ownerRestaurant?.slug

          if (!fallbackSlug) {
            throw new Error('Restoran tidak dipilih. Buka menu dari link toko atau QR meja.')
          }

          query.set('restaurant', fallbackSlug)
          navigate(`/order?restaurant=${fallbackSlug}`, { replace: true })
        }

        const payload = await api.get(`/api/v1/catalogs/public/menu/?${query.toString()}`, { auth: false })
        if (!active) return

        setMenuPayload(payload)
        setSelectedCategory('all')
        setError('')
      } catch (requestError) {
        if (active) {
          setError(requestError.message)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMenu()
    return () => {
      active = false
    }
  }, [restaurantSlug, tableToken])

  const restaurant = menuPayload?.restaurant
  const restaurantAppearance = restaurant?.appearance || {}
  const table = menuPayload?.table
  const menuItems = menuPayload?.items || []

  const categories = useMemo(() => {
    const remoteCategories = (menuPayload?.categories || []).map((category) => ({
      id: String(category.id),
      name: category.name,
      icon: mapCategoryIcon(category.name),
    }))

    return [{ id: 'all', name: 'Semua', icon: 'fa-solid fa-border-all' }, ...remoteCategories]
  }, [menuPayload?.categories])

  const isOpen = useMemo(() => {
    if (!restaurant) return false
    if (!restaurant.is_open) return false

    const now = new Date()
    const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
    const today = dayNames[now.getDay()]

    // Check operational days
    if (restaurant.operational_days && restaurant.operational_days[today] === false) {
      return false
    }

    // Check opening hours
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [openH, openM] = (restaurant.opening_time || '08:00').split(':').map(Number)
    const [closeH, closeM] = (restaurant.closing_time || '22:00').split(':').map(Number)
    
    const openTime = openH * 60 + openM
    const closeTime = closeH * 60 + closeM

    if (closeTime > openTime) {
      // Normal hours (e.g. 08:00 - 22:00)
      return currentTime >= openTime && currentTime <= closeTime
    } else {
      // Overnight hours (e.g. 22:00 - 04:00)
      return currentTime >= openTime || currentTime <= closeTime
    }
  }, [restaurant])

  const restaurantInfo = useMemo(() => ({
    name: restaurant?.name || 'TapMenu',
    description: restaurantAppearance.hero_subtitle || restaurant?.description || 'Menu digital restoran',
    address: restaurant?.address || 'Alamat belum diatur',
    openStatus: isOpen ? 'Buka' : 'Tutup',
    businessHours: `${restaurant?.opening_time || '08:00'} - ${restaurant?.closing_time || '22:00'}`,
    logo: restaurantAppearance.logo_url || DEFAULT_LOGO,
    banner: restaurantAppearance.cover_image_url || DEFAULT_BANNER,
  }), [restaurant, restaurantAppearance, isOpen])

  const tableName = table?.name || (tableId ? `Meja ${tableId}` : 'Bawa Pulang')
  const bannerImage = restaurantInfo.banner || DEFAULT_BANNER
  const logoImage = restaurantInfo.logo || DEFAULT_LOGO
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && String(item.category) !== selectedCategory) return false
      if (normalizedQuery) {
        const haystack = `${item.name} ${item.description || ''}`.toLowerCase()
        if (!haystack.includes(normalizedQuery)) return false
      }
      return true
    })
  }, [menuItems, normalizedQuery, selectedCategory])

  const getUnitPrice = (item) => Number(item.effective_price ?? item.price ?? 0)

  const getItemQuantity = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const addToCart = (item) => {
    if (!item.in_stock) return

    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const updateQuantity = (cartItemId, delta) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === cartItemId) {
            return { ...item, quantity: item.quantity + delta }
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + getUnitPrice(item) * item.quantity, 0)
  const tax = submittedOrder ? Number(submittedOrder.tax_amount || 0) : Math.round(subtotal * 0.1)
  const total = submittedOrder ? Number(submittedOrder.total_amount || 0) : subtotal + tax

  const handleOrder = async () => {
    if (cart.length === 0) return

    if (!tableToken) {
      setError('Pesanan hanya bisa dibuat dari QR meja atau link meja restoran.')
      setShowCart(false)
      return
    }

    setIsSubmittingOrder(true)
    setError('')

    try {
      const order = await api.post(
        '/api/v1/orders/public/',
        {
          table_token: tableToken,
          order_type: 'dine_in',
          channel: 'customer',
          items: cart.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            notes: '',
          })),
        },
        { auth: false },
      )

      localStorage.setItem(LAST_ORDER_CODE_KEY, order.order_code)

      const storedHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]')
      const nextHistory = [
        {
          order_code: order.order_code,
          status: order.status,
          total_amount: order.total_amount,
          created_at: order.created_at,
          table_name: order.table_name,
          items: order.items || [],
          restaurant_name: restaurant?.name || '',
        },
        ...storedHistory.filter((entry) => entry.order_code !== order.order_code),
      ].slice(0, 10)
      localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(nextHistory))

      setSubmittedOrder(order)
      setShowCart(false)
      setShowOrderSuccess(true)
      setCart([])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const resetOrder = () => {
    setShowOrderSuccess(false)
    if (submittedOrder?.order_code) {
      navigate(`/order/status?code=${submittedOrder.order_code}`)
      return
    }

    window.location.reload()
  }

  const goToOrderTracking = () => {
    setShowSidebar(false)
    const orderCode = submittedOrder?.order_code || localStorage.getItem(LAST_ORDER_CODE_KEY) || ''
    navigate(orderCode ? `/order/status?code=${orderCode}` : '/order/status')
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
          <section className="relative bg-white pb-4">
            <div className="h-48 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <img src={bannerImage} alt={`${restaurantInfo.name} banner`} className="w-full h-full object-cover" />

              <div className="absolute top-4 left-4 z-20">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center gap-2">
                  <i className={`fa-solid fa-circle text-[8px] ${isOpen ? 'text-green-400 animate-pulse' : 'text-red-400'}`}></i>
                  {restaurantInfo.openStatus}
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 flex gap-3">
                <button type="button" onClick={() => setIsFavorite((prev) => !prev)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-white text-accent shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`} aria-label="Favorit">
                  <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-xs`}></i>
                </button>
                <button type="button" onClick={() => setShowSidebar(true)} className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Buka menu samping">
                  <i className="fa-solid fa-bars text-sm"></i>
                </button>
              </div>
            </div>

            <div className="px-5 relative z-20 -mt-12 pb-4">
              <div className="flex items-end justify-between">
                <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-lg">
                  <img src={logoImage} alt={`${restaurantInfo.name} logo`} className="w-full h-full object-cover rounded-xl bg-gray-100" />
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-xl">
                  <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                  <span className="text-xs font-bold text-yellow-700">{isOpen ? 'Open' : 'Closed'}</span>
                </div>
              </div>

              <div className="mt-3">
                <h1 className="text-2xl font-extrabold text-dark leading-tight">{restaurantInfo.name}</h1>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{restaurantInfo.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-primary/40"></i>
                    {restaurantInfo.address}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-clock text-primary/40"></i>
                    {restaurantInfo.businessHours}
                  </span>
                  <span className="flex items-center gap-1.5 bg-primary/5 text-primary px-2 py-0.5 rounded border border-primary/10">
                    <i className="fa-solid fa-chair"></i>
                    {tableName}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <header className="sticky top-0 z-40 bg-[#F7F5F2] pt-2 border-b border-gray-200/70 backdrop-blur-md">
            <div className="px-5 space-y-3 pb-3">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari menu favoritmu..." className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-sm" />
              </div>

              <div className="overflow-x-auto no-scrollbar flex gap-2 pb-1">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id
                  return (
                    <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`cat-btn px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${isActive ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white text-gray-500 border-gray-200'}`}>
                      {category.icon ? <i className={`${category.icon} text-xs`}></i> : null}
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          <main className="px-5 pt-4 pb-28 md:pb-36 grid grid-cols-1 gap-4" id="menu-container">
            {loading ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">Memuat menu restoran...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-600 text-sm py-12 bg-red-50 rounded-2xl border border-dashed border-red-200">{error}</div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">Menu tidak ditemukan untuk pencarian atau kategori ini.</div>
            ) : (
              filteredItems.map((item) => {
                const qty = getItemQuantity(item.id)
                return (
                  <div key={item.id} className="bg-white p-3 rounded-2xl shadow-card border border-gray-50 flex gap-3 relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                      <img src={item.image_url || DEFAULT_BANNER} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-dark text-base line-clamp-1">{item.name}</h3>
                        {item.is_featured ? <i className="fa-solid fa-fire text-orange-500 text-xs animate-pulse" title="Populer"></i> : null}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-tight line-clamp-2 mt-1 mb-auto">{item.description || 'Menu favorit restoran ini.'}</p>

                      <div className="flex justify-between items-end mt-3">
                        <span className="font-extrabold text-dark text-sm">{formatCurrency(getUnitPrice(item))}</span>
                        {qty === 0 ? (
                          <button type="button" onClick={() => addToCart(item)} disabled={!item.in_stock} className="w-9 h-9 rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100 disabled:hover:text-primary">
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-primary text-white rounded-full px-2 py-1 shadow-md">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                              <i className="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-100">
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

      <div className={`fixed inset-0 z-[70] transition-all duration-300 ${showSidebar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showSidebar ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowSidebar(false)}></div>
        <div className={`absolute top-0 right-0 w-72 max-w-full h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 bg-primary text-white relative">
            <button type="button" onClick={() => setShowSidebar(false)} className="absolute top-4 right-4 text-white/70 hover:text-white" aria-label="Tutup menu samping">
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
              <button type="button" onClick={goToRegister} className="w-full flex items-center gap-4 px-6 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                <i className="fa-solid fa-user-plus w-5 text-center"></i>
                <span className="font-bold text-sm">Daftar / Login</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {totalItems > 0 ? (
        <div className="fixed bottom-4 left-4 right-4 z-40 slide-up">
          <div className="bg-primary text-white rounded-2xl p-4 shadow-floating flex justify-between items-center cursor-pointer" onClick={() => setShowCart(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">{totalItems}</div>
              <div className="flex flex-col">
                <span className="text-xs text-green-100">Total Pembayaran</span>
                <span className="font-bold text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm bg-accent px-4 py-2 rounded-xl hover:bg-[#d06a50] transition-colors">Lihat Pesanan <i className="fa-solid fa-chevron-right"></i></div>
          </div>
        </div>
      ) : null}

      {showCart ? (
        <div id="cart-modal" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}></div>
          <div className="absolute bottom-0 w-full bg-[#F7F5F2] rounded-t-[2rem] shadow-2xl h-[85vh] flex flex-col slide-up">
            <div className="w-full flex justify-center pt-4 pb-2" onClick={() => setShowCart(false)}>
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">Pesanan Anda</h2>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-10">Keranjang kosong</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-4 last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image_url || DEFAULT_BANNER} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-dark text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{formatCurrency(getUnitPrice(item))} / porsi</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-[#F7F5F2] rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white text-gray-500 rounded flex items-center justify-center shadow-sm hover:text-primary">
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="font-bold text-dark text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-primary text-white rounded flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                        <span className="font-bold text-primary text-sm">{formatCurrency(getUnitPrice(item) * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white p-6 rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Pajak & Layanan (10%)</span>
                  <span className="font-bold text-dark">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-primary">Total</span>
                  <span className="font-extrabold text-accent">{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleOrder} disabled={isSubmittingOrder} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all flex justify-center items-center gap-2 disabled:opacity-70">
                <i className={`fa-solid ${isSubmittingOrder ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i> {isSubmittingOrder ? 'Mengirim Pesanan...' : 'Pesan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showOrderSuccess ? (
        <div id="success-view" className="fixed inset-0 z-[60] bg-primary flex flex-col items-center justify-center p-6 text-center text-white fade-in">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <i className="fa-solid fa-check text-4xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold mb-2">Pesanan Diterima!</h2>
          <p className="text-green-100 mb-4 max-w-xs mx-auto">Mohon tunggu sebentar, pesanan Anda sedang disiapkan oleh dapur.</p>
          {submittedOrder?.order_code ? <p className="text-sm font-mono font-bold text-white/90 mb-4">{submittedOrder.order_code}</p> : null}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full max-w-xs border border-white/10">
            <p className="text-xs text-green-200 uppercase font-bold mb-1">Estimasi Waktu</p>
            <p className="text-2xl font-bold">15 - 20 Menit</p>
          </div>
          <button onClick={resetOrder} className="mt-10 px-8 py-3 border border-white/30 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">Lihat Status Pesanan</button>
        </div>
      ) : null}
    </div>
  )
}
