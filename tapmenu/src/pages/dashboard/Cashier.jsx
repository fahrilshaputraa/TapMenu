import { useState } from 'react'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Receipt,
  X,
  Check,
  Printer
} from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const categories = [
  { id: 'all', name: 'Semua' },
  { id: 'food', name: 'Makanan' },
  { id: 'drink', name: 'Minuman' },
  { id: 'snack', name: 'Snack' },
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
  { id: 1, name: 'Nasi Goreng Spesial', category: 'food', price: 15000, stock: true, addOns: ['telur', 'keju', 'sambal', 'ayam'] },
  { id: 2, name: 'Ayam Bakar', category: 'food', price: 25000, stock: true, addOns: ['nasi', 'sambal', 'sayur'] },
  { id: 3, name: 'Mie Goreng', category: 'food', price: 12000, stock: true, addOns: ['telur', 'keju', 'sambal', 'ayam'] },
  { id: 4, name: 'Soto Ayam', category: 'food', price: 15000, stock: false, addOns: ['nasi', 'telur'] },
  { id: 5, name: 'Gado-gado', category: 'food', price: 12000, stock: true, addOns: ['telur', 'keju'] },
  { id: 6, name: 'Nasi Campur', category: 'food', price: 18000, stock: true, addOns: ['telur', 'sambal', 'ayam', 'sayur'] },
  { id: 7, name: 'Ayam Geprek', category: 'food', price: 16000, stock: true, addOns: ['nasi', 'keju', 'sambal', 'telur'] },
  { id: 8, name: 'Es Teh Manis', category: 'drink', price: 5000, stock: true, addOns: [] },
  { id: 9, name: 'Es Jeruk', category: 'drink', price: 6000, stock: true, addOns: [] },
  { id: 10, name: 'Jus Alpukat', category: 'drink', price: 10000, stock: true, addOns: ['keju'] },
  { id: 11, name: 'Kopi Hitam', category: 'drink', price: 5000, stock: true, addOns: [] },
  { id: 12, name: 'Es Cappuccino', category: 'drink', price: 12000, stock: true, addOns: [] },
  { id: 13, name: 'Kerupuk', category: 'snack', price: 3000, stock: true, addOns: [] },
  { id: 14, name: 'Tempe Goreng', category: 'snack', price: 5000, stock: true, addOns: ['sambal'] },
]

const tables = [
  { id: 1, name: 'Meja 1', status: 'available' },
  { id: 2, name: 'Meja 2', status: 'occupied' },
  { id: 3, name: 'Meja 3', status: 'available' },
  { id: 4, name: 'Meja 4', status: 'available' },
  { id: 5, name: 'Meja 5', status: 'available' },
  { id: 6, name: 'Meja 6', status: 'occupied' },
  { id: 7, name: 'Meja 7', status: 'available' },
  { id: 8, name: 'Meja 8', status: 'available' },
  { id: 9, name: 'Meja 9', status: 'available' },
  { id: 10, name: 'Meja 10', status: 'available' },
]

export function Cashier() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cashReceived, setCashReceived] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [showAddOnModal, setShowAddOnModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedAddOns, setSelectedAddOns] = useState([])

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getAddOnDetails = (addOnIds) => {
    return addOnIds.map(id => addOns.find(a => a.id === id)).filter(Boolean)
  }

  const calculateAddOnsPrice = (addOnIds) => {
    return addOnIds.reduce((sum, id) => {
      const addOn = addOns.find(a => a.id === id)
      return sum + (addOn ? addOn.price : 0)
    }, 0)
  }

  const toggleAddOn = (addOnId) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  const handleItemClick = (item) => {
    if (!item.stock) return

    if (item.addOns && item.addOns.length > 0) {
      setSelectedItem(item)
      setSelectedAddOns([])
      setShowAddOnModal(true)
    } else {
      addToCartDirect(item, [])
    }
  }

  const addToCartDirect = (item, itemAddOns) => {
    const cartItemId = `${item.id}-${itemAddOns.sort().join('-')}`
    const existingItem = cart.find(cartItem => cartItem.cartItemId === cartItemId)

    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.cartItemId === cartItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, {
        ...item,
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

  const updateItemNote = (cartItemId, note) => {
    setCart(cart.map(item =>
      item.cartItemId === cartItemId ? { ...item, note } : item
    ))
  }

  const subtotal = cart.reduce((sum, item) => {
    const addOnsPrice = calculateAddOnsPrice(item.selectedAddOns || [])
    return sum + ((item.price + addOnsPrice) * item.quantity)
  }, 0)
  const tax = Math.round(subtotal * 0.11) // PPN 11%
  const total = subtotal + tax

  const handlePayment = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong')
      return
    }
    setShowPaymentModal(true)
  }

  const processPayment = () => {
    // Generate order number
    const newOrderNumber = '#' + String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    setOrderNumber(newOrderNumber)
    setShowPaymentModal(false)
    setShowSuccessModal(true)
  }

  const resetOrder = () => {
    setCart([])
    setSelectedTable(null)
    setCustomerName('')
    setOrderNote('')
    setCashReceived('')
    setShowSuccessModal(false)
  }

  const change = cashReceived ? parseInt(cashReceived) - total : 0

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]">
        {/* Left side - Menu items */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Search and filters */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={!item.stock}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    item.stock
                      ? 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:shadow-md cursor-pointer'
                      : 'border-zinc-200 dark:border-zinc-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                  {!item.stock && (
                    <span className="text-xs text-red-500">Habis</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Cart */}
        <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Cart header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">Pesanan Baru</h2>

            {/* Table selection */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                Pilih Meja
              </label>
              <div className="flex flex-wrap gap-1.5">
                {tables.filter(t => t.status === 'available').slice(0, 8).map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table.id)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      selectedTable === table.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {table.name}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTable('takeaway')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    selectedTable === 'takeaway'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  Bawa Pulang
                </button>
              </div>
            </div>

            {/* Customer name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Nama pelanggan (opsional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <Receipt className="w-12 h-12 mb-2" />
                <p className="text-sm">Keranjang kosong</p>
                <p className="text-xs">Klik menu untuk menambahkan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const addOnsPrice = calculateAddOnsPrice(item.selectedAddOns || [])
                  const itemTotal = (item.price + addOnsPrice) * item.quantity
                  return (
                    <div key={item.cartItemId} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                            {item.name}
                          </h4>
                          {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              + {getAddOnDetails(item.selectedAddOns).map(a => a.name).join(', ')}
                            </p>
                          )}
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            Rp {(item.price + addOnsPrice).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            className="p-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          Rp {itemTotal.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Item note */}
                      <input
                        type="text"
                        placeholder="Catatan item..."
                        value={item.note}
                        onChange={(e) => updateItemNote(item.cartItemId, e.target.value)}
                        className="mt-2 w-full px-2 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Cart footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            {/* Order note */}
            <input
              type="text"
              placeholder="Catatan pesanan..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              className="w-full px-3 py-2 mb-3 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {/* Totals */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                <span className="text-zinc-900 dark:text-white">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">PPN (11%)</span>
                <span className="text-zinc-900 dark:text-white">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-900 dark:text-white">Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={resetOrder}
                className="px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePayment}
                disabled={cart.length === 0}
                className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Pembayaran</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Total */}
              <div className="text-center mb-6">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Pembayaran</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  Rp {total.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Payment method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs font-medium">Tunai</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('qris')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs font-medium">QRIS</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-medium">Kartu</span>
                  </button>
                </div>
              </div>

              {/* Cash input */}
              {paymentMethod === 'cash' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Uang Diterima
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">Rp</span>
                    <input
                      type="number"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  {cashReceived && change >= 0 && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600 dark:text-emerald-400">Kembalian</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {change.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  )}
                  {cashReceived && change < 0 && (
                    <p className="mt-2 text-xs text-red-500">Uang tidak cukup</p>
                  )}

                  {/* Quick amounts */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[20000, 50000, 100000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashReceived(String(amount))}
                        className="px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      >
                        {amount.toLocaleString('id-ID')}
                      </button>
                    ))}
                    <button
                      onClick={() => setCashReceived(String(total))}
                      className="px-3 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                    >
                      Uang Pas
                    </button>
                  </div>
                </div>
              )}

              {/* QRIS placeholder */}
              {paymentMethod === 'qris' && (
                <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
                  <div className="flex items-center justify-center w-32 h-32 mx-auto mb-2 bg-white dark:bg-zinc-900 rounded-lg">
                    <QrCode className="w-16 h-16 text-zinc-400" />
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Scan QR code untuk membayar
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={processPayment}
                disabled={paymentMethod === 'cash' && change < 0}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-xl text-center">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                Pembayaran Berhasil!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Pesanan {orderNumber} telah dibuat
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                Rp {total.toLocaleString('id-ID')}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={resetOrder}
                  className="px-4 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Pesanan Baru
                </button>
                <button
                  onClick={() => {
                    // Print receipt logic
                    alert('Mencetak struk...')
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  <Printer className="w-4 h-4" />
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
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {selectedItem.name}
                </h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Rp {selectedItem.price.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddOnModal(false)
                  setSelectedItem(null)
                  setSelectedAddOns([])
                }}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                Pilih Add-ons
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedItem.addOns.map((addOnId) => {
                  const addOn = addOns.find(a => a.id === addOnId)
                  if (!addOn) return null
                  return (
                    <label
                      key={addOnId}
                      className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOnId)}
                          onChange={() => toggleAddOn(addOnId)}
                          className="w-4 h-4 text-emerald-500 bg-zinc-100 border-zinc-300 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-zinc-900 dark:text-white">
                          {addOn.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        +Rp {addOn.price.toLocaleString('id-ID')}
                      </span>
                    </label>
                  )
                })}
              </div>

              {selectedAddOns.length > 0 && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400">Total Add-ons</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      +Rp {calculateAddOnsPrice(selectedAddOns).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={addFromModal}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
              >
                Tambah ke Keranjang - Rp {(selectedItem.price + calculateAddOnsPrice(selectedAddOns)).toLocaleString('id-ID')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
