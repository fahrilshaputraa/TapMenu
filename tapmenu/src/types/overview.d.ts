export type OverviewLatestOrderRaw = {
  order_code?: string
  table__name?: string
  customer_name?: string
  status?: string
  total_amount?: number | string
}

export type OverviewSummaryRaw = {
  revenue?: number | string
  paid_orders?: number | string
  pending_orders?: number | string
  today_orders?: number | string
  menu_count?: number | string
  table_count?: number | string
  employee_count?: number | string
  voucher_count?: number | string
  restaurant_name?: string
  is_open?: boolean
  latest_orders?: OverviewLatestOrderRaw[]
}

export type OverviewLatestOrder = OverviewLatestOrderRaw & {
  order_code: string
  table__name: string
  customer_name: string
  status: string
  total_amount: number
}

export type OverviewSummary = OverviewSummaryRaw & {
  revenue: number
  paid_orders: number
  pending_orders: number
  today_orders: number
  menu_count: number
  table_count: number
  employee_count: number
  voucher_count: number
  restaurant_name: string
  is_open: boolean
  latest_orders: OverviewLatestOrder[]
}

export type OverviewOrderRow = {
  id: string
  table: string
  items: string
  total: string
  status: 'Baru' | 'Dimasak' | 'Selesai'
}

export type OverviewChartData = {
  labels: string[]
  values: number[]
}
