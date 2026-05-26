/** @typedef {import('../types/auth').AuthFeatureStep} AuthFeatureStep */
/** @typedef {import('../types/auth').CustomerLoginFormData} CustomerLoginFormData */

/** @type {AuthFeatureStep[]} */
export const customerLoginQuickSteps = [
  {
    icon: 'fa-solid fa-qrcode',
    title: 'Scan QR',
    description: 'Masuk lewat kode meja atau link yang dibagikan kasir.',
  },
  {
    icon: 'fa-solid fa-bowl-food',
    title: 'Pilih Menu',
    description: 'Tambah menu favorit ke keranjang dan atur jumlahnya.',
  },
  {
    icon: 'fa-solid fa-receipt',
    title: 'Pantau Status',
    description: 'Lihat progres pesanan dan riwayat transaksi Anda.',
  },
]

/**
 * @returns {CustomerLoginFormData}
 */
export function createCustomerLoginFormData() {
  return {
    email: '',
    accessCode: '',
    password: '',
  }
}

/**
 * @param {CustomerLoginFormData} formData
 * @returns {string}
 */
export function resolveCustomerLoginSecret(formData) {
  return formData.password || formData.accessCode || ''
}

/**
 * @param {unknown} err
 * @returns {string}
 */
export function getCustomerLoginErrorMessage(err) {
  if (err && typeof err === 'object' && 'message' in err && err.message) {
    return String(err.message)
  }

  return 'Login gagal, gunakan email terdaftar.'
}
