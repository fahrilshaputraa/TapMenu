/** @typedef {import('../types/orders').OrderRaw} OrderRaw */
/** @typedef {import('../types/orders').Order} Order */
/** @typedef {import('../types/orders').OrderItemRaw} OrderItemRaw */
/** @typedef {import('../types/orders').OrderItem} OrderItem */

/**
 * @param {number | string | null | undefined} num
 * @returns {string}
 */
export function formatOrderRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(num || 0))
}

/**
 * @param {string | null | undefined} status
 * @returns {'new' | 'process' | 'ready' | 'completed'}
 */
export function mapOrderStatusToUi(status) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'pending') return 'new'
  if (normalized === 'preparing') return 'process'
  if (normalized === 'ready') return 'ready'
  return 'completed'
}

/**
 * @param {'new' | 'process' | 'ready' | 'completed'} status
 * @returns {string}
 */
export function getOrderStatusLabel(status) {
  if (status === 'new') return 'Baru'
  if (status === 'process') return 'Dimasak'
  if (status === 'ready') return 'Siap Saji'
  return 'Selesai'
}

/**
 * @param {OrderItemRaw} item
 * @returns {OrderItem}
 */
export function mapOrderItem(item) {
  return {
    ...item,
    item_name: item?.item_name || '',
    menu_item_name: item?.menu_item_name || '',
    quantity: Number(item?.quantity || 0),
    unit_price: Number(item?.unit_price || 0),
    subtotal: Number(item?.subtotal || 0),
    notes: item?.notes || '',
  }
}

/**
 * @param {OrderRaw} order
 * @returns {Order}
 */
export function mapOrder(order) {
  return {
    ...order,
    order_code: order?.order_code || '',
    table_name: order?.table_name || '',
    customer_name: order?.customer_name || '',
    status: order?.status || '',
    created_at: order?.created_at || '',
    total_amount: Number(order?.total_amount || 0),
    subtotal_amount: Number(order?.subtotal_amount || 0),
    tax_amount: Number(order?.tax_amount || 0),
    service_amount: Number(order?.service_amount || 0),
    items: Array.isArray(order?.items) ? order.items.map(mapOrderItem) : [],
  }
}

/**
 * @param {OrderRaw[]} orders
 * @returns {Order[]}
 */
export function mapOrderCollection(orders) {
  return (orders || []).map(mapOrder)
}

/**
 * @param {Order[]} orders
 * @param {string} filter
 * @param {string} searchQuery
 * @returns {Order[]}
 */
export function filterOrders(orders, filter, searchQuery) {
  const keyword = searchQuery.toLowerCase()

  return orders.filter((order) => {
    const uiStatus = mapOrderStatusToUi(order.status)
    const matchStatus = filter === 'all' || uiStatus === filter
    const orderCode = String(order.order_code || '').toLowerCase()
    const tableLabel = String(order.table_name || order.customer_name || '').toLowerCase()
    return matchStatus && (orderCode.includes(keyword) || tableLabel.includes(keyword))
  })
}

/**
 * @param {Order[]} orders
 * @returns {{ total: number, pending: number }}
 */
export function getOrderStats(orders) {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  return {
    total: orders.filter((order) => new Date(order.created_at) >= startOfToday).length,
    pending: orders.filter((order) => mapOrderStatusToUi(order.status) === 'new').length,
  }
}

/**
 * @param {Order} order
 * @returns {string}
 */
export function getOrderRowClass(order) {
  const uiStatus = mapOrderStatusToUi(order.status)
  if (uiStatus === 'new') return 'bg-yellow-50/30'
  if (uiStatus === 'completed') return 'opacity-75 grayscale-[0.5]'
  return ''
}
