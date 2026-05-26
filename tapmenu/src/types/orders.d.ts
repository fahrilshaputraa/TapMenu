export type OrderItemRaw = {
  item_name?: string
  menu_item_name?: string
  quantity?: number | string
  unit_price?: number | string
  subtotal?: number | string
  notes?: string
}

export type OrderRaw = {
  id: number
  order_code?: string
  table_name?: string
  customer_name?: string
  status?: string
  created_at?: string
  total_amount?: number | string
  subtotal_amount?: number | string
  tax_amount?: number | string
  service_amount?: number | string
  items?: OrderItemRaw[]
}

export type OrderItem = OrderItemRaw & {
  item_name: string
  menu_item_name: string
  quantity: number
  unit_price: number
  subtotal: number
  notes: string
}

export type Order = OrderRaw & {
  order_code: string
  table_name: string
  customer_name: string
  status: string
  created_at: string
  total_amount: number
  subtotal_amount: number
  tax_amount: number
  service_amount: number
  items: OrderItem[]
}
