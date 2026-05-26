/** @typedef {import('../types/customerMenu').CustomerMenuPayloadRaw} CustomerMenuPayloadRaw */
/** @typedef {import('../types/customerMenu').CustomerMenuCategoryRaw} CustomerMenuCategoryRaw */
/** @typedef {import('../types/customerMenu').CustomerMenuCategory} CustomerMenuCategory */
/** @typedef {import('../types/customerMenu').CustomerMenuItemRaw} CustomerMenuItemRaw */
/** @typedef {import('../types/customerMenu').CustomerMenuItem} CustomerMenuItem */
/** @typedef {import('../types/customerMenu').CustomerRestaurantInfo} CustomerRestaurantInfo */
/** @typedef {import('../types/customerMenu').CustomerCartItem} CustomerCartItem */
/** @typedef {import('../types/customerMenu').CustomerPublicOrder} CustomerPublicOrder */

export const DEFAULT_CUSTOMER_LOGO = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
export const DEFAULT_CUSTOMER_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
export const LAST_ORDER_CODE_KEY = 'tapmenu.lastOrderCode'
export const ORDER_HISTORY_KEY = 'tapmenu.orderHistory'

export function formatCustomerMenuCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

export function mapCustomerCategoryIcon(name = '') {
  const label = name.toLowerCase()
  if (label.includes('minum')) return 'fa-solid fa-mug-hot'
  if (label.includes('cemil') || label.includes('snack')) return 'fa-solid fa-cookie-bite'
  return 'fa-solid fa-utensils'
}

export function mapCustomerMenuItem(item) {
  return {
    ...item,
    name: item?.name || '',
    description: item?.description || '',
    category: String(item?.category || ''),
    image_url: item?.image_url || '',
    price: Number(item?.price || 0),
    effective_price: Number(item?.effective_price ?? item?.price ?? 0),
    in_stock: item?.in_stock !== false,
    is_featured: Boolean(item?.is_featured),
  }
}

export function mapCustomerMenuPayload(payload) {
  return {
    restaurant: payload?.restaurant || null,
    table: payload?.table || null,
    categories: Array.isArray(payload?.categories) ? payload.categories : [],
    items: Array.isArray(payload?.items) ? payload.items.map(mapCustomerMenuItem) : [],
  }
}

export function buildCustomerMenuCategories(categories) {
  const remoteCategories = (categories || []).map((category) => ({
    id: String(category.id),
    name: category.name,
    icon: mapCustomerCategoryIcon(category.name),
  }))

  return [{ id: 'all', name: 'Semua', icon: 'fa-solid fa-border-all' }, ...remoteCategories]
}

export function getRestaurantOpenState(restaurant) {
  if (!restaurant) return false
  if (!restaurant.is_open) return false

  const now = new Date()
  const dayNames = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
  const today = dayNames[now.getDay()]

  if (restaurant.operational_days && restaurant.operational_days[today] === false) {
    return false
  }

  const currentTime = now.getHours() * 60 + now.getMinutes()
  const [openH, openM] = (restaurant.opening_time || '08:00').split(':').map(Number)
  const [closeH, closeM] = (restaurant.closing_time || '22:00').split(':').map(Number)
  const openTime = openH * 60 + openM
  const closeTime = closeH * 60 + closeM

  if (closeTime > openTime) {
    return currentTime >= openTime && currentTime <= closeTime
  }

  return currentTime >= openTime || currentTime <= closeTime
}

export function buildCustomerRestaurantInfo(restaurant, isOpen) {
  const appearance = restaurant?.appearance || {}
  const title = !appearance?.hero_title ||
    appearance.hero_title === 'Pesan langsung dari meja Anda' ||
    appearance.hero_title === 'Warung Bu Dewi'
    ? restaurant?.name || 'TapMenu'
    : appearance.hero_title
  const description = !appearance?.hero_subtitle ||
    appearance.hero_subtitle === 'Scan QR, pilih menu, lalu bayar tanpa antre.' ||
    appearance.hero_subtitle === 'Rasanya seperti masakan ibu'
    ? restaurant?.description || 'Menu digital restoran'
    : appearance.hero_subtitle
  return {
    name: title,
    description,
    address: restaurant?.address || 'Alamat belum diatur',
    openStatus: isOpen ? 'Buka' : 'Tutup',
    businessHours: `${restaurant?.opening_time || '08:00'} - ${restaurant?.closing_time || '22:00'}`,
    logo: appearance.logo_url || DEFAULT_CUSTOMER_LOGO,
    banner: appearance.cover_image_url || DEFAULT_CUSTOMER_BANNER,
    appearance: {
      primaryColor: appearance.primary_color || '#1B4332',
      accentColor: appearance.accent_color || '#E07A5F',
      fontStyle: appearance.font_style || 'Plus Jakarta Sans',
      bgPattern: appearance.bg_pattern || 'pattern-none',
      bgColor: appearance.bg_color || '#F7F5F2',
      layoutStyle: appearance.layout_style || 'list',
      headerStyle: appearance.header_style || 'standard',
      showBanner: appearance.show_banner ?? true,
      showProfile: appearance.show_profile ?? true,
      showImages: appearance.show_images ?? true,
      showDescription: appearance.show_description ?? true,
      cardRadius: Number(appearance.card_radius ?? 12),
      cardShadow: Number(appearance.card_shadow ?? 1),
      buttonStyle: appearance.button_style || 'circle',
    },
  }
}

export function filterCustomerMenuItems(items, selectedCategory, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  return (items || []).filter((item) => {
    if (selectedCategory !== 'all' && String(item.category) !== selectedCategory) return false
    if (normalizedQuery) {
      const haystack = `${item.name} ${item.description || ''}`.toLowerCase()
      if (!haystack.includes(normalizedQuery)) return false
    }
    return true
  })
}

export function getCustomerMenuUnitPrice(item) {
  return Number(item?.effective_price ?? item?.price ?? 0)
}

export function getCustomerCartItemQuantity(cart, itemId) {
  const cartItem = (cart || []).find((item) => item.id === itemId)
  return cartItem ? cartItem.quantity : 0
}

export function addCustomerItemToCart(cart, item) {
  if (!item.in_stock) return cart

  const existingItem = cart.find((cartItem) => cartItem.id === item.id)
  if (existingItem) {
    return cart.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
    )
  }

  return [...cart, { ...item, quantity: 1 }]
}

export function updateCustomerCartQuantity(cart, cartItemId, delta) {
  return cart
    .map((item) => {
      if (item.id === cartItemId) {
        return { ...item, quantity: item.quantity + delta }
      }
      return item
    })
    .filter((item) => item.quantity > 0)
}

export function getCustomerCartSummary(cart, submittedOrder) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + getCustomerMenuUnitPrice(item) * item.quantity, 0)
  const tax = submittedOrder ? Number(submittedOrder.tax_amount || 0) : Math.round(subtotal * 0.1)
  const total = submittedOrder ? Number(submittedOrder.total_amount || 0) : subtotal + tax

  return {
    totalItems,
    subtotal,
    tax,
    total,
  }
}

export function buildCustomerOrderItems(cart) {
  return cart.map((item) => ({
    menu_item_id: item.id,
    quantity: item.quantity,
    notes: '',
  }))
}

export function persistCustomerOrderHistory(order, restaurantName) {
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
      restaurant_name: restaurantName || '',
    },
    ...storedHistory.filter((entry) => entry.order_code !== order.order_code),
  ].slice(0, 10)
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(nextHistory))
}

export function buildCustomerPaymentQrUrl(payload) {
  if (!payload) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payload)}`
}

export function getCustomerMenuFontFamily(fontStyle) {
  if (fontStyle === 'Inter') return '"Inter", sans-serif'
  if (fontStyle === 'Poppins') return '"Poppins", sans-serif'
  if (fontStyle === 'Lato') return '"Lato", sans-serif'
  if (fontStyle === 'Playfair Display') return '"Playfair Display", serif'
  return '"Plus Jakarta Sans", sans-serif'
}

export function getCustomerMenuTitleFontFamily(fontStyle) {
  if (fontStyle === 'Playfair Display') return '"Playfair Display", serif'
  return getCustomerMenuFontFamily(fontStyle)
}

export function getCustomerMenuPatternStyle(bgPattern, bgColor) {
  if (bgPattern === 'pattern-dots') {
    return {
      backgroundColor: bgColor,
      backgroundImage: 'radial-gradient(rgba(17, 24, 39, 0.08) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    }
  }

  if (bgPattern === 'pattern-grid') {
    return {
      backgroundColor: bgColor,
      backgroundImage:
        'linear-gradient(rgba(17, 24, 39, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 24, 39, 0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }
  }

  return { backgroundColor: bgColor }
}

export function getCustomerMenuShadowClass(level) {
  const shadowMap = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-lg',
  }
  return shadowMap[level] || shadowMap[1]
}
