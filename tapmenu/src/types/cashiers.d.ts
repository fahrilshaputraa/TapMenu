export type CashierVariantOption = {
  id?: string | number
  name: string
  price?: number | string
}

export type CashierVariantGroup = {
  id?: string | number
  name: string
  type?: 'radio' | 'checkbox'
  options?: CashierVariantOption[]
}

export type CashierMenuItemRaw = {
  id: number
  category: number | string
  category_name?: string
  name: string
  price?: number | string
  effective_price?: number | string
  image_url?: string
  in_stock?: boolean
  variants?: CashierVariantGroup[]
}

export type CashierMenuItem = CashierMenuItemRaw & {
  price: number
  effective_price: number
  image_url: string
  category_name: string
  in_stock: boolean
  variants: CashierVariantGroup[]
}

export type CashierSelectedAddOn = {
  groupName: string
  optionId?: string | number
  optionName: string
  price?: number | string
}

export type CashierCartItem = CashierMenuItem & {
  cartItemId: string
  selectedAddOns?: CashierSelectedAddOn[]
  quantity: number
  note?: string
}

export type CashierOrderItemPayload = {
  menu_item_id: number
  quantity: number
  notes: string
}

export type CashierCategoryOption = {
  id: string
  name: string
}

export type CashierRestaurantSummary = {
  id?: string
  name?: string
  address?: string
  tax_rate?: number | string
}

export type CashierPaymentTransaction = {
  id: number
  reference_id?: string
  transaction_id?: string
  method?: string
  provider?: string
  payment_type?: string
  status?: string
  gross_amount?: number | string
  payment_url?: string
  qr_string?: string
  metadata?: Record<string, unknown>
  paid_at?: string | null
}
