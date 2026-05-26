export type CustomerFavoriteCategory = 'all' | 'makanan' | 'minuman' | 'cemilan'

export type CustomerFavoriteItem = {
  id: number
  name: string
  description: string
  price: number
  category: Exclude<CustomerFavoriteCategory, 'all'>
  rating: number
  tags: string[]
  image: string
}

export type CustomerFavoriteCategoryOption = {
  id: CustomerFavoriteCategory
  label: string
}
