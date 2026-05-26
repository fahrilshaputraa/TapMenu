import {
  formatCustomerOrderCurrency,
  formatCustomerOrderDateTime,
} from './customerOrders'

export const CUSTOMER_ORDER_HISTORY_KEY = 'tapmenu.orderHistory'

export const CUSTOMER_ORDER_HISTORY_STATUS_MAP = {
  PREPARING: { label: 'Diproses', className: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Siap', className: 'bg-indigo-100 text-indigo-700' },
  PENDING: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
  PAID: { label: 'Dibayar', className: 'bg-emerald-100 text-emerald-700' },
  COMPLETED: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  completed: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
}

export function loadCustomerOrderHistory() {
  return JSON.parse(localStorage.getItem(CUSTOMER_ORDER_HISTORY_KEY) || '[]')
}

export function filterCustomerOrderHistory(orders, tab, query) {
  return orders.filter((order) => {
    if (tab === 'completed' && order.status !== 'COMPLETED') return false
    if (tab === 'cancelled' && order.status !== 'CANCELLED') return false
    if (query && !order.order_code.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })
}

export function getCustomerOrderHistoryStatusInfo(status) {
  return CUSTOMER_ORDER_HISTORY_STATUS_MAP[status] || CUSTOMER_ORDER_HISTORY_STATUS_MAP.pending
}

export {
  formatCustomerOrderCurrency as formatCustomerOrderHistoryCurrency,
  formatCustomerOrderDateTime as formatCustomerOrderHistoryDateTime,
}
