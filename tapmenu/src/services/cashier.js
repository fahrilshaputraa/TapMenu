import { api } from './api'
import { buildCashierOrderItems, mapCashierMenuItem } from '../utils/cashiers'

/** @typedef {import('../types/cashiers').CashierCartItem} CashierCartItem */
/** @typedef {import('../types/cashiers').CashierCategoryOption} CashierCategoryOption */
/** @typedef {import('../types/cashiers').CashierMenuItem} CashierMenuItem */
/** @typedef {import('../types/cashiers').CashierRestaurantSummary} CashierRestaurantSummary */
/** @typedef {import('../types/cashiers').CashierPaymentTransaction} CashierPaymentTransaction */

/**
 * Load cashier page dependencies from backend APIs.
 * @returns {Promise<{categories: CashierCategoryOption[], menuItems: CashierMenuItem[], restaurant: CashierRestaurantSummary}>}
 */
export async function loadCashierData() {
  const [categoryPayload, itemPayload, restaurantPayload] = await Promise.all([
    api.get('/api/v1/catalogs/categories/'),
    api.get('/api/v1/catalogs/items/'),
    api.get('/api/v1/restaurants/me/'),
  ])

  const categories = Array.isArray(categoryPayload?.results) ? categoryPayload.results : (categoryPayload || [])
  const items = Array.isArray(itemPayload?.results) ? itemPayload.results : (itemPayload || [])

  return {
    categories: [{ id: 'all', name: 'Semua' }, ...categories.map((category) => ({ id: String(category.id), name: category.name }))],
    menuItems: items.map(mapCashierMenuItem),
    restaurant: restaurantPayload,
  }
}

/**
 * Create cashier order and its initial payment transaction.
 * @param {{orderType: string, paymentMethod: string, cart: CashierCartItem[]}} params
 * @returns {Promise<{order: any, paymentTransaction: CashierPaymentTransaction}>}
 */
export async function createCashierOrderCheckout({ orderType, paymentMethod, cart }) {
  const orderPayload = await api.post('/api/v1/orders/', {
    order_type: orderType,
    payment_method: paymentMethod,
    items: buildCashierOrderItems(cart),
  })

  const paymentTransaction = await api.post(`/api/v1/payments/${orderPayload.id}/checkout/`, {
    method: paymentMethod,
  })

  return {
    order: orderPayload,
    paymentTransaction,
  }
}

/**
 * Confirm QRIS/manual payment completion for a cashier-created order.
 * @param {number} orderId
 * @returns {Promise<CashierPaymentTransaction>}
 */
export async function confirmCashierPayment(orderId) {
  return api.post(`/api/v1/payments/${orderId}/confirm/`, {})
}
