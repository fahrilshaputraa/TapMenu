/** @typedef {import('../types/menu').MenuCategory} MenuCategory */
/** @typedef {import('../types/menu').MenuItemRaw} MenuItemRaw */
/** @typedef {import('../types/menu').MenuItem} MenuItem */
/** @typedef {import('../types/menu').MenuFormData} MenuFormData */
/** @typedef {import('../types/menu').MenuWritePayload} MenuWritePayload */
/** @typedef {import('../types/menu').MenuVariantGroup} MenuVariantGroup */

export const DEFAULT_MENU_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  discount: '',
  tax: '10',
  stock: '',
  image: '',
  isActive: true,
  isFavorite: false,
  isNew: false,
  trackStock: false,
  variants: [],
}

export function formatMenuCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

export function mapMenuItem(item) {
  return {
    id: item.id,
    name: item.name || '',
    category: String(item.category || ''),
    categoryName: item.category_name || '',
    price: Number(item.price || 0),
    effectivePrice: Number(item.effective_price || item.price || 0),
    stock: item.in_stock !== false,
    stockAmount: Number(item.stock_quantity || 0),
    image: item.image_url || '',
    description: item.description || '',
    discount: Number(item.discount_percentage || 0),
    tax: Number(item.tax_percentage || 10),
    isActive: item.is_available !== false,
    isFavorite: Boolean(item.is_featured),
    isNew: Boolean(item.is_new),
    variants: Array.isArray(item.variants) ? item.variants : [],
    trackStock: Boolean(item.track_stock),
    preparationTime: Number(item.preparation_time_minutes || 10),
  }
}

export function mapMenuItemCollection(items) {
  return (items || []).map(mapMenuItem)
}

export function createDefaultMenuForm(categories = []) {
  return {
    ...DEFAULT_MENU_FORM,
    category: categories[0] ? String(categories[0].id) : '',
  }
}

export function createMenuFormData(item) {
  return {
    name: item.name,
    category: String(item.category),
    description: item.description || '',
    price: String(item.price || ''),
    discount: String(item.discount || ''),
    tax: String(item.tax || '10'),
    stock: item.stockAmount ? String(item.stockAmount) : '',
    image: item.image || '',
    isActive: item.isActive !== false,
    isFavorite: item.isFavorite || false,
    isNew: item.isNew || false,
    trackStock: item.trackStock || false,
    variants: item.variants || [],
  }
}

export function buildMenuCategoryTabs(categories) {
  return [{ id: 'all', name: 'Semua' }, ...categories.map((category) => ({ id: String(category.id), name: category.name }))]
}

export function filterMenuItems(items, selectedCategory, searchQuery) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  return items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
    if (normalizedQuery && !item.name.toLowerCase().includes(normalizedQuery)) return false
    return true
  })
}

export function buildMenuPayload(formData) {
  return {
    category: Number(formData.category),
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: Number(formData.price || 0),
    discount_percentage: Number(formData.discount || 0),
    tax_percentage: Number(formData.tax || 10),
    image_url: formData.image || '',
    track_stock: formData.trackStock,
    stock_quantity: formData.trackStock ? Math.max(Number(formData.stock || 0), 0) : 0,
    preparation_time_minutes: 10,
    is_available: formData.isActive,
    is_featured: formData.isFavorite,
    is_new: formData.isNew,
    variants: formData.variants,
  }
}

export function validateMenuForm(formData) {
  if (!formData.name.trim() || !formData.price || !formData.category) {
    return 'Nama menu, kategori, dan harga wajib diisi.'
  }

  if (formData.trackStock && (formData.stock === '' || formData.stock === null || formData.stock === undefined)) {
    return 'Jumlah stok wajib diisi ketika pelacakan stok aktif.'
  }

  for (const group of formData.variants) {
    if (!group.name.trim()) {
      return 'Nama grup varian wajib diisi.'
    }
    for (const option of group.options) {
      if (!option.name.trim()) {
        return 'Nama opsi varian wajib diisi.'
      }
    }
  }

  return ''
}

export function createMenuVariantGroup() {
  const now = Date.now()
  return {
    id: now.toString(),
    name: '',
    type: 'radio',
    options: [{ id: `${now}-opt`, name: '', price: 0 }],
  }
}

export function calculateMenuFinalPrice(formData) {
  const price = Number(formData.price) || 0
  const discount = Number(formData.discount) || 0
  return price - (price * discount) / 100
}
