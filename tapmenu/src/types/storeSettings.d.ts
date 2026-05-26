export type StoreOperationalDays = {
  senin: boolean
  selasa: boolean
  rabu: boolean
  kamis: boolean
  jumat: boolean
  sabtu: boolean
  minggu: boolean
}

export type StoreData = {
  name: string
  slogan: string
  category: string
  phone: string
  address: string
  instagram: string
  googleMaps: string
  openTime: string
  closeTime: string
}

export type StoreSettingsForm = {
  acceptOnlineOrders: boolean
  showPrices: boolean
  newOrderNotification: boolean
}

export type RestaurantAppearanceRaw = {
  logo_url?: string
  cover_image_url?: string
}

export type RestaurantProfileRaw = {
  id?: number | string
  name?: string
  slug?: string
  description?: string
  phone_number?: string
  address?: string
  opening_time?: string
  closing_time?: string
  operational_days?: Partial<StoreOperationalDays>
  is_open?: boolean
  appearance?: RestaurantAppearanceRaw
}

export type RestaurantProfile = RestaurantProfileRaw & {
  id: string
  name: string
  slug: string
  description: string
  phone_number: string
  address: string
  opening_time: string
  closing_time: string
  operational_days: StoreOperationalDays
  is_open: boolean
  appearance: {
    logo_url: string
    cover_image_url: string
  }
}

export type StoreSettingsViewData = {
  restaurantId: string
  storeData: StoreData
  operationalDays: StoreOperationalDays
  settings: StoreSettingsForm
  logoImg: string
  bannerImg: string
}

export type RestaurantProfileWritePayload = {
  name: string
  slug: string
  description: string
  phone_number: string
  address: string
  opening_time: string
  closing_time: string
  operational_days: StoreOperationalDays
  is_open: boolean
  appearance: {
    logo_url: string
    cover_image_url: string
  }
}
