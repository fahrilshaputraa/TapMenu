/** @typedef {import('../types/customerOrders').CustomerTrackedOrderRaw} CustomerTrackedOrderRaw */
/** @typedef {import('../types/customerOrders').CustomerTrackedOrder} CustomerTrackedOrder */
/** @typedef {import('../types/customerOrders').CustomerTrackedOrderItemRaw} CustomerTrackedOrderItemRaw */
/** @typedef {import('../types/customerOrders').CustomerTrackedOrderItem} CustomerTrackedOrderItem */

export const CUSTOMER_LAST_ORDER_CODE_KEY = 'tapmenu.lastOrderCode'
export const CUSTOMER_TIMELINE_STEPS = [
  {
    id: 'PENDING',
    title: 'Pesanan Diterima',
    description: 'Pesanan masuk ke dapur',
    icon: 'fa-solid fa-check',
  },
  {
    id: 'PREPARING',
    title: 'Sedang Dimasak',
    description: 'Mohon tunggu, koki sedang menyiapkan.',
    icon: 'fa-solid fa-fire-burner',
  },
  {
    id: 'READY',
    title: 'Siap Disajikan',
    description: 'Pesanan akan diantar ke meja.',
    icon: 'fa-solid fa-bell-concierge',
  },
  {
    id: 'COMPLETED',
    title: 'Pesanan Selesai',
    description: 'Pesanan sudah diterima pelanggan.',
    icon: 'fa-solid fa-circle-check',
  },
]

export const CUSTOMER_ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  PREPARING: 'bg-blue-100 text-blue-700',
  READY: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export const CUSTOMER_ORDER_STATUS_LABELS = {
  PENDING: 'Pesanan Diterima',
  PAID: 'Sudah Dibayar',
  PREPARING: 'Sedang Dimasak',
  READY: 'Siap Disajikan',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
}

export function mapCustomerTrackedOrderItem(item) {
  return {
    ...item,
    id: String(item?.id || ''),
    item_name: item?.item_name || '',
    quantity: Number(item?.quantity || 0),
    unit_price: Number(item?.unit_price || 0),
  }
}

export function mapCustomerTrackedOrder(order) {
  return {
    ...order,
    order_code: order?.order_code || '',
    status: order?.status || 'PENDING',
    created_at: order?.created_at || '',
    total_amount: Number(order?.total_amount || 0),
    tax_amount: Number(order?.tax_amount || 0),
    items: Array.isArray(order?.items) ? order.items.map(mapCustomerTrackedOrderItem) : [],
  }
}

export function getInitialCustomerOrderCode(searchParams) {
  return searchParams.get('code') || localStorage.getItem(CUSTOMER_LAST_ORDER_CODE_KEY) || ''
}

export function formatCustomerOrderDateTime(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function formatCustomerOrderCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

export function getCustomerOrderStatusLabel(status) {
  return CUSTOMER_ORDER_STATUS_LABELS[status] || status
}

export function getCustomerOrderStatusColor(status) {
  return CUSTOMER_ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
}

export function getCustomerOrderTimelineState(stepId, currentStatus) {
  const currentStatusIndex = CUSTOMER_TIMELINE_STEPS.findIndex((step) => step.id === currentStatus)
  const stepIndex = CUSTOMER_TIMELINE_STEPS.findIndex((step) => step.id === stepId)
  const isActive = stepId === currentStatus
  const isDone = stepIndex < currentStatusIndex

  return {
    isActive,
    isDone,
  }
}
