export type CategoryRaw = {
  id: number
  name?: string
  description?: string
  sort_order?: number | string
  is_active?: boolean
  menu_count?: number | string
  icon?: string
}

export type Category = CategoryRaw & {
  name: string
  description: string
  sort_order: number
  is_active: boolean
  menu_count: number
  icon: string
}

export type CategoryFormData = {
  name: string
  description: string
  sort_order: number | string
  is_active: boolean
  icon: string
}

export type CategoryWritePayload = {
  name: string
  description: string
  sort_order: number
  is_active: boolean
}
