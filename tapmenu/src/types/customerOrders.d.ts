export type CustomerTrackedOrderItemRaw = {
  id?: number | string
  item_name?: string
  quantity?: number | string
  unit_price?: number | string
}

export type CustomerTrackedOrderRaw = {
  order_code?: string
  status?: string
  created_at?: string
  total_amount?: number | string
  tax_amount?: number | string
  items?: CustomerTrackedOrderItemRaw[]
}

export type CustomerTrackedOrderItem = CustomerTrackedOrderItemRaw & {
  id: string
  item_name: string
  quantity: number
  unit_price: number
}

export type CustomerTrackedOrder = CustomerTrackedOrderRaw & {
  order_code: string
  status: string
  created_at: string
  total_amount: number
  tax_amount: number
  items: CustomerTrackedOrderItem[]
}

export type CustomerOrderTimelineStep = {
  id: string
  title: string
  description: string
  icon: string
}
