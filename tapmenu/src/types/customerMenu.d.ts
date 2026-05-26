export type CustomerMenuRestaurantRaw = {
  id?: number | string
  name?: string
  description?: string
  address?: string
  is_open?: boolean
  opening_time?: string
  closing_time?: string
  operational_days?: Record<string, boolean>
  appearance?: {
    hero_subtitle?: string
    logo_url?: string
    cover_image_url?: string
  }
}

export type CustomerMenuTableRaw = {
  id?: number | string
  name?: string
}

export type CustomerMenuCategoryRaw = {
  id?: number | string
  name?: string
}

export type CustomerMenuItemRaw = {
  id: number
  name?: string
  description?: string
  category?: number | string
  image_url?: string
  price?: number | string
  effective_price?: number | string
  in_stock?: boolean
  is_featured?: boolean
}

export type CustomerMenuPayloadRaw = {
  restaurant?: CustomerMenuRestaurantRaw
  table?: CustomerMenuTableRaw
  categories?: CustomerMenuCategoryRaw[]
  items?: CustomerMenuItemRaw[]
}

export type CustomerMenuCategory = {
  id: string
  name: string
  icon: string
}

export type CustomerMenuItem = CustomerMenuItemRaw & {
  name: string
  description: string
  category: string
  image_url: string
  price: number
  effective_price: number
  in_stock: boolean
  is_featured: boolean
}

export type CustomerRestaurantInfo = {
  name: string
  description: string
  address: string
  openStatus: string
  businessHours: string
  logo: string
  banner: string
}

export type CustomerCartItem = CustomerMenuItem & {
  quantity: number
}

export type CustomerPublicOrder = {
  order_code?: string
  status?: string
  total_amount?: number | string
  tax_amount?: number | string
  created_at?: string
  table_name?: string
  items?: Array<Record<string, unknown>>
}
