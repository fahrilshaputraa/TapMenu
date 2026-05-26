/** @typedef {import('../types/categories').CategoryRaw} CategoryRaw */
/** @typedef {import('../types/categories').Category} Category */
/** @typedef {import('../types/categories').CategoryFormData} CategoryFormData */
/** @typedef {import('../types/categories').CategoryWritePayload} CategoryWritePayload */

export const CATEGORY_ICONS = [
  'fa-bowl-rice',
  'fa-burger',
  'fa-pizza-slice',
  'fa-hotdog',
  'fa-ice-cream',
  'fa-mug-hot',
  'fa-wine-glass',
  'fa-martini-glass',
  'fa-bottle-water',
  'fa-utensils',
  'fa-percent',
  'fa-star',
  'fa-fire',
  'fa-leaf',
  'fa-fish',
]

/**
 * @param {number} index
 * @returns {string}
 */
export function getCategoryIconByIndex(index) {
  return CATEGORY_ICONS[index % CATEGORY_ICONS.length]
}

/**
 * @param {CategoryRaw} category
 * @param {number} index
 * @param {string | undefined} preferredIcon
 * @returns {Category}
 */
export function mapCategory(category, index = 0, preferredIcon) {
  return {
    ...category,
    name: category?.name || '',
    description: category?.description || '',
    sort_order: Number(category?.sort_order || 0),
    is_active: Boolean(category?.is_active),
    menu_count: Number(category?.menu_count || 0),
    icon: preferredIcon || category?.icon || getCategoryIconByIndex(index),
  }
}

/**
 * @param {CategoryRaw[]} categories
 * @returns {Category[]}
 */
export function mapCategoryCollection(categories) {
  return (categories || []).map((category, index) => mapCategory(category, index))
}

/**
 * @param {number} count
 * @returns {CategoryFormData}
 */
export function createDefaultCategoryFormData(count = 0) {
  return {
    name: '',
    description: '',
    sort_order: count,
    is_active: true,
    icon: CATEGORY_ICONS[0],
  }
}

/**
 * @param {Category | null | undefined} category
 * @returns {CategoryFormData}
 */
export function createCategoryFormData(category) {
  if (!category) {
    return createDefaultCategoryFormData()
  }

  return {
    name: category.name || '',
    description: category.description || '',
    sort_order: category.sort_order || 0,
    is_active: Boolean(category.is_active),
    icon: category.icon || CATEGORY_ICONS[0],
  }
}

/**
 * @param {CategoryFormData} formData
 * @returns {CategoryWritePayload}
 */
export function buildCategoryPayload(formData) {
  return {
    name: formData.name,
    description: formData.description,
    sort_order: Number(formData.sort_order || 0),
    is_active: formData.is_active,
  }
}
