import { api } from './api'
import { mapMenuAppearance } from '../utils/menuAppearance'

/** @typedef {import('../types/menuAppearance').MenuAppearance} MenuAppearance */
/** @typedef {import('../types/menuAppearance').MenuAppearanceWritePayload} MenuAppearanceWritePayload */

/**
 * @returns {Promise<MenuAppearance>}
 */
export async function loadMenuAppearance() {
  const payload = await api.get('/api/v1/restaurants/appearance/')
  return mapMenuAppearance(payload)
}

/**
 * @param {MenuAppearanceWritePayload} payload
 * @returns {Promise<MenuAppearance>}
 */
export async function saveMenuAppearance(payload) {
  const response = await api.put('/api/v1/restaurants/appearance/', payload)
  return mapMenuAppearance(response)
}
