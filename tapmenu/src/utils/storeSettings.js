/** @typedef {import('../types/storeSettings').RestaurantProfileRaw} RestaurantProfileRaw */
/** @typedef {import('../types/storeSettings').RestaurantProfile} RestaurantProfile */
/** @typedef {import('../types/storeSettings').StoreData} StoreData */
/** @typedef {import('../types/storeSettings').StoreOperationalDays} StoreOperationalDays */
/** @typedef {import('../types/storeSettings').StoreSettingsForm} StoreSettingsForm */
/** @typedef {import('../types/storeSettings').StoreSettingsViewData} StoreSettingsViewData */
/** @typedef {import('../types/storeSettings').RestaurantProfileWritePayload} RestaurantProfileWritePayload */

export const DEFAULT_LOGO_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'

/**
 * @returns {StoreData}
 */
export function createDefaultStoreData() {
  return {
    name: 'Warung Bu Dewi',
    slogan: 'Rasanya seperti masakan ibu',
    category: 'Warung Makan',
    phone: '81234567890',
    address: 'Jl. Merdeka No. 45, RT 02/RW 05, Kecamatan Bandung Wetan, Kota Bandung, Jawa Barat',
    instagram: 'warungbudewi',
    googleMaps: '',
    openTime: '08:00',
    closeTime: '22:00',
  }
}

/**
 * @returns {StoreOperationalDays}
 */
export function createDefaultOperationalDays() {
  return {
    senin: true,
    selasa: true,
    rabu: true,
    kamis: true,
    jumat: true,
    sabtu: true,
    minggu: false,
  }
}

/**
 * @returns {StoreSettingsForm}
 */
export function createDefaultStoreSettings() {
  return {
    acceptOnlineOrders: true,
    showPrices: true,
    newOrderNotification: true,
  }
}

/**
 * @param {RestaurantProfileRaw | null | undefined} profile
 * @returns {RestaurantProfile}
 */
export function mapRestaurantProfile(profile) {
  return {
    ...profile,
    id: String(profile?.id || ''),
    name: profile?.name || '',
    slug: profile?.slug || '',
    description: profile?.description || '',
    phone_number: profile?.phone_number || '',
    address: profile?.address || '',
    opening_time: profile?.opening_time || '08:00',
    closing_time: profile?.closing_time || '22:00',
    operational_days: {
      ...createDefaultOperationalDays(),
      ...(profile?.operational_days || {}),
    },
    is_open: profile?.is_open !== false,
    appearance: {
      logo_url: profile?.appearance?.logo_url || '',
      cover_image_url: profile?.appearance?.cover_image_url || '',
    },
  }
}

/**
 * @param {RestaurantProfile} profile
 * @returns {StoreSettingsViewData}
 */
export function mapStoreSettingsViewData(profile) {
  return {
    restaurantId: profile.id,
    storeData: {
      ...createDefaultStoreData(),
      name: profile.name || '',
      slogan: profile.description || '',
      phone: normalizeStorePhone(profile.phone_number),
      address: profile.address || '',
      openTime: profile.opening_time || '08:00',
      closeTime: profile.closing_time || '22:00',
    },
    operationalDays: {
      ...createDefaultOperationalDays(),
      ...(profile.operational_days || {}),
    },
    settings: {
      ...createDefaultStoreSettings(),
      acceptOnlineOrders: profile.is_open !== false,
    },
    logoImg: profile.appearance.logo_url || DEFAULT_LOGO_IMAGE,
    bannerImg: profile.appearance.cover_image_url || '',
  }
}

/**
 * @param {string | null | undefined} phoneNumber
 * @returns {string}
 */
export function normalizeStorePhone(phoneNumber) {
  return String(phoneNumber || '').replace(/^\+?62/, '')
}

/**
 * @param {string} name
 * @returns {string}
 */
export function buildStoreSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 255)
}

/**
 * @param {StoreData} storeData
 * @param {StoreOperationalDays} operationalDays
 * @param {StoreSettingsForm} settings
 * @param {string} logoImg
 * @param {string} bannerImg
 * @returns {RestaurantProfileWritePayload}
 */
export function buildStoreSettingsPayload(storeData, operationalDays, settings, logoImg, bannerImg) {
  return {
    name: storeData.name,
    slug: buildStoreSlug(storeData.name),
    description: storeData.slogan,
    phone_number: storeData.phone ? `62${storeData.phone.replace(/^0+/, '')}` : '',
    address: storeData.address,
    opening_time: storeData.openTime,
    closing_time: storeData.closeTime,
    operational_days: operationalDays,
    is_open: settings.acceptOnlineOrders,
    appearance: {
      logo_url: logoImg.startsWith('data:') ? '' : logoImg,
      cover_image_url: bannerImg.startsWith('data:') ? '' : bannerImg,
    },
  }
}
