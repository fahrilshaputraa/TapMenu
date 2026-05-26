import { api } from './api'
import { mapTable, mapTableCollection } from '../utils/tables'

/** @typedef {import('../types/tables').Table} Table */
/** @typedef {import('../types/tables').TableWritePayload} TableWritePayload */

/**
 * @returns {Promise<Table[]>}
 */
export async function loadTables() {
  const payload = await api.get('/api/v1/settings/tables/')
  const results = Array.isArray(payload?.results) ? payload.results : (payload || [])
  return mapTableCollection(results)
}

/**
 * @param {number | string} tableId
 * @returns {Promise<Table>}
 */
export async function loadTable(tableId) {
  const payload = await api.get(`/api/v1/settings/tables/${tableId}/`)
  return mapTable(payload)
}

/**
 * @param {TableWritePayload} payload
 * @returns {Promise<Table>}
 */
export async function createTable(payload) {
  const created = await api.post('/api/v1/settings/tables/', payload)
  return mapTable(created)
}

/**
 * @param {number | string} tableId
 * @param {TableWritePayload} payload
 * @returns {Promise<Table>}
 */
export async function updateTable(tableId, payload) {
  const updated = await api.put(`/api/v1/settings/tables/${tableId}/`, payload)
  return mapTable(updated)
}

/**
 * @param {number | string} tableId
 * @returns {Promise<void>}
 */
export async function deleteTable(tableId) {
  await api.delete(`/api/v1/settings/tables/${tableId}/`)
}
