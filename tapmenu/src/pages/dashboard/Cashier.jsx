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
  Store,
  ArrowLeft,
  LockKeyhole,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { useCashierCart } from '../../hooks/useCashierCart'
import { useCashierSession } from '../../hooks/useCashierSession'
import { loadCashierData } from '../../services/cashier'
import { calculateCashierAddOnsPrice, getCashierAddOnDetails } from '../../utils/cashiers'

export function Cashier() {
  const navigate = useNavigate()
  const {
    cashierId,
    enterPos,
    isPosOpen,
    isUnlockSubmitting,
    lockCashier,
    loginError,
    pin,
    requiresCashierUnlock,
    setPin,
  } = useCashierSession()

  // Backend state
  const [categories, setCategories] = useState([{ id: 'all', name: 'Semua' }])
  const [menuItems, setMenuItems] = useState([])
  const [taxRate, setTaxRate] = useState(10)
  const [restaurantName, setRestaurantName] = useState('TapMenu Kasir')
  const [restaurantAddress, setRestaurantAddress] = useState('')

  const [pageError, setPageError] = useState('')
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)

  const {
    addFromModal,
    cart,
    cashReceived,
    change,
    clearCart,
    closeAddOnModal,
    closeNoteModal,
    filteredItems,
    handleItemClick,
    handlePayment,
    isAwaitingQrisConfirmation,
    isPaymentSubmitting,
    noteInput,
    openNoteModal,
    orderNumber,
    orderType,
    paymentError,
    paymentMethod,
    paymentStatusLabel,
    paymentTransaction,
    processPayment,
    qrisQrUrl,
    removeFromCart,
    resetOrder,
    saveNote,
    searchQuery,
    selectedAddOns,
    selectedCategory,
    selectedItem,
    setCashInput,
    setCashReceived,
    setNoteInput,
    setOrderType,
    setPaymentMethod,
    setSearchQuery,
    setSelectedCategory,
    showAddOnModal,
    showNoteModal,
    showPaymentModal,
    showSuccessModal,
    setShowPaymentModal,
    setShowSuccessModal,
    subtotal,
    tax,
    toggleAddOn,
    total,
    updateQuantity,
  } = useCashierCart({ menuItems, taxRate })

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    let active = true

    async function loadData() {
      try {
        const { categories: loadedCategories, menuItems: loadedMenuItems, restaurant } = await loadCashierData()
        if (!active) return

        setCategories(loadedCategories)
        setMenuItems(loadedMenuItems)
        if (restaurant) {
          setTaxRate(Number(restaurant.tax_rate || 0))
          setRestaurantName(restaurant.name || 'TapMenu Kasir')
          setRestaurantAddress(restaurant.address || 'Bandung')
        }
        setPageError('')
      } catch (err) {
        if (active) setPageError(err.message || 'Gagal memuat data kasir.')
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  const leaveCashier = () => {
    setIsQuickMenuOpen(false)
    navigate('/dashboard', { replace: false })
  }

  const handleLockCashier = () => {
    setIsQuickMenuOpen(false)
    setShowPaymentModal(false)
    setShowSuccessModal(false)
    lockCashier()
  }

  // Login View
  if (!isPosOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-primary flex flex-col items-center justify-center p-6 text-center">
        <button
          onClick={leaveCashier}
          className="absolute top-6 left-6 inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Kembali ke dashboard"
          title="Kembali ke dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative">
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
              disabled={isUnlockSubmitting}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all transform active:scale-[0.98] disabled:opacity-70"
            >
              {isUnlockSubmitting ? 'Memverifikasi...' : 'Buka Kasir'}
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
          <div className="flex items-center gap-3">
            {requiresCashierUnlock ? (
              <button
                onClick={leaveCashier}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-dark/10 bg-white text-dark/60 hover:border-primary hover:text-primary transition-colors"
                aria-label="Kembali ke dashboard"
                title="Kembali ke dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : null}
            {requiresCashierUnlock ? (
              <div className="relative">
                <button
                  onClick={() => setIsQuickMenuOpen((current) => !current)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-dark/10 bg-white text-dark/60 hover:border-primary hover:text-primary transition-colors"
                  aria-label="Buka menu kasir"
                >
                  <i className="fa-solid fa-bars text-sm"></i>
                </button>
                {isQuickMenuOpen ? (
                  <div className="absolute left-0 top-full mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden z-30">
                    <button
                      onClick={leaveCashier}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 text-primary" />
                      Back to Dashboard
                    </button>
                    <button
                      onClick={handleLockCashier}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LockKeyhole className="w-4 h-4" />
                      Logout Kasir
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div>
              <h2 className="font-bold text-lg text-dark">Menu Pesanan</h2>
              <p className="text-xs text-dark/50">{currentDate} • Shift 1 (Kasir)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-bg rounded-lg p-1">
              <button
                onClick={() => setOrderType('dine_in')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  orderType === 'dine_in'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-dark/50 hover:bg-white/50'
                }`}
              >
                Dine In
              </button>
              <button
                onClick={() => setOrderType('take_away')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  orderType === 'take_away'
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
          </div>
        </header>

        {pageError ? (
          <div className="mx-6 mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {pageError}
          </div>
        ) : null}

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
                disabled={!item.in_stock}
                className={`bg-white p-3 rounded-xl border border-dark/5 shadow-sm text-left transition-all group h-full flex flex-col ${
                  item.in_stock
                    ? 'cursor-pointer hover:border-primary hover:shadow-md'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="h-32 bg-bg rounded-lg overflow-hidden mb-3 relative">
                  <img
                    src={item.image_url || 'https://placehold.co/320x240/F7F5F2/173D30?text=TapMenu'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-primary shadow-sm">
                    Rp {Number(item.effective_price ?? item.price ?? 0).toLocaleString('id-ID')}
                  </div>
                  {!item.in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-accent px-2 py-1 rounded">Habis</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-dark text-sm leading-tight mb-1 line-clamp-2 flex-1">
                  {item.name}
                </h3>
                <p className="text-xs text-dark/40 truncate mb-0">
                  {item.category_name}
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
              const addOnsPrice = calculateCashierAddOnsPrice(item.selectedAddOns || [])
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
                          + {getCashierAddOnDetails(item.selectedAddOns).map((option) => option.optionName).join(', ')}
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
                onClick={closeNoteModal}
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
                onClick={closeNoteModal}
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
                  <div className="w-48 h-48 bg-bg mx-auto rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-dark/10">
                    {qrisQrUrl ? (
                      <img src={qrisQrUrl} alt="QRIS" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-16 h-16 text-dark/30" />
                    )}
                  </div>
                  <p className="text-sm text-dark/50">
                    {isAwaitingQrisConfirmation ? 'Tampilkan QR ini ke pelanggan, lalu konfirmasi setelah pembayaran berhasil.' : 'Buat transaksi QRIS untuk menampilkan QR pembayaran.'}
                  </p>
                  {paymentTransaction?.reference_id ? (
                    <p className="mt-2 text-xs font-mono text-dark/40">{paymentTransaction.reference_id}</p>
                  ) : null}
                  {paymentTransaction?.payment_url ? (
                    <a
                      href={paymentTransaction.payment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs font-bold text-primary hover:underline"
                    >
                      Buka halaman pembayaran
                    </a>
                  ) : null}
                </div>
              )}

              {paymentError ? (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {paymentError}
                </div>
              ) : null}

              <button
                onClick={processPayment}
                disabled={isPaymentSubmitting || (paymentMethod === 'cash' && change < 0)}
                className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaymentSubmitting
                  ? 'Memproses...'
                  : isAwaitingQrisConfirmation
                    ? 'Konfirmasi Pembayaran'
                    : paymentMethod === 'qris'
                      ? 'Buat QRIS'
                      : 'Selesaikan Transaksi'}
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
                <span>{paymentStatusLabel}</span>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              {cart.map((item) => {
                const addOnsPrice = calculateCashierAddOnsPrice(item.selectedAddOns || [])
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
                    <span>Rp {Number(cashReceived || 0).toLocaleString('id-ID')}</span>
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
                  closeAddOnModal()
                }}
                className="p-1 rounded-lg text-dark/50 hover:text-dark hover:bg-bg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-medium text-dark/70 mb-3">
                Pilih Varian
              </h4>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {selectedItem.variants.map((group) => (
                  <div key={group.id || group.name} className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-dark/50">{group.name}</p>
                    {group.options?.map((option) => {
                      const optionName = option.name || 'Opsi'
                      const isChecked = selectedAddOns.some(
                        (entry) => entry.groupName === group.name && entry.optionName === optionName,
                      )

                      return (
                        <label
                          key={option.id || optionName}
                          className="flex items-center justify-between p-3 bg-bg rounded-lg cursor-pointer hover:bg-secondary/50"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type={group.type === 'checkbox' ? 'checkbox' : 'radio'}
                              name={group.name}
                              checked={isChecked}
                              onChange={() =>
                                toggleAddOn(
                                  group.name,
                                  option.id || optionName,
                                  optionName,
                                  Number(option.price) || 0,
                                  group.type,
                                )
                              }
                              className="w-4 h-4 text-primary bg-white border-dark/20 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-dark">
                              {optionName}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-primary">
                            +Rp {(Number(option.price) || 0).toLocaleString('id-ID')}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                ))}
              </div>

              {selectedAddOns.length > 0 && (
                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary">Total Add-ons</span>
                    <span className="font-medium text-primary">
                      +Rp {calculateCashierAddOnsPrice(selectedAddOns).toLocaleString('id-ID')}
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
                Tambah ke Keranjang - Rp {(selectedItem.price + calculateCashierAddOnsPrice(selectedAddOns)).toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
