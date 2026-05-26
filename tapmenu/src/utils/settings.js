/** @typedef {import('../types/settings').DashboardTheme} DashboardTheme */
/** @typedef {import('../types/settings').DashboardSettings} DashboardSettings */
/** @typedef {import('../types/settings').SettingsNotifications} SettingsNotifications */
/** @typedef {import('../types/settings').SettingsPrinter} SettingsPrinter */
/** @typedef {import('../types/settings').SettingsPayment} SettingsPayment */

export const THEME_STORAGE_KEY = 'theme'
export const SETTINGS_STORAGE_KEY = 'dashboard.settings'

/**
 * @returns {DashboardTheme}
 */
export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * @returns {DashboardTheme}
 */
export function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  return getSystemTheme()
}

/**
 * @returns {SettingsNotifications}
 */
export function createDefaultNotifications() {
  return {
    sound: true,
    popup: true,
  }
}

/**
 * @returns {SettingsPrinter}
 */
export function createDefaultPrinterSettings() {
  return {
    paperSize: '58mm',
    autoPrint: false,
  }
}

/**
 * @returns {SettingsPayment}
 */
export function createDefaultPaymentSettings() {
  return {
    cash: true,
    gateway: {
      active: false,
      provider: 'midtrans',
      mode: 'sandbox',
      clientKey: '',
      serverKey: '',
    },
    manual: [
      { id: 1, bank: 'Bank BCA', account: '123-456-7890 a.n Budi Santoso', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
    ],
  }
}

/**
 * @returns {DashboardSettings}
 */
export function createDefaultDashboardSettings() {
  return {
    notifications: createDefaultNotifications(),
    printer: createDefaultPrinterSettings(),
    payment: createDefaultPaymentSettings(),
  }
}

/**
 * @param {Partial<DashboardSettings> | null | undefined} settings
 * @returns {DashboardSettings}
 */
export function normalizeDashboardSettings(settings) {
  const defaults = createDefaultDashboardSettings()

  return {
    notifications: {
      ...defaults.notifications,
      ...(settings?.notifications || {}),
    },
    printer: {
      ...defaults.printer,
      ...(settings?.printer || {}),
    },
    payment: {
      ...defaults.payment,
      ...(settings?.payment || {}),
      gateway: {
        ...defaults.payment.gateway,
        ...(settings?.payment?.gateway || {}),
      },
      manual: Array.isArray(settings?.payment?.manual) && settings.payment.manual.length > 0
        ? settings.payment.manual
        : defaults.payment.manual,
    },
  }
}

/**
 * @param {DashboardTheme} theme
 */
export function applyThemeToDocument(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
