import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import {
  confirmCustomerPayment,
  createCustomerOrderCheckout,
  loadCustomerMenu,
  submitCustomerOrder,
} from '../../services/customerMenu'
import {
  buildCustomerMenuCategories,
  buildCustomerPaymentQrUrl,
  buildCustomerRestaurantInfo,
  DEFAULT_CUSTOMER_BANNER,
  DEFAULT_CUSTOMER_LOGO,
  filterCustomerMenuItems,
  formatCustomerMenuCurrency,
  getCustomerCartItemQuantity,
  getCustomerCartSummary,
  getCustomerMenuFontFamily,
  getCustomerMenuPatternStyle,
  getCustomerMenuShadowClass,
  getCustomerMenuTitleFontFamily,
  getCustomerMenuUnitPrice,
  getRestaurantOpenState,
  LAST_ORDER_CODE_KEY,
  persistCustomerOrderHistory,
  addCustomerItemToCart,
  updateCustomerCartQuantity,
} from '../../utils/customerMenu'

export function CustomerMenu() {
  const { tableId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderSuccess, setShowOrderSuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [error, setError] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [menuPayload, setMenuPayload] = useState(null)
  const [submittedOrder, setSubmittedOrder] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [paymentTransaction, setPaymentTransaction] = useState(null)

  const tableToken = searchParams.get('table') || tableId || ''
  const restaurantId = searchParams.get('restaurant') || ''

  useEffect(() => {
    let active = true

    async function loadMenu() {
      try {
        const result = await loadCustomerMenu({ tableToken, restaurantId })
        if (result.redirectRestaurantId) {
          navigate(`/order?restaurant=${result.redirectRestaurantId}`, { replace: true })
          return
        }
        if (!active) return

        setMenuPayload(result.payload)
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
  }, [navigate, restaurantId, tableToken])

  const restaurant = menuPayload?.restaurant
  const table = menuPayload?.table
  const menuItems = useMemo(() => menuPayload?.items || [], [menuPayload?.items])
  const categories = useMemo(() => buildCustomerMenuCategories(menuPayload?.categories || []), [menuPayload?.categories])
  const isOpen = useMemo(() => getRestaurantOpenState(restaurant), [restaurant])
  const restaurantInfo = useMemo(() => buildCustomerRestaurantInfo(restaurant, isOpen), [restaurant, isOpen])

  const tableName = table?.name || (tableId ? `Meja ${tableId}` : 'Bawa Pulang')
  const bannerImage = restaurantInfo.banner || DEFAULT_CUSTOMER_BANNER
  const logoImage = restaurantInfo.logo || DEFAULT_CUSTOMER_LOGO
  const appearance = restaurantInfo.appearance || {}
  const primaryColor = appearance.primaryColor || '#1B4332'
  const accentColor = appearance.accentColor || '#E07A5F'
  const fontFamily = getCustomerMenuFontFamily(appearance.fontStyle)
  const titleFontFamily = getCustomerMenuTitleFontFamily(appearance.fontStyle)
  const patternStyle = useMemo(
    () => getCustomerMenuPatternStyle(appearance.bgPattern, appearance.bgColor || '#F7F5F2'),
    [appearance.bgColor, appearance.bgPattern],
  )
  const cardShadowClass = getCustomerMenuShadowClass(appearance.cardShadow)
  const menuLayoutClass = appearance.layoutStyle === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'
    : 'grid grid-cols-1 gap-4'
  const headerTextClass = appearance.headerStyle === 'center' ? 'text-center' : 'text-left'
  const headerMetaClass = appearance.headerStyle === 'center'
    ? 'flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider'
    : 'flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider'
  const cardRadiusStyle = { borderRadius: `${appearance.cardRadius || 12}px` }
  const searchRadiusStyle = { borderRadius: `${Math.max((appearance.cardRadius || 12) - 2, 8)}px` }
  const categoryRadiusStyle = { borderRadius: `${Math.max((appearance.cardRadius || 12) + 8, 16)}px` }
  const pillRadiusStyle = { borderRadius: `${Math.max((appearance.cardRadius || 12) + 8, 16)}px` }
  const addButtonStyle =
    appearance.buttonStyle === 'square'
      ? 'rounded-xl'
      : appearance.buttonStyle === 'pill'
        ? 'rounded-full px-3 w-auto min-w-[92px]'
        : 'rounded-full'
  const filteredItems = useMemo(() => filterCustomerMenuItems(menuItems, selectedCategory, searchQuery), [menuItems, searchQuery, selectedCategory])
  const { totalItems, subtotal, tax, total } = useMemo(() => getCustomerCartSummary(cart, submittedOrder), [cart, submittedOrder])
  const qrisPayload = paymentTransaction?.qr_string || paymentTransaction?.payment_url || ''
  const qrisQrUrl = useMemo(() => buildCustomerPaymentQrUrl(qrisPayload), [qrisPayload])
  const isAwaitingQrisConfirmation = paymentMethod === 'qris' && Boolean(submittedOrder && paymentTransaction)
  const availablePaymentMethods = useMemo(() => {
    const methods = []
    if (restaurant?.cash_enabled) methods.push('cash')
    if (restaurant?.qris_enabled) methods.push('qris')
    return methods.length > 0 ? methods : ['qris']
  }, [restaurant?.cash_enabled, restaurant?.qris_enabled])

  useEffect(() => {
    if (availablePaymentMethods.includes(paymentMethod)) return
    setPaymentMethod(availablePaymentMethods[0])
  }, [availablePaymentMethods, paymentMethod])

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
      const order = await submitCustomerOrder({ tableToken, cart })
      persistCustomerOrderHistory(order, restaurant?.name || '')

      setSubmittedOrder(order)
      setShowCart(false)
      setCart([])
      setPaymentTransaction(null)
      setPaymentError('')

      if (availablePaymentMethods.length > 0) {
        setShowPaymentModal(true)
      } else {
        setShowOrderSuccess(true)
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const handleProcessPayment = async () => {
    if (!submittedOrder?.id || isProcessingPayment) return

    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      if (paymentMethod === 'qris' && paymentTransaction) {
        const confirmed = await confirmCustomerPayment(submittedOrder.id)
        setPaymentTransaction(confirmed)
        setShowPaymentModal(false)
        setShowOrderSuccess(true)
        return
      }

      const transaction = await createCustomerOrderCheckout(submittedOrder.id, paymentMethod)
      setPaymentTransaction(transaction)

      if (paymentMethod === 'cash') {
        setShowPaymentModal(false)
        setShowOrderSuccess(true)
      }
    } catch (requestError) {
      setPaymentError(requestError.message || 'Gagal memproses pembayaran.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const resetOrder = () => {
    setShowPaymentModal(false)
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
    <div id="app-view" className="h-screen fade-in flex flex-col overflow-hidden" style={{ ...patternStyle, fontFamily }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scroll">
          <section className={`relative pb-4 ${appearance.showBanner ? 'bg-white' : ''}`}>
            <div
              className={`w-full relative overflow-hidden ${appearance.showBanner ? 'h-48' : 'min-h-[220px]'}`}
              style={appearance.showBanner ? undefined : patternStyle}
            >
              {appearance.showBanner ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              ) : null}
              {appearance.showBanner ? (
                <img src={bannerImage} alt={`${restaurantInfo.name} banner`} className="w-full h-full object-cover" />
              ) : null}

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

            <div className={`px-5 relative z-20 ${appearance.showBanner && appearance.showProfile ? '-mt-12' : appearance.showBanner ? 'mt-0' : '-mt-16'} pb-4`}>
              <div className={`flex ${appearance.headerStyle === 'center' ? 'flex-col items-center text-center gap-3' : 'items-end justify-between'}`}>
                {appearance.showProfile ? (
                  <div className="bg-white p-1 shadow-lg" style={{ width: appearance.showBanner ? '80px' : '88px', height: appearance.showBanner ? '80px' : '88px', borderRadius: `${Math.max((appearance.cardRadius || 12) + 4, 16)}px` }}>
                    <img src={logoImage} alt={`${restaurantInfo.name} logo`} className="w-full h-full object-cover bg-gray-100" style={{ borderRadius: `${appearance.cardRadius || 12}px` }} />
                  </div>
                ) : null}
                <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-3 py-1 rounded-xl">
                  <i className="fa-solid fa-star text-yellow-500 text-xs"></i>
                  <span className="text-xs font-bold text-yellow-700">{isOpen ? 'Open' : 'Closed'}</span>
                </div>
              </div>

              <div className={`mt-3 ${headerTextClass}`}>
                <h1 className="text-2xl font-extrabold text-dark leading-tight" style={{ fontFamily: titleFontFamily, color: primaryColor }}>
                  {restaurantInfo.name}
                </h1>
                {appearance.showDescription ? (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{restaurantInfo.description}</p>
                ) : null}

                <div className={headerMetaClass}>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot" style={{ color: `${primaryColor}66` }}></i>
                    {restaurantInfo.address}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-clock" style={{ color: `${primaryColor}66` }}></i>
                    {restaurantInfo.businessHours}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 border" style={{ color: primaryColor, backgroundColor: `${primaryColor}0d`, borderColor: `${primaryColor}20`, borderRadius: `${Math.max((appearance.cardRadius || 12) - 2, 8)}px` }}>
                    <i className="fa-solid fa-chair"></i>
                    {tableName}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <header className="sticky top-0 z-40 pt-2 border-b border-gray-200/70 backdrop-blur-md" style={{ backgroundColor: `${appearance.bgColor || '#F7F5F2'}ee` }}>
            <div className="px-5 space-y-3 pb-3">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari menu favoritmu..." className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none shadow-sm" style={{ ...searchRadiusStyle, borderColor: '#e5e7eb' }} />
              </div>

              <div className={`overflow-x-auto no-scrollbar flex gap-2 pb-1 ${appearance.headerStyle === 'center' ? 'justify-center' : ''}`}>
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`cat-btn px-4 py-2 text-sm font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${isActive ? 'text-white shadow-lg' : 'bg-white text-gray-500 border-gray-200'}`}
                      style={{
                        ...categoryRadiusStyle,
                        backgroundColor: isActive ? primaryColor : '#ffffff',
                        borderColor: isActive ? primaryColor : '#e5e7eb',
                        boxShadow: isActive ? `0 10px 24px -12px ${primaryColor}` : undefined,
                      }}
                    >
                      {category.icon ? <i className={`${category.icon} text-xs`}></i> : null}
                      {category.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </header>

          <main className={`px-5 pt-4 pb-28 md:pb-36 ${menuLayoutClass}`} id="menu-container">
            {loading ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">Memuat menu restoran...</div>
            ) : error ? (
              <div className="col-span-full text-center text-red-600 text-sm py-12 bg-red-50 rounded-2xl border border-dashed border-red-200">{error}</div>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">Menu tidak ditemukan untuk pencarian atau kategori ini.</div>
            ) : (
              filteredItems.map((item) => {
                const qty = getCustomerCartItemQuantity(cart, item.id)
                return (
                  <div key={item.id} className={`bg-white p-3 border border-gray-50 relative ${cardShadowClass} ${appearance.layoutStyle === 'grid' ? 'flex flex-col h-full' : 'flex gap-3'}`} style={cardRadiusStyle}>
                    {appearance.showImages ? (
                      <div className={`${appearance.layoutStyle === 'grid' ? 'w-full h-36 mb-3' : 'w-24 h-24 shrink-0'} bg-gray-100 overflow-hidden`} style={{ borderRadius: `${Math.max((appearance.cardRadius || 12) - 2, 8)}px` }}>
                        <img src={item.image_url || DEFAULT_CUSTOMER_BANNER} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : null}

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-dark text-base line-clamp-1">{item.name}</h3>
                        {item.is_featured ? <i className="fa-solid fa-fire text-orange-500 text-xs animate-pulse" title="Populer"></i> : null}
                      </div>
                      {appearance.showDescription ? (
                        <p className="text-[11px] text-gray-500 leading-tight line-clamp-2 mt-1 mb-auto">{item.description || 'Menu favorit restoran ini.'}</p>
                      ) : (
                        <div className="mb-auto"></div>
                      )}

                      <div className="flex justify-between items-end mt-3">
                        <span className="font-extrabold text-dark text-sm">{formatCustomerMenuCurrency(getCustomerMenuUnitPrice(item))}</span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => setCart((current) => addCustomerItemToCart(current, item))}
                            disabled={!item.in_stock}
                            className={`${appearance.buttonStyle === 'pill' ? 'h-9 px-3 text-xs font-bold gap-1' : 'w-9 h-9'} ${addButtonStyle} bg-gray-100 hover:text-white flex items-center justify-center transition-colors shadow-sm border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-100`}
                            style={{ color: primaryColor }}
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                            {appearance.buttonStyle === 'pill' ? <span>Tambah</span> : null}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-white px-2 py-1 shadow-md" style={{ ...pillRadiusStyle, backgroundColor: primaryColor }}>
                            <button type="button" onClick={() => setCart((current) => updateCustomerCartQuantity(current, item.id, -1))} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                              <i className="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{qty}</span>
                            <button type="button" onClick={() => setCart((current) => updateCustomerCartQuantity(current, item.id, 1))} className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100" style={{ color: primaryColor }}>
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
          <div className="text-white p-4 shadow-floating flex justify-between items-center cursor-pointer" style={{ backgroundColor: primaryColor, borderRadius: `${Math.max((appearance.cardRadius || 12) + 8, 20)}px` }} onClick={() => setShowCart(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">{totalItems}</div>
              <div className="flex flex-col">
                <span className="text-xs text-green-100">Total Pembayaran</span>
                <span className="font-bold text-lg">{formatCustomerMenuCurrency(total)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-colors" style={{ backgroundColor: accentColor }}>Lihat Pesanan <i className="fa-solid fa-chevron-right"></i></div>
          </div>
        </div>
      ) : null}

      {showPaymentModal ? (
        <div className="fixed inset-0 z-[55]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
          <div className="absolute bottom-0 w-full bg-white rounded-t-[2rem] shadow-2xl max-h-[88vh] overflow-y-auto slide-up">
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 pb-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Pembayaran</p>
                <h2 className="text-xl font-bold text-primary">Selesaikan Pesanan</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {submittedOrder?.order_code ? (
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-primary/60">Kode Pesanan</p>
                  <p className="mt-1 font-mono font-bold text-primary">{submittedOrder.order_code}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                {availablePaymentMethods.includes('cash') ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                      <i className="fa-solid fa-money-bill-wave text-sm"></i>
                    </div>
                    <div className="font-bold">Tunai</div>
                    <div className={`text-xs mt-1 ${paymentMethod === 'cash' ? 'text-green-100' : 'text-gray-400'}`}>
                      Bayar di kasir
                    </div>
                  </button>
                ) : null}

                {availablePaymentMethods.includes('qris') ? (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      paymentMethod === 'qris'
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                      <i className="fa-solid fa-qrcode text-sm"></i>
                    </div>
                    <div className="font-bold">QRIS</div>
                    <div className={`text-xs mt-1 ${paymentMethod === 'qris' ? 'text-green-100' : 'text-gray-400'}`}>
                      Scan untuk bayar
                    </div>
                  </button>
                ) : null}
              </div>

              {paymentMethod === 'qris' ? (
                <div className="rounded-2xl border border-gray-100 bg-[#F7F5F2] p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    {isAwaitingQrisConfirmation ? 'Scan QR lalu konfirmasi setelah berhasil dibayar.' : 'Buat transaksi QRIS untuk menampilkan QR pembayaran.'}
                  </p>
                  {qrisQrUrl ? (
                    <div className="mt-4">
                      <img src={qrisQrUrl} alt="QR pembayaran QRIS" className="mx-auto h-56 w-56 rounded-2xl bg-white p-3 shadow-sm border border-gray-100" />
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-10 text-sm text-gray-400">
                      QR pembayaran akan muncul di sini.
                    </div>
                  )}
                  {paymentTransaction?.reference_id ? (
                    <p className="mt-3 text-xs font-mono text-gray-400">{paymentTransaction.reference_id}</p>
                  ) : null}
                  {paymentTransaction?.payment_url ? (
                    <a
                      href={paymentTransaction.payment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/15 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm"
                    >
                      Buka Halaman Pembayaran <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-[#F7F5F2] p-5">
                  <p className="text-sm font-bold text-dark">Pembayaran Tunai</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Gunakan opsi ini jika pelanggan akan membayar langsung ke kasir. Pesanan akan ditandai lunas setelah transaksi tunai dibuat.
                  </p>
                </div>
              )}

              {paymentError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {paymentError}
                </div>
              ) : null}
            </div>

            <div className="border-t border-gray-100 px-6 py-5 bg-white sticky bottom-0">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
              >
                <i
                  className={`fa-solid ${
                    isProcessingPayment
                      ? 'fa-spinner fa-spin'
                      : paymentMethod === 'qris' && paymentTransaction
                        ? 'fa-check'
                        : paymentMethod === 'qris'
                          ? 'fa-qrcode'
                          : 'fa-money-bill-wave'
                  }`}
                ></i>
                {isProcessingPayment
                  ? 'Memproses Pembayaran...'
                  : paymentMethod === 'qris' && paymentTransaction
                    ? 'Saya Sudah Bayar'
                    : paymentMethod === 'qris'
                      ? 'Tampilkan QR Pembayaran'
                      : 'Konfirmasi Bayar Tunai'}
              </button>
            </div>
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
                      <img src={item.image_url || DEFAULT_CUSTOMER_BANNER} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-dark text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{formatCustomerMenuCurrency(getCustomerMenuUnitPrice(item))} / porsi</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 bg-[#F7F5F2] rounded-lg p-1">
                          <button onClick={() => setCart((current) => updateCustomerCartQuantity(current, item.id, -1))} className="w-6 h-6 bg-white text-gray-500 rounded flex items-center justify-center shadow-sm hover:text-primary">
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="font-bold text-dark text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => setCart((current) => updateCustomerCartQuantity(current, item.id, 1))} className="w-6 h-6 bg-primary text-white rounded flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                        <span className="font-bold text-primary text-sm">{formatCustomerMenuCurrency(getCustomerMenuUnitPrice(item) * item.quantity)}</span>
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
                  <span className="font-bold text-dark">{formatCustomerMenuCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Pajak & Layanan (10%)</span>
                  <span className="font-bold text-dark">{formatCustomerMenuCurrency(tax)}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 my-2"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-primary">Total</span>
                  <span className="font-extrabold text-accent">{formatCustomerMenuCurrency(total)}</span>
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
          <p className="text-green-100 mb-4 max-w-xs mx-auto">
            {paymentMethod === 'cash'
              ? 'Pembayaran tunai tercatat. Mohon tunggu sebentar, pesanan Anda sedang disiapkan oleh dapur.'
              : 'Pembayaran berhasil diproses. Mohon tunggu sebentar, pesanan Anda sedang disiapkan oleh dapur.'}
          </p>
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
