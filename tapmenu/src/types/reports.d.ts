export type ReportsSummaryRaw = {
  gross_sales?: number | string
  total_orders?: number | string
  paid_orders?: number | string
  pending_orders?: number | string
  discounts?: number | string
  taxes?: number | string
  services?: number | string
}

export type ReportsSummary = ReportsSummaryRaw & {
  gross_sales: number
  total_orders: number
  paid_orders: number
  pending_orders: number
  discounts: number
  taxes: number
  services: number
}

export type ReportsFilter = 'today' | 'week' | 'month'

export type ReportsMetrics = {
  revenue: number
  transactions: number
  average: number
}

export type ReportsChartData = {
  labels: string[]
  values: number[]
}

export type ReportsTransactionRow = {
  id: string
  time: string
  cashier: string
  method: string
  total: number
}
