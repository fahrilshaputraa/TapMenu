import { api } from './api'
import { mapRestaurantProfile } from '../utils/storeSettings'

/** @typedef {import('../types/storeSettings').RestaurantProfile} RestaurantProfile */
/** @typedef {import('../types/storeSettings').RestaurantProfileWritePayload} RestaurantProfileWritePayload */

/**
 * @returns {Promise<RestaurantProfile>}
 */
export async function loadStoreSettings() {
  const payload = await api.get('/api/v1/restaurants/me/')
  return mapRestaurantProfile(payload)
}

/**
 * @param {RestaurantProfileWritePayload} payload
 * @returns {Promise<RestaurantProfile>}
 */
export async function saveStoreSettings(payload) {
  const response = await api.put('/api/v1/restaurants/me/', payload)
  return mapRestaurantProfile(response)
}
