export type DashboardTheme = 'light' | 'dark'

export type SettingsNotifications = {
  sound: boolean
  popup: boolean
}

export type SettingsPrinter = {
  paperSize: '58mm' | '80mm'
  autoPrint: boolean
}

export type SettingsPaymentGateway = {
  active: boolean
  provider: string
  mode: string
  clientKey: string
  serverKey: string
}

export type SettingsManualBank = {
  id: number
  bank: string
  account: string
  icon: string
}

export type SettingsPayment = {
  cash: boolean
  gateway: SettingsPaymentGateway
  manual: SettingsManualBank[]
}

export type DashboardSettings = {
  notifications: SettingsNotifications
  printer: SettingsPrinter
  payment: SettingsPayment
}
