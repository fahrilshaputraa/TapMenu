import { api } from './api'
import { mapCustomerTrackedOrder } from '../utils/customerOrders'

export async function loadCustomerTrackedOrder(orderCode) {
  const payload = await api.get(`/api/v1/orders/track/${orderCode}/`, { auth: false })
  return mapCustomerTrackedOrder(payload)
}
