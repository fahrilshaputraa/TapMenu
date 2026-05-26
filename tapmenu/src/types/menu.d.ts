export type MenuCategory = {
  id: number
  name: string
}

export type MenuVariantOption = {
  id: string
  name: string
  price: number
}

export type MenuVariantGroup = {
  id: string
  name: string
  type: string
  options: MenuVariantOption[]
}

export type MenuItemRaw = {
  id: number
  name?: string
  category?: number | string
  category_name?: string
  price?: number | string
  effective_price?: number | string
  in_stock?: boolean
  stock_quantity?: number | string
  image_url?: string
  description?: string
  discount_percentage?: number | string
  tax_percentage?: number | string
  is_available?: boolean
  is_featured?: boolean
  is_new?: boolean
  variants?: MenuVariantGroup[]
  track_stock?: boolean
  preparation_time_minutes?: number | string
}

export type MenuItem = {
  id: number
  name: string
  category: string
  categoryName: string
  price: number
  effectivePrice: number
  stock: boolean
  stockAmount: number
  image: string
  description: string
  discount: number
  tax: number
  isActive: boolean
  isFavorite: boolean
  isNew: boolean
  variants: MenuVariantGroup[]
  trackStock: boolean
  preparationTime: number
}

export type MenuFormData = {
  name: string
  category: string
  description: string
  price: number | string
  discount: number | string
  tax: number | string
  stock: number | string
  image: string
  isActive: boolean
  isFavorite: boolean
  isNew: boolean
  trackStock: boolean
  variants: MenuVariantGroup[]
}

export type MenuWritePayload = {
  category: number
  name: string
  description: string
  price: number
  discount_percentage: number
  tax_percentage: number
  image_url: string
  track_stock: boolean
  stock_quantity: number
  preparation_time_minutes: number
  is_available: boolean
  is_featured: boolean
  is_new: boolean
  variants: MenuVariantGroup[]
}
