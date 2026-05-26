import { api } from './api'
import { mapMenuItem, mapMenuItemCollection } from '../utils/menu'

export async function loadMenuManagementData() {
  const [categoryPayload, itemPayload] = await Promise.all([
    api.get('/api/v1/catalogs/categories/'),
    api.get('/api/v1/catalogs/items/'),
  ])

  const categories = Array.isArray(categoryPayload?.results) ? categoryPayload.results : (categoryPayload || [])
  const items = Array.isArray(itemPayload?.results) ? itemPayload.results : (itemPayload || [])

  return {
    categories,
    items: mapMenuItemCollection(items),
  }
}

export async function createMenuItem(payload) {
  const created = await api.post('/api/v1/catalogs/items/', payload)
  return mapMenuItem(created)
}

export async function updateMenuItem(itemId, payload) {
  const updated = await api.put(`/api/v1/catalogs/items/${itemId}/`, payload)
  return mapMenuItem(updated)
}

export async function deleteMenuItem(itemId) {
  await api.delete(`/api/v1/catalogs/items/${itemId}/`)
}

export async function toggleMenuItemStatus(item) {
  const updated = await api.patch(`/api/v1/catalogs/items/${item.id}/`, { is_available: !item.isActive })
  return mapMenuItem(updated)
}
