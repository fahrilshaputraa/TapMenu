import { api } from './api'
import { mapCategory, mapCategoryCollection } from '../utils/categories'

/** @typedef {import('../types/categories').Category} Category */
/** @typedef {import('../types/categories').CategoryWritePayload} CategoryWritePayload */

/**
 * @returns {Promise<Category[]>}
 */
export async function loadCategories() {
  const payload = await api.get('/api/v1/catalogs/categories/')
  const results = Array.isArray(payload?.results) ? payload.results : (payload || [])
  return mapCategoryCollection(results)
}

/**
 * @param {CategoryWritePayload} payload
 * @param {string} icon
 * @returns {Promise<Category>}
 */
export async function createCategory(payload, icon) {
  const created = await api.post('/api/v1/catalogs/categories/', payload)
  return mapCategory(created, 0, icon)
}

/**
 * @param {number} categoryId
 * @param {CategoryWritePayload} payload
 * @param {string} icon
 * @returns {Promise<Category>}
 */
export async function updateCategory(categoryId, payload, icon) {
  const updated = await api.put(`/api/v1/catalogs/categories/${categoryId}/`, payload)
  return mapCategory(updated, 0, icon)
}

/**
 * @param {Category} category
 * @returns {Promise<Category>}
 */
export async function toggleCategoryStatus(category) {
  const updated = await api.patch(`/api/v1/catalogs/categories/${category.id}/`, {
    is_active: !category.is_active,
  })
  return mapCategory(updated, 0, category.icon)
}

/**
 * @param {number} categoryId
 * @returns {Promise<void>}
 */
export async function deleteCategory(categoryId) {
  await api.delete(`/api/v1/catalogs/categories/${categoryId}/`)
}
