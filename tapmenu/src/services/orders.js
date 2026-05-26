import { api } from './api'
import { mapOrder, mapOrderCollection } from '../utils/orders'

/** @typedef {import('../types/orders').Order} Order */

/**
 * @returns {Promise<Order[]>}
 */
export async function loadOrders() {
  const payload = await api.get('/api/v1/orders/')
  const results = Array.isArray(payload?.results) ? payload.results : (payload || [])
  return mapOrderCollection(results)
}

/**
 * @param {number} orderId
 * @param {string} status
 * @returns {Promise<Order>}
 */
export async function updateOrderStatus(orderId, status) {
  const updated = await api.patch(`/api/v1/orders/${orderId}/`, { status })
  return mapOrder(updated)
}
