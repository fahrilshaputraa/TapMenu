import { useMemo, useState } from 'react'

import { confirmCashierPayment, createCashierOrderCheckout } from '../services/cashier'
import { buildCashierQrUrl, calculateCashierAddOnsPrice } from '../utils/cashiers'

export function useCashierCart({ menuItems, taxRate }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [orderType, setOrderType] = useState('dine_in')
  const [orderNumber, setOrderNumber] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)
  const [paymentTransaction, setPaymentTransaction] = useState(null)
  const [paymentError, setPaymentError] = useState('')
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
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false)

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && String(item.category) !== selectedCategory) return false
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [menuItems, searchQuery, selectedCategory])

  const toggleAddOn = (groupName, optionId, optionName, optionPrice, selectionType = 'radio') => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((opt) => opt.groupName === groupName && opt.optionName === optionName)
      if (selectionType === 'checkbox') {
        if (exists) {
          return prev.filter((opt) => !(opt.groupName === groupName && opt.optionName === optionName))
        }
        return [...prev, { groupName, optionId, optionName, price: optionPrice }]
      }

      const filtered = prev.filter((opt) => opt.groupName !== groupName)
      if (exists) return filtered
      return [...filtered, { groupName, optionId, optionName, price: optionPrice }]
    })
  }

  const addToCartDirect = (item, itemAddOns) => {
    const addOnHash = itemAddOns.map((option) => option.optionName).sort().join('-')
    const cartItemId = `${item.id}-${addOnHash}`
    const effectivePrice = Number(item.effective_price ?? item.price ?? 0)

    setCart((current) => {
      const existingItem = current.find((cartItem) => cartItem.cartItemId === cartItemId)
      if (existingItem) {
        return current.map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }

      return [
        ...current,
        {
          ...item,
          price: effectivePrice,
          cartItemId,
          selectedAddOns: itemAddOns,
          quantity: 1,
          note: '',
        },
      ]
    })
  }

  const handleItemClick = (item) => {
    if (!item.in_stock) return

    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item)
      setSelectedAddOns([])
      setShowAddOnModal(true)
      return
    }

    addToCartDirect(item, [])
  }

  const closeAddOnModal = () => {
    setShowAddOnModal(false)
    setSelectedItem(null)
    setSelectedAddOns([])
  }

  const addFromModal = () => {
    if (!selectedItem) return

    addToCartDirect(selectedItem, selectedAddOns)
    closeAddOnModal()
  }

  const updateQuantity = (cartItemId, delta) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.cartItemId !== cartItemId) return item
          const newQuantity = item.quantity + delta
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (cartItemId) => {
    setCart((current) => current.filter((item) => item.cartItemId !== cartItemId))
  }

  const openNoteModal = (item) => {
    setCurrentNoteItem(item)
    setNoteInput(item.note || '')
    setShowNoteModal(true)
  }

  const closeNoteModal = () => {
    setShowNoteModal(false)
    setCurrentNoteItem(null)
    setNoteInput('')
  }

  const saveNote = () => {
    if (currentNoteItem) {
      setCart((current) =>
        current.map((item) =>
          item.cartItemId === currentNoteItem.cartItemId
            ? { ...item, note: noteInput }
            : item,
        ),
      )
    }
    closeNoteModal()
  }

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const addOnsPrice = calculateCashierAddOnsPrice(item.selectedAddOns || [])
      return sum + ((item.price + addOnsPrice) * item.quantity)
    }, 0)
  }, [cart])

  const tax = useMemo(() => Math.round(subtotal * (taxRate / 100)), [subtotal, taxRate])
  const total = subtotal + tax
  const change = cashReceived ? parseInt(cashReceived, 10) - total : 0
  const isAwaitingQrisConfirmation = paymentMethod === 'qris' && Boolean(createdOrder && paymentTransaction)
  const qrisPayload = paymentTransaction?.qr_string || paymentTransaction?.payment_url || ''
  const qrisQrUrl = buildCashierQrUrl(qrisPayload)
  const paymentStatusLabel =
    paymentTransaction?.status === 'settlement'
      ? 'Lunas'
      : paymentMethod === 'cash'
        ? 'Tunai'
        : isAwaitingQrisConfirmation
          ? 'QRIS menunggu konfirmasi'
          : 'QRIS'

  const handlePayment = () => {
    if (cart.length === 0) return
    setPaymentError('')
    setShowPaymentModal(true)
  }

  const processPayment = async () => {
    if (isPaymentSubmitting) return
    if (paymentMethod === 'cash' && change < 0) {
      setPaymentError('Uang tunai tidak cukup.')
      return
    }

    setIsPaymentSubmitting(true)
    setPaymentError('')

    try {
      if (paymentMethod === 'qris' && createdOrder && paymentTransaction) {
        const confirmed = await confirmCashierPayment(createdOrder.id)
        setPaymentTransaction(confirmed)
        setShowPaymentModal(false)
        setShowSuccessModal(true)
        return
      }

      const { order, paymentTransaction: checkoutPayload } = await createCashierOrderCheckout({
        orderType,
        paymentMethod,
        cart,
      })

      setCreatedOrder(order)
      setPaymentTransaction(checkoutPayload)
      setOrderNumber(order.order_code)

      if (paymentMethod === 'cash') {
        setShowPaymentModal(false)
        setShowSuccessModal(true)
      }
    } catch (error) {
      setPaymentError(error.message || 'Gagal memproses pembayaran.')
    } finally {
      setIsPaymentSubmitting(false)
    }
  }

  const resetOrder = () => {
    setCart([])
    setCashReceived('')
    setShowSuccessModal(false)
    setShowPaymentModal(false)
    setOrderNumber('')
    setCreatedOrder(null)
    setPaymentTransaction(null)
    setPaymentError('')
    setSelectedItem(null)
    setSelectedAddOns([])
  }

  const clearCart = () => {
    setCart([])
    setCreatedOrder(null)
    setPaymentTransaction(null)
    setPaymentError('')
    setOrderNumber('')
  }

  const setCashInput = (amount) => {
    setCashReceived(amount === 'exact' ? String(total) : String(amount))
  }

  return {
    addFromModal,
    cart,
    cashReceived,
    change,
    clearCart,
    closeAddOnModal,
    closeNoteModal,
    createdOrder,
    currentNoteItem,
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
  }
}
