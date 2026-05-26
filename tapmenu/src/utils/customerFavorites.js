/** @typedef {import('../types/customerFavorites').CustomerFavoriteItem} CustomerFavoriteItem */
/** @typedef {import('../types/customerFavorites').CustomerFavoriteCategory} CustomerFavoriteCategory */
/** @typedef {import('../types/customerFavorites').CustomerFavoriteCategoryOption} CustomerFavoriteCategoryOption */

/** @type {CustomerFavoriteItem[]} */
export const defaultCustomerFavorites = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    description: 'Porsi lengkap dengan sate ayam dan telur mata sapi.',
    price: 25000,
    category: 'makanan',
    rating: 4.9,
    tags: ['Pedas', 'Signature'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Ayam Bakar Madu',
    description: 'Ayam kampung dibakar dengan saus madu istimewa.',
    price: 28000,
    category: 'makanan',
    rating: 4.8,
    tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Es Kopi Susu Gula Aren',
    description: 'Kopi house blend dengan susu segar dan gula aren.',
    price: 18000,
    category: 'minuman',
    rating: 4.7,
    tags: ['Dingan'],
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Pisang Goreng Keju',
    description: 'Pisang kepok manis dengan topping keju melimpah.',
    price: 15000,
    category: 'cemilan',
    rating: 4.6,
    tags: ['Cemilan'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2b7b?auto=format&fit=crop&w=400&q=80',
  },
]

/** @type {CustomerFavoriteCategoryOption[]} */
export const customerFavoriteCategories = [
  { id: 'all', label: 'Semua' },
  { id: 'makanan', label: 'Makanan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'cemilan', label: 'Cemilan' },
]

/**
 * @param {number | null | undefined} value
 * @returns {string}
 */
export function formatCustomerFavoriteRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

/**
 * @param {CustomerFavoriteItem[]} favorites
 * @param {CustomerFavoriteCategory} selectedCategory
 * @param {string} query
 * @returns {CustomerFavoriteItem[]}
 */
export function filterCustomerFavorites(favorites, selectedCategory, query) {
  const normalizedQuery = query.trim().toLowerCase()

  return favorites.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false
    }

    if (normalizedQuery && !item.name.toLowerCase().includes(normalizedQuery)) {
      return false
    }

    return true
  })
}

/**
 * @param {CustomerFavoriteItem[]} favorites
 * @param {number} itemId
 * @returns {CustomerFavoriteItem[]}
 */
export function removeCustomerFavorite(favorites, itemId) {
  return favorites.filter((item) => item.id !== itemId)
}
