import { api } from './api'
import {
  buildCustomerOrderItems,
  mapCustomerMenuPayload,
} from '../utils/customerMenu'

export async function loadCustomerMenu({ tableToken, restaurantId }) {
  const query = new URLSearchParams()

  if (tableToken) {
    query.set('table', tableToken)
  } else if (restaurantId) {
    query.set('restaurant', restaurantId)
  } else {
    const ownerRestaurant = await api.get('/api/v1/restaurants/me/')
    const fallbackRestaurantId = ownerRestaurant?.id

    if (!fallbackRestaurantId) {
      throw new Error('Restoran tidak dipilih. Buka menu dari link toko atau QR meja.')
    }

    query.set('restaurant', fallbackRestaurantId)

    return {
      redirectRestaurantId: String(fallbackRestaurantId),
      payload: null,
    }
  }

  const payload = await api.get(`/api/v1/catalogs/public/menu/?${query.toString()}`, { auth: false })

  return {
    redirectRestaurantId: '',
    payload: mapCustomerMenuPayload(payload),
  }
}

export async function submitCustomerOrder({ tableToken, cart }) {
  return api.post(
    '/api/v1/orders/public/',
    {
      table_token: tableToken,
      order_type: 'dine_in',
      channel: 'customer',
      items: buildCustomerOrderItems(cart),
    },
    { auth: false },
  )
}

export async function createCustomerOrderCheckout(orderId, paymentMethod) {
  return api.post(
    `/api/v1/payments/${orderId}/checkout/`,
    {
      method: paymentMethod,
    },
    { auth: false },
  )
}

export async function confirmCustomerPayment(orderId) {
  return api.post(`/api/v1/payments/${orderId}/confirm/`, {}, { auth: false })
}
