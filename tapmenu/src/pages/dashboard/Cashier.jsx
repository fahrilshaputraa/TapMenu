import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Banknote,
  QrCode,
  X,
  Check,
  Printer,
  ShoppingBasket,
  StickyNote,
  Store
} from 'lucide-react'

import { api } from '../../services/api'
import { getStoredAuth } from '../../services/auth'

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'

export function Cashier() {
  const { user } = getStoredAuth() || {}

  // Backend state
  const [categories, setCategories] = useState([{ id: 'all', name: 'Semua' }])
  const [menuItems, setMenuItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taxRate, setTaxRate] = useState(10)
  const [restaurantName, setRestaurantName] = useState('TapMenu Kasir')
  const [restaurantAddress, setRestaurantAddress] = useState('')

  // Cashier Lock state
  const [isPosOpen, setIsPosOpen] = useState(false)
  const [cashierId, setCashierId] = useState(user?.employee_code || user?.full_name || 'Owner/Admin')
  const [pin, setPin] = useState('')
  const [loginError, setLoginError] = useState('')

  // POS state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [orderType, setOrderType] = useState('dine_in')
  const [orderNumber, setOrderNumber] = useState('')

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showAddOnModal, setShowAddOnModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [currentNoteItem, setCurrentNoteItem] = useState(null)
  const [noteInput, setNoteInput] = useState('')

  // Get current date
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })



  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [catsRes, itemsRes, meRes] = await Promise.all([
          api.get('/api/v1/catalogs/categories/'),
          api.get('/api/v1/catalogs/items/'),
          api.get('/api/v1/restaurants/me/')
        ])
        if (!active) return

        const loadedCats = Array.isArray(catsRes?.results) ? catsRes.results : (catsRes || [])
        const loadedItems = Array.isArray(itemsRes?.results) ? itemsRes.results : (itemsRes || [])
        
        setCategories([{ id: 'all', name: 'Semua' }, ...loadedCats.map(c => ({ id: String(c.id), name: c.name }))])
        setMenuItems(loadedItems)
        if (meRes) {
           setTaxRate(Number(meRes.tax_rate || 0))
           setRestaurantName(meRes.name || 'TapMenu Kasir')
           setRestaurantAddress(meRes.address || 'Bandung')
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadData()
    return () => { active = false }
  }, [])

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && String(item.category) !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // getAddOnDetails converts simple variant selection (selectedAddOns) back to option objects
  const getAddOnDetails = (selectedOptionsArr) => {
    // Array of { groupName, optionName, price }
    return selectedOptionsArr || []
  }

  const calculateAddOnsPrice = (selectedOptionsArr) => {
    return (selectedOptionsArr || []).reduce((sum, opt) => sum + (Number(opt.price) || 0), 0)
  }

  const toggleAddOn = (groupName, optionId, optionName, optionPrice) => {
    setSelectedAddOns(prev => {
      // Remove any existing option from the same group
      const filtered = prev.filter(opt => opt.groupName !== groupName)
      // Toggle off if they clicked the exact same option
      const exists = prev.find(opt => opt.groupName === groupName && opt.optionName === optionName)
      if (exists) return filtered
      
      // Select the new option
      return [...filtered, { groupName, optionId, optionName, price: optionPrice }]
    })
  }

  const handleItemClick = (item) => {
    if (!item.in_stock) return

    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item)
      setSelectedAddOns([])
      setShowAddOnModal(true)
    } else {
      addToCartDirect(item, [])
    }
  }

  const addToCartDirect = (item, itemAddOns) => {
    // Unique ID generation per precise variant configurations
    const addOnHash = itemAddOns.map(o => o.optionName).sort().join('-')
    const cartItemId = `${item.id}-${addOnHash}`
    const existingItem = cart.find(cartItem => cartItem.cartItemId === cartItemId)
    const effectivePrice = Number(item.effective_price ?? item.price ?? 0)

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.cartItemId === cartItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, {
        ...item,
        price: effectivePrice,
        cartItemId,
        selectedAddOns: itemAddOns,
        quantity: 1,
        note: ''
      }])
    }
  }

  const addFromModal = () => {
    if (selectedItem) {
      addToCartDirect(selectedItem, selectedAddOns)
      setShowAddOnModal(false)
      setSelectedItem(null)
      setSelectedAddOns([])
    }
  }

  const updateQuantity = (cartItemId, delta) => {
    setCart(cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = item.quantity + delta
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId))
  }

  const openNoteModal = (item) => {
    setCurrentNoteItem(item)
    setNoteInput(item.note || '')
    setShowNoteModal(true)
  }

  const saveNote = () => {
    if (currentNoteItem) {
      setCart(cart.map(item =>
        item.cartItemId === currentNoteItem.cartItemId
          ? { ...item, note: noteInput }
          : item
      ))
    }
    setShowNoteModal(false)
    setCurrentNoteItem(null)
    setNoteInput('')
  }

  const subtotal = cart.reduce((sum, item) => {
    const addOnsPrice = calculateAddOnsPrice(item.selectedAddOns || [])
    return sum + ((item.price + addOnsPrice) * item.quantity)
  }, 0)
  const tax = Math.round(subtotal * (taxRate / 100))
  const total = subtotal + tax

  const handlePayment = () => {
    if (cart.length === 0) return
    setShowPaymentModal(true)
  }

  const processPayment = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
       // Assemble correct variants list payload logic
       const orderItems = cart.map(item => {
          let assembledVariants = ''
          if (item.selectedAddOns && item.selectedAddOns.length > 0) {
             assembledVariants = item.selectedAddOns.map(o => `${o.groupName}: ${o.optionName}`).join(', ')
          }
           
          return {
             menu_item_id: item.id,
             quantity: item.quantity,
             notes: item.note ? `${item.note}${assembledVariants ? ' | ' + assembledVariants : ''}` : assembledVariants
          }
       })

       const orderPayload = await api.post('/api/v1/orders/', {
           order_type: orderType,
           items: orderItems,
       })

       setOrderNumber(orderPayload.order_code)
       setShowPaymentModal(false)
       setShowSuccessModal(true)
    } catch (err) {
       console.error(err)
       alert('Gagal memproses pesanan. Pastikan koneksi stabil.')
    } finally {
       setIsSubmitting(false)
    }
  }

  const resetOrder = () => {
    setCart([])
    setCashReceived('')
    setShowSuccessModal(false)
    setOrderNumber('')
  }

  const clearCart = () => {
    setCart([])
  }

  const setCashInput = (amount) => {
    if (amount === 'exact') {
      setCashReceived(String(total))
    } else {
      setCashReceived(String(amount))
    }
  }

  const change = cashReceived ? parseInt(cashReceived) - total : 0

  const enterPos = () => {
    // For now, simple validation or hook this to `loginCashier(cashierId, pin)` if you want an explicit backend token refresh
    if (pin.length >= 4) {
      setIsPosOpen(true)
      setLoginError('')
    } else {
      setLoginError('PIN Anda salah atau kurang dari 4 digit.')
    }
  }

  // Login View
  if (!isPosOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
          <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary mb-2">Login Kasir</h1>
          <p className="text-dark/60 mb-8 text-sm">Akses Terminal Kasir</p>

          <div className="space-y-4">
            <div className="text-left">
              <label className="text-xs font-semibold text-dark/60 mb-1 block">Profil Login</label>
              <input
                type="text"
                value={cashierId}
                disabled
                className="w-full bg-dark/5 border border-dark/10 rounded-xl px-4 py-3 text-sm font-bold text-dark/50 focus:outline-none cursor-not-allowed"
              />
            </div>
            <div className="text-left">
              <label className="text-xs font-semibold text-dark/60 mb-1 block">PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-bg border border-dark/20 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••"
              />
            </div>
            {loginError && (
              <p className="text-sm text-accent font-semibold text-left">{loginError}</p>
            )}
            <button
              onClick={enterPos}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all transform active:scale-[0.98]"
            >
              Buka Kasir
            </button>
          </div>
        </div>
      </div>
    )
  }

  // POS View
  return (
    <div className="fixed inset-0 flex h-screen bg-bg print:bg-white print:h-auto print:block">
      {/* LEFT PANEL: MENU GRID */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-dark/10 relative print:hidden">

        {/* POS Header */}
        <header className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-20 shrink-0">
          <div>
            <h2 className="font-bold text-lg text-dark">Menu Pesanan</h2>
            <p className="text-xs text-dark/50">{currentDate} • Shift 1 (Kasir)</p>
          </div>
          <div className="flex items-center gap-1 bg-bg rounded-lg p-1">
            <button
              onClick={() => setOrderType('dine-in')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                orderType === 'dine-in'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-dark/50 hover:bg-white/50'
              }`}
            >
              Dine In
            </button>
            <button
              onClick={() => setOrderType('take-away')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                orderType === 'take-away'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-dark/50 hover:bg-white/50'
              }`}
            >
              Take Away
            </button>
            <button
              onClick={() => setOrderType('online')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                orderType === 'online'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-dark/50 hover:bg-white/50'
              }`}
            >
              Online
            </button>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="px-6 pt-4 pb-2 flex gap-3 overflow-x-auto shrink-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-dark/50 border border-dark/10 hover:border-primary hover:text-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder="Cari menu (Ketik 'Nasi' atau kode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-dark/10 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>
        </div>

        {/* Menu Grid Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-bg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={!item.stock}
                className={`bg-white p-3 rounded-xl border border-dark/5 shadow-sm text-left transition-all group h-full flex flex-col ${
                  item.stock
                    ? 'cursor-pointer hover:border-primary hover:shadow-md'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="h-32 bg-bg rounded-lg overflow-hidden mb-3 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-primary shadow-sm">
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                  {!item.stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-accent px-2 py-1 rounded">Habis</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-dark text-sm leading-tight mb-1 line-clamp-2 flex-1">
                  {item.name}
                </h3>
                <p className="text-xs text-dark/40 truncate mb-0">
                  {item.categoryName}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CART / TRANSACTION */}
      <div className="w-[400px] bg-white flex flex-col h-full shadow-xl z-30 shrink-0 print:hidden">

        {/* Cart Header */}
        <div className="p-5 border-b border-dark/5 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-primary">Pesanan {orderNumber}</h3>
            <p className="text-xs text-dark/50">Pelanggan Umum</p>
          </div>
          <button
            onClick={clearCart}
            className="w-8 h-8 rounded-lg bg-bg text-accent hover:bg-accent/10 transition-colors flex items-center justify-center"
            title="Reset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-dark/30 space-y-3">
              <ShoppingBasket className="w-12 h-12" />
              <p className="text-sm font-medium">Belum ada item</p>
            </div>
          ) : (
            cart.map((item) => {
              const addOnsPrice = calculateAddOnsPrice(item.selectedAddOns || [])
              const itemTotal = (item.price + addOnsPrice) * item.quantity
              return (
                <div key={item.cartItemId} className="p-4 bg-bg rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-dark">
                        {item.name}
                      </h4>
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-xs text-dark/50 mt-0.5">
                          + {getAddOnDetails(item.selectedAddOns).map(a => a.name).join(', ')}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-xs text-accent mt-0.5 italic">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openNoteModal(item)}
                        className="p-1.5 text-dark/40 hover:text-accent hover:bg-accent/10 rounded transition-colors"
                        title="Tambah catatan"
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-dark/40 hover:text-accent hover:bg-accent/10 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-dark/10 text-dark/60 hover:border-primary hover:text-primary flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-6 text-center text-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-dark/10 text-dark/60 hover:border-primary hover:text-primary flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-dark">
                      Rp {itemTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Calculation Area */}
        <div className="bg-bg p-5 border-t border-dark/10 space-y-3">
          <div className="flex justify-between text-sm text-dark/50">
            <span>Subtotal</span>
            <span className="font-bold text-dark">Rp {subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-sm text-dark/50">
            <span>Pajak (10%)</span>
            <span className="font-bold text-dark">Rp {tax.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-xl font-extrabold text-primary pt-3 border-t border-dashed border-dark/20">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 bg-white border-t border-dark/5">
          <button
            onClick={handlePayment}
            disabled={cart.length === 0}
            className={`w-full py-4 font-bold rounded-xl transition-all flex justify-center items-center gap-2 ${
              cart.length === 0
                ? 'bg-dark/10 text-dark/30 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 shadow-lg'
            }`}
          >
            <Banknote className="w-5 h-5" />
            Bayar Sekarang
          </button>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-dark">Catatan Pesanan</h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-dark/40 hover:text-dark"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-dark/50 mb-2">Contoh: Pedas, Tanpa Bawang, Es Sedikit</p>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              rows={3}
              className="w-full bg-bg border border-dark/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              placeholder="Tulis catatan di sini..."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-2.5 bg-bg text-dark/50 font-bold rounded-xl hover:bg-dark/10 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={saveNote}
                className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden slide-up">
            {/* Header */}
            <div className="bg-primary p-6 text-center text-white relative">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-sm text-secondary mb-1">Total Tagihan</p>
              <h2 className="text-4xl font-extrabold">Rp {total.toLocaleString('id-ID')}</h2>
            </div>

            <div className="p-6">
              {/* Payment Method */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-primary bg-secondary text-primary'
                      : 'border-dark/10 text-dark/50 hover:bg-bg'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  Tunai
                </button>
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-colors ${
                    paymentMethod === 'qris'
                      ? 'border-primary bg-secondary text-primary'
                      : 'border-dark/10 text-dark/50 hover:bg-bg'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  QRIS
                </button>
              </div>

              {/* Cash Input Area */}
              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-xs font-bold text-dark/50 uppercase mb-2">
                    Uang Diterima
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-dark/40">Rp</span>
                    <input
                      type="number"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-full bg-bg border border-dark/10 rounded-xl pl-12 pr-4 py-3 font-bold text-lg text-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>

                  {/* Quick Money Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <button
                      onClick={() => setCashInput('exact')}
                      className="py-2 bg-secondary text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Uang Pas
                    </button>
                    <button
                      onClick={() => setCashInput(20000)}
                      className="py-2 bg-white border border-dark/10 text-dark/60 text-xs font-bold rounded-lg hover:bg-bg transition-colors"
                    >
                      20rb
                    </button>
                    <button
                      onClick={() => setCashInput(50000)}
                      className="py-2 bg-white border border-dark/10 text-dark/60 text-xs font-bold rounded-lg hover:bg-bg transition-colors"
                    >
                      50rb
                    </button>
                    <button
                      onClick={() => setCashInput(100000)}
                      className="py-2 bg-white border border-dark/10 text-dark/60 text-xs font-bold rounded-lg hover:bg-bg transition-colors"
                    >
                      100rb
                    </button>
                  </div>

                  <div className="bg-bg p-4 rounded-xl flex justify-between items-center border border-dark/5">
                    <span className="text-sm font-bold text-dark/50">Kembalian</span>
                    <span className={`text-xl font-bold ${change >= 0 ? 'text-accent' : 'text-accent'}`}>
                      Rp {change >= 0 ? change.toLocaleString('id-ID') : 0}
                    </span>
                  </div>
                  {cashReceived && change < 0 && (
                    <p className="mt-2 text-xs text-accent text-center">Uang tidak cukup</p>
                  )}
                </div>
              )}

              {/* QRIS Area */}
              {paymentMethod === 'qris' && (
                <div className="text-center py-4">
                  <div className="w-48 h-48 bg-bg mx-auto rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-dark/30" />
                  </div>
                  <p className="text-sm text-dark/50 animate-pulse">Menunggu pembayaran...</p>
                </div>
              )}

              <button
                onClick={processPayment}
                disabled={paymentMethod === 'cash' && change < 0}
                className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selesaikan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt/Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 fade-in print:static print:bg-white print:p-0 print:block">
          <div className="bg-white w-full max-w-xs rounded-lg shadow-2xl p-6 relative font-mono text-sm print:max-w-none print:shadow-none print:w-[80mm] print:mx-auto print:p-0">

            <div className="text-center mb-4">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-secondary rounded-full print:hidden">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-bold text-xl uppercase text-dark">{restaurantName}</h2>
              <p className="text-xs text-dark/50">{restaurantAddress}</p>
            </div>

            <div className="border-b-2 border-dashed border-dark/20 pb-2 mb-2">
              <div className="flex justify-between text-xs text-dark/50">
                <span>{orderNumber}</span>
                <span>{new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
              <div className="flex justify-between text-xs text-dark/50">
                <span>Kasir</span>
                <span>{paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}</span>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              {cart.map((item) => {
                const addOnsPrice = calculateAddOnsPrice(item.selectedAddOns || [])
                const itemTotal = (item.price + addOnsPrice) * item.quantity
                return (
                  <div key={item.cartItemId} className="flex justify-between text-xs">
                    <span className="text-dark/60">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-dark font-medium">
                      {itemTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="border-t-2 border-dashed border-dark/20 pt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-dark/50">Total</span>
                <span className="font-bold text-base text-dark">Rp {total.toLocaleString('id-ID')}</span>
              </div>
              {paymentMethod === 'cash' && (
                <>
                  <div className="flex justify-between text-dark/50">
                    <span>Tunai</span>
                    <span>Rp {parseInt(cashReceived).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-dark/50">
                    <span>Kembali</span>
                    <span>Rp {change.toLocaleString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs mb-4 text-dark/50">*** TERIMA KASIH ***</p>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={resetOrder}
                  className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90"
                >
                  Pesanan Baru
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 border border-dark/20 text-dark text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-bg"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add-On Modal */}
      {showAddOnModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl slide-up">
            <div className="flex items-center justify-between p-4 border-b border-dark/10">
              <div>
                <h3 className="text-lg font-semibold text-dark">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-primary">
                  Rp {selectedItem.price.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddOnModal(false)
                  setSelectedItem(null)
                  setSelectedAddOns([])
                }}
                className="p-1 rounded-lg text-dark/50 hover:text-dark hover:bg-bg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-medium text-dark/70 mb-3">
                Pilih Add-ons
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedItem.addOns.map((addOnId) => {
                  const addOn = addOns.find(a => a.id === addOnId)
                  if (!addOn) return null
                  return (
                    <label
                      key={addOnId}
                      className="flex items-center justify-between p-3 bg-bg rounded-lg cursor-pointer hover:bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOnId)}
                          onChange={() => toggleAddOn(addOnId)}
                          className="w-4 h-4 text-primary bg-white border-dark/20 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-dark">
                          {addOn.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        +Rp {addOn.price.toLocaleString('id-ID')}
                      </span>
                    </label>
                  )
                })}
              </div>

              {selectedAddOns.length > 0 && (
                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary">Total Add-ons</span>
                    <span className="font-medium text-primary">
                      +Rp {calculateAddOnsPrice(selectedAddOns).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-dark/10">
              <button
                onClick={addFromModal}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Tambah ke Keranjang - Rp {(selectedItem.price + calculateAddOnsPrice(selectedAddOns)).toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
