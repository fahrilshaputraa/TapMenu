/** @typedef {import('../types/reports').ReportsSummaryRaw} ReportsSummaryRaw */
/** @typedef {import('../types/reports').ReportsSummary} ReportsSummary */
/** @typedef {import('../types/reports').ReportsFilter} ReportsFilter */
/** @typedef {import('../types/reports').ReportsMetrics} ReportsMetrics */
/** @typedef {import('../types/reports').ReportsChartData} ReportsChartData */
/** @typedef {import('../types/reports').ReportsTransactionRow} ReportsTransactionRow */

/**
 * @param {number | string | null | undefined} num
 * @returns {string}
 */
export function formatReportsRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(num || 0))
}

/**
 * @param {ReportsSummaryRaw | null | undefined} summary
 * @returns {ReportsSummary}
 */
export function mapReportsSummary(summary) {
  return {
    ...summary,
    gross_sales: Number(summary?.gross_sales || 0),
    total_orders: Number(summary?.total_orders || 0),
    paid_orders: Number(summary?.paid_orders || 0),
    pending_orders: Number(summary?.pending_orders || 0),
    discounts: Number(summary?.discounts || 0),
    taxes: Number(summary?.taxes || 0),
    services: Number(summary?.services || 0),
  }
}

/**
 * @param {ReportsSummary | null | undefined} summary
 * @returns {ReportsMetrics}
 */
export function getReportsMetrics(summary) {
  const revenue = Number(summary?.gross_sales || 0)
  const transactions = Number(summary?.total_orders || 0)
  const average = Number(summary?.paid_orders ? revenue / Number(summary.paid_orders) : 0)

  return {
    revenue,
    transactions,
    average,
  }
}

/**
 * @param {ReportsSummary | null | undefined} summary
 * @param {ReportsFilter} filter
 * @returns {ReportsChartData}
 */
export function getReportsChartData(summary, filter) {
  if (filter === 'month') {
    return {
      labels: ['Gross', 'Discount', 'Tax', 'Service'],
      values: [
        Number(summary?.gross_sales || 0),
        Number(summary?.discounts || 0),
        Number(summary?.taxes || 0),
        Number(summary?.services || 0),
      ],
    }
  }

  return {
    labels: ['Gross', 'Pending', 'Paid'],
    values: [
      Number(summary?.gross_sales || 0),
      Number(summary?.pending_orders || 0),
      Number(summary?.paid_orders || 0),
    ],
  }
}

/**
 * @param {ReportsSummary | null | undefined} summary
 * @returns {ReportsTransactionRow[]}
 */
export function buildReportsTransactions(summary) {
  return [
    { id: 'TOTAL-ORDERS', time: '-', cashier: 'Semua staff', method: 'Semua', total: Number(summary?.total_orders || 0) },
    { id: 'PAID-ORDERS', time: '-', cashier: 'Semua staff', method: 'Lunas', total: Number(summary?.paid_orders || 0) },
    { id: 'PENDING-ORDERS', time: '-', cashier: 'Semua staff', method: 'Pending', total: Number(summary?.pending_orders || 0) },
  ]
}

/**
 * @param {ReportsTransactionRow[]} transactions
 * @param {string} searchQuery
 * @returns {ReportsTransactionRow[]}
 */
export function filterReportTransactions(transactions, searchQuery) {
  const keyword = searchQuery.toLowerCase()

  return transactions.filter((transaction) => (
    transaction.id.toLowerCase().includes(keyword) ||
    transaction.cashier.toLowerCase().includes(keyword)
  ))
}
