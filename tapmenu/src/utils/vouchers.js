/** @typedef {import('../types/vouchers').VoucherRaw} VoucherRaw */
/** @typedef {import('../types/vouchers').Voucher} Voucher */
/** @typedef {import('../types/vouchers').VoucherFormData} VoucherFormData */
/** @typedef {import('../types/vouchers').VoucherWritePayload} VoucherWritePayload */

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function toDateInput(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

/**
 * @param {string} value
 * @param {boolean} endOfDay
 * @returns {string | null}
 */
export function toApiDate(value, endOfDay = false) {
  if (!value) return null
  return `${value}T${endOfDay ? '23:59:59' : '00:00:00'}`
}

/**
 * @param {number | string | null | undefined} num
 * @returns {string}
 */
export function formatVoucherRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(num || 0))
}

/**
 * @param {VoucherRaw} voucher
 * @returns {Voucher}
 */
export function mapVoucher(voucher) {
  return {
    ...voucher,
    code: voucher?.code || '',
    name: voucher?.name || '',
    discount_type: voucher?.discount_type || 'percentage',
    amount: Number(voucher?.amount || 0),
    minimum_spend: Number(voucher?.minimum_spend || 0),
    max_discount: voucher?.max_discount === null || voucher?.max_discount === undefined || voucher?.max_discount === ''
      ? null
      : Number(voucher.max_discount),
    valid_from: voucher?.valid_from || '',
    valid_until: voucher?.valid_until || '',
    is_active: Boolean(voucher?.is_active),
  }
}

/**
 * @param {VoucherRaw[]} vouchers
 * @returns {Voucher[]}
 */
export function mapVoucherCollection(vouchers) {
  return (vouchers || []).map(mapVoucher)
}

/**
 * @returns {VoucherFormData}
 */
export function createDefaultVoucherFormData() {
  return {
    code: '',
    name: '',
    discount_type: 'percentage',
    amount: '',
    minimum_spend: '',
    max_discount: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  }
}

/**
 * @param {Voucher | null | undefined} voucher
 * @returns {VoucherFormData}
 */
export function createVoucherFormData(voucher) {
  if (!voucher) {
    return createDefaultVoucherFormData()
  }

  return {
    code: voucher.code || '',
    name: voucher.name || '',
    discount_type: voucher.discount_type || 'percentage',
    amount: voucher.amount || '',
    minimum_spend: voucher.minimum_spend || '',
    max_discount: voucher.max_discount ?? '',
    valid_from: toDateInput(voucher.valid_from),
    valid_until: toDateInput(voucher.valid_until),
    is_active: Boolean(voucher.is_active),
  }
}

/**
 * @param {VoucherFormData} formData
 * @returns {VoucherWritePayload}
 */
export function buildVoucherPayload(formData) {
  return {
    code: formData.code.toUpperCase(),
    name: formData.name,
    discount_type: formData.discount_type,
    amount: Number(formData.amount),
    minimum_spend: Number(formData.minimum_spend || 0),
    max_discount: formData.max_discount ? Number(formData.max_discount) : null,
    valid_from: toApiDate(formData.valid_from),
    valid_until: toApiDate(formData.valid_until, true),
    is_active: formData.is_active,
  }
}
