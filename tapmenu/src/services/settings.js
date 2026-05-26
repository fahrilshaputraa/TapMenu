import {
  SETTINGS_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  getInitialTheme,
  normalizeDashboardSettings,
} from '../utils/settings'

export function loadDashboardSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) {
      return normalizeDashboardSettings()
    }

    return normalizeDashboardSettings(JSON.parse(raw))
  } catch {
    return normalizeDashboardSettings()
  }
}

export function saveDashboardSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  return settings
}

export function loadThemePreference() {
  return getInitialTheme()
}

export function saveThemePreference(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyThemeToDocument(theme)
}
