/** @typedef {import('../types/customerVouchers').CustomerVoucher} CustomerVoucher */
/** @typedef {import('../types/customerVouchers').CustomerVoucherTab} CustomerVoucherTab */
/** @typedef {import('../types/customerVouchers').CustomerVoucherStatus} CustomerVoucherStatus */
/** @typedef {import('../types/customerVouchers').CustomerVoucherStatusInfo} CustomerVoucherStatusInfo */
/** @typedef {import('../types/customerVouchers').CustomerVoucherClaimResult} CustomerVoucherClaimResult */

/** @type {CustomerVoucher[]} */
export const defaultCustomerVouchers = [
  {
    id: 1,
    title: 'Diskon 20% Menu Spesial',
    code: 'BUDEWI20',
    description: 'Berlaku untuk semua menu signature.',
    minOrder: 50000,
    expiresAt: '30 Okt 2023',
    status: 'active',
    type: 'percentage',
    value: 20,
  },
  {
    id: 2,
    title: 'Cashback Rp 15.000',
    code: 'CB15000',
    description: 'Cashback berlaku untuk dine-in minimal Rp 75.000.',
    minOrder: 75000,
    expiresAt: '5 Nov 2023',
    status: 'active',
    type: 'cash',
    value: 15000,
  },
  {
    id: 3,
    title: 'Gratis Es Teh Manis',
    code: 'GRATISTEH',
    description: 'Bonus 1 gelas es teh manis untuk min order Rp 25.000.',
    minOrder: 25000,
    expiresAt: '19 Okt 2023',
    status: 'used',
    type: 'bonus',
    value: null,
  },
  {
    id: 4,
    title: 'Diskon 10% All Menu',
    code: 'ALL10',
    description: 'Tidak berlaku untuk paket hemat.',
    minOrder: 40000,
    expiresAt: '12 Okt 2023',
    status: 'expired',
    type: 'percentage',
    value: 10,
  },
]

/** @type {Record<CustomerVoucherStatus, CustomerVoucherStatusInfo>} */
export const customerVoucherStatusLabels = {
  active: { label: 'Aktif', className: 'bg-green-100 text-green-700' },
  used: { label: 'Sudah Dipakai', className: 'bg-blue-100 text-blue-700' },
  expired: { label: 'Kedaluwarsa', className: 'bg-gray-100 text-gray-500' },
}

/** @type {Record<string, Omit<CustomerVoucher, 'id'>>} */
export const redeemableCustomerVouchersByCode = {
  FRESH10: {
    title: 'Diskon 10% Menu Sehat',
    code: 'FRESH10',
    description: 'Diskon khusus menu sehat dan sayur.',
    minOrder: 40000,
    expiresAt: '12 Nov 2023',
    status: 'active',
    type: 'percentage',
    value: 10,
  },
  ONGKIR0: {
    title: 'Gratis Ongkir',
    code: 'ONGKIR0',
    description: 'Berlaku untuk layanan antar min Rp 60.000.',
    expiresAt: '30 Nov 2023',
    minOrder: 60000,
    status: 'active',
    type: 'cash',
    value: 10000,
  },
}

/**
 * @param {number | null | undefined} value
 * @returns {string}
 */
export function formatCustomerVoucherRupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

/**
 * @param {CustomerVoucher[]} vouchers
 * @param {CustomerVoucherTab} tab
 * @returns {CustomerVoucher[]}
 */
export function filterCustomerVouchers(vouchers, tab) {
  if (tab === 'active') {
    return vouchers.filter((voucher) => voucher.status === 'active')
  }

  return vouchers.filter((voucher) => voucher.status !== 'active')
}

/**
 * @param {CustomerVoucherTab} tab
 * @returns {string}
 */
export function getCustomerVoucherEmptyStateText(tab) {
  return tab === 'active'
    ? 'Belum ada voucher aktif saat ini.'
    : 'Belum ada riwayat penggunaan voucher.'
}

/**
 * @param {CustomerVoucher} voucher
 * @returns {string}
 */
export function getCustomerVoucherBenefitLabel(voucher) {
  if (voucher.type === 'percentage') {
    return `Diskon ${voucher.value}%`
  }

  if (voucher.type === 'cash') {
    return `Potongan ${formatCustomerVoucherRupiah(voucher.value)}`
  }

  return 'Bonus Spesial'
}

/**
 * @param {CustomerVoucher[]} vouchers
 * @param {string} voucherCode
 * @returns {CustomerVoucherClaimResult}
 */
export function claimCustomerVoucher(vouchers, voucherCode) {
  const code = voucherCode.trim().toUpperCase()

  if (!code) {
    return {
      nextVouchers: vouchers,
      nextVoucherCode: voucherCode,
      claimStatus: { type: 'error', message: 'Masukkan kode voucher terlebih dahulu.' },
    }
  }

  if (vouchers.some((voucher) => voucher.code === code)) {
    return {
      nextVouchers: vouchers,
      nextVoucherCode: voucherCode,
      claimStatus: { type: 'info', message: 'Kode sudah ada di daftar voucher kamu.' },
    }
  }

  const voucherTemplate = redeemableCustomerVouchersByCode[code]
  if (!voucherTemplate) {
    return {
      nextVouchers: vouchers,
      nextVoucherCode: voucherCode,
      claimStatus: { type: 'error', message: 'Kode voucher tidak ditemukan.' },
    }
  }

  return {
    nextVouchers: [
      { ...voucherTemplate, id: Date.now() },
      ...vouchers,
    ],
    nextVoucherCode: '',
    claimStatus: { type: 'success', message: 'Voucher berhasil diklaim!' },
  }
}
