import { api } from './api'
import { mapVoucher, mapVoucherCollection } from '../utils/vouchers'

/** @typedef {import('../types/vouchers').Voucher} Voucher */
/** @typedef {import('../types/vouchers').VoucherWritePayload} VoucherWritePayload */

/**
 * @returns {Promise<Voucher[]>}
 */
export async function loadVouchers() {
  const payload = await api.get('/api/v1/settings/vouchers/')
  const results = Array.isArray(payload?.results) ? payload.results : (payload || [])
  return mapVoucherCollection(results)
}

/**
 * @param {VoucherWritePayload} payload
 * @returns {Promise<Voucher>}
 */
export async function createVoucher(payload) {
  const created = await api.post('/api/v1/settings/vouchers/', payload)
  return mapVoucher(created)
}

/**
 * @param {number} voucherId
 * @param {VoucherWritePayload} payload
 * @returns {Promise<Voucher>}
 */
export async function updateVoucher(voucherId, payload) {
  const updated = await api.put(`/api/v1/settings/vouchers/${voucherId}/`, payload)
  return mapVoucher(updated)
}

/**
 * @param {Voucher} voucher
 * @returns {Promise<Voucher>}
 */
export async function toggleVoucherStatus(voucher) {
  const updated = await api.patch(`/api/v1/settings/vouchers/${voucher.id}/`, {
    is_active: !voucher.is_active,
  })
  return mapVoucher(updated)
}

/**
 * @param {number} voucherId
 * @returns {Promise<void>}
 */
export async function deleteVoucher(voucherId) {
  await api.delete(`/api/v1/settings/vouchers/${voucherId}/`)
}
