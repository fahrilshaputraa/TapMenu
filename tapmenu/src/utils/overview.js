/** @typedef {import('../types/overview').OverviewLatestOrderRaw} OverviewLatestOrderRaw */
/** @typedef {import('../types/overview').OverviewLatestOrder} OverviewLatestOrder */
/** @typedef {import('../types/overview').OverviewSummaryRaw} OverviewSummaryRaw */
/** @typedef {import('../types/overview').OverviewSummary} OverviewSummary */
/** @typedef {import('../types/overview').OverviewOrderRow} OverviewOrderRow */
/** @typedef {import('../types/overview').OverviewChartData} OverviewChartData */

/**
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatOverviewCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

/**
 * @param {string | null | undefined} status
 * @returns {'Baru' | 'Dimasak' | 'Selesai'}
 */
export function mapOverviewOrderStatus(status) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'pending') return 'Baru'
  if (normalized === 'preparing' || normalized === 'ready') return 'Dimasak'
  return 'Selesai'
}

/**
 * @param {OverviewLatestOrderRaw} order
 * @returns {OverviewLatestOrder}
 */
export function mapOverviewLatestOrder(order) {
  return {
    ...order,
    order_code: order?.order_code || '',
    table__name: order?.table__name || '',
    customer_name: order?.customer_name || '',
    status: order?.status || '',
    total_amount: Number(order?.total_amount || 0),
  }
}

/**
 * @param {OverviewSummaryRaw | null | undefined} summary
 * @returns {OverviewSummary}
 */
export function mapOverviewSummary(summary) {
  return {
    ...summary,
    revenue: Number(summary?.revenue || 0),
    paid_orders: Number(summary?.paid_orders || 0),
    pending_orders: Number(summary?.pending_orders || 0),
    today_orders: Number(summary?.today_orders || 0),
    menu_count: Number(summary?.menu_count || 0),
    table_count: Number(summary?.table_count || 0),
    employee_count: Number(summary?.employee_count || 0),
    voucher_count: Number(summary?.voucher_count || 0),
    restaurant_name: summary?.restaurant_name || '',
    is_open: summary?.is_open === true,
    latest_orders: Array.isArray(summary?.latest_orders) ? summary.latest_orders.map(mapOverviewLatestOrder) : [],
  }
}

/**
 * @param {OverviewSummary | null | undefined} summary
 * @returns {OverviewOrderRow[]}
 */
export function buildOverviewLatestOrderRows(summary) {
  return (summary?.latest_orders || []).map((order) => ({
    id: order.order_code,
    table: order.table__name || order.customer_name || 'Order tanpa meja',
    items: order.status,
    total: formatOverviewCurrency(order.total_amount),
    status: mapOverviewOrderStatus(order.status),
  }))
}

/**
 * @param {OverviewSummary | null | undefined} summary
 * @returns {OverviewChartData}
 */
export function getOverviewChartData(summary) {
  return {
    labels: ['Pesanan Selesai', 'Belum Diproses'],
    values: [summary?.paid_orders || 0, summary?.pending_orders || 0],
  }
}
