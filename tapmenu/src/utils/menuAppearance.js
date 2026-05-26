/** @typedef {import('../types/menuAppearance').MenuAppearanceRaw} MenuAppearanceRaw */
/** @typedef {import('../types/menuAppearance').MenuAppearance} MenuAppearance */
/** @typedef {import('../types/menuAppearance').MenuAppearanceSettings} MenuAppearanceSettings */
/** @typedef {import('../types/menuAppearance').MenuAppearanceWritePayload} MenuAppearanceWritePayload */
/** @typedef {import('../types/menuAppearance').MenuAppearanceOption} MenuAppearanceOption */
/** @typedef {import('../types/menuAppearance').MenuAppearanceFontOption} MenuAppearanceFontOption */

export const DEFAULT_MENU_LOGO = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
export const DEFAULT_MENU_BANNER = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
export const DEFAULT_THEME_COLOR = '#1B4332'
export const DEFAULT_BG_COLOR = '#F7F5F2'
export const DEFAULT_ACCENT_COLOR = '#E07A5F'
export const LEGACY_DEFAULT_MENU_TITLE = 'Warung Bu Dewi'
export const LEGACY_DEFAULT_MENU_SUBTITLE = 'Rasanya seperti masakan ibu'

export const MENU_THEME_COLORS = [
  '#1B4332', '#E07A5F', '#2563EB', '#DC2626',
  '#DB2777', '#7C3AED', '#111827', '#78350F',
]

export const MENU_FONT_OPTIONS = [
  { value: 'Plus Jakarta Sans', label: 'Modern', sub: 'Jakarta Sans', font: 'font-sans' },
  { value: 'Inter', label: 'Clean', sub: 'Inter', font: 'font-inter' },
  { value: 'Poppins', label: 'Friendly', sub: 'Poppins', font: 'font-poppins' },
  { value: 'Lato', label: 'Professional', sub: 'Lato', font: 'font-lato' },
]

export const MENU_BG_PATTERN_OPTIONS = [
  { value: 'pattern-none', label: 'Polos' },
  { value: 'pattern-dots', label: 'Bintik' },
  { value: 'pattern-grid', label: 'Kotak' },
]

export const MENU_LAYOUT_OPTIONS = [
  { value: 'list', icon: 'fa-list', label: 'List' },
  { value: 'grid', icon: 'fa-border-all', label: 'Grid' },
]

export const MENU_HEADER_OPTIONS = [
  { value: 'standard', label: 'Kiri' },
  { value: 'center', label: 'Tengah' },
]

export const MENU_BUTTON_STYLE_OPTIONS = [
  { value: 'circle', label: 'Bulat' },
  { value: 'square', label: 'Kotak' },
  { value: 'pill', label: 'Pill (+ Tambah)' },
]

export const MENU_SHADOW_CLASSES = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md']

/**
 * @returns {MenuAppearanceSettings}
 */
export function createDefaultMenuAppearanceSettings() {
  return {
    title: LEGACY_DEFAULT_MENU_TITLE,
    description: LEGACY_DEFAULT_MENU_SUBTITLE,
    themeColor: DEFAULT_THEME_COLOR,
    customColor: null,
    fontStyle: 'Plus Jakarta Sans',
    bgPattern: 'pattern-none',
    bgColor: DEFAULT_BG_COLOR,
    layoutStyle: 'list',
    headerStyle: 'standard',
    showBanner: true,
    showProfile: true,
    showImages: true,
    showDesc: true,
    radius: 12,
    shadow: 1,
    btnStyle: 'circle',
    logoImg: DEFAULT_MENU_LOGO,
    bannerImg: DEFAULT_MENU_BANNER,
  }
}

/**
 * @param {MenuAppearanceRaw | null | undefined} appearance
 * @returns {MenuAppearance}
 */
export function mapMenuAppearance(appearance) {
  return {
    ...appearance,
    hero_title: appearance?.hero_title || LEGACY_DEFAULT_MENU_TITLE,
    hero_subtitle: appearance?.hero_subtitle || LEGACY_DEFAULT_MENU_SUBTITLE,
    primary_color: appearance?.primary_color || DEFAULT_THEME_COLOR,
    accent_color: appearance?.accent_color || DEFAULT_ACCENT_COLOR,
    font_style: appearance?.font_style || 'Plus Jakarta Sans',
    bg_pattern: appearance?.bg_pattern || 'pattern-none',
    bg_color: appearance?.bg_color || DEFAULT_BG_COLOR,
    layout_style: appearance?.layout_style || 'list',
    header_style: appearance?.header_style || 'standard',
    show_banner: appearance?.show_banner ?? true,
    show_profile: appearance?.show_profile ?? true,
    show_images: appearance?.show_images ?? true,
    show_description: appearance?.show_description ?? true,
    card_radius: Number(appearance?.card_radius ?? 12),
    card_shadow: Number(appearance?.card_shadow ?? 1),
    button_style: appearance?.button_style || 'circle',
    logo_url: appearance?.logo_url || DEFAULT_MENU_LOGO,
    cover_image_url: appearance?.cover_image_url || DEFAULT_MENU_BANNER,
  }
}

/**
 * @param {MenuAppearance | null | undefined} appearance
 * @returns {Partial<MenuAppearanceSettings>}
 */
export function mapMenuAppearanceToSettings(appearance) {
  return {
    title: appearance?.hero_title || LEGACY_DEFAULT_MENU_TITLE,
    description: appearance?.hero_subtitle || LEGACY_DEFAULT_MENU_SUBTITLE,
    themeColor: appearance?.primary_color || DEFAULT_THEME_COLOR,
    customColor: null,
    fontStyle: appearance?.font_style || 'Plus Jakarta Sans',
    bgPattern: appearance?.bg_pattern || 'pattern-none',
    bgColor: appearance?.bg_color || DEFAULT_BG_COLOR,
    layoutStyle: appearance?.layout_style || 'list',
    headerStyle: appearance?.header_style || 'standard',
    showBanner: appearance?.show_banner ?? true,
    showProfile: appearance?.show_profile ?? true,
    showImages: appearance?.show_images ?? true,
    showDesc: appearance?.show_description ?? true,
    radius: Number(appearance?.card_radius ?? 12),
    shadow: Number(appearance?.card_shadow ?? 1),
    btnStyle: appearance?.button_style || 'circle',
    logoImg: appearance?.logo_url || DEFAULT_MENU_LOGO,
    bannerImg: appearance?.cover_image_url || DEFAULT_MENU_BANNER,
  }
}

export function shouldUseStoreNameAsMenuTitle(title) {
  return !title || title === LEGACY_DEFAULT_MENU_TITLE || title === 'Pesan langsung dari meja Anda'
}

export function shouldUseStoreDescriptionAsMenuSubtitle(subtitle) {
  return !subtitle || subtitle === LEGACY_DEFAULT_MENU_SUBTITLE || subtitle === 'Scan QR, pilih menu, lalu bayar tanpa antre.'
}

/**
 * @param {string | null | undefined} themeColor
 * @param {string | null | undefined} customColor
 * @returns {string}
 */
export function getActiveMenuColor(themeColor, customColor) {
  return customColor || themeColor || DEFAULT_THEME_COLOR
}

/**
 * @param {string} fontStyle
 * @returns {string}
 */
export function getMenuFontFamily(fontStyle) {
  if (fontStyle === 'Inter') return '"Inter", sans-serif'
  if (fontStyle === 'Poppins') return '"Poppins", sans-serif'
  if (fontStyle === 'Lato') return '"Lato", sans-serif'
  if (fontStyle === 'Playfair Display') return '"Playfair Display", serif'
  return '"Plus Jakarta Sans", sans-serif'
}

/**
 * @param {string} fontStyle
 * @returns {string}
 */
export function getMenuTitleFontFamily(fontStyle) {
  if (fontStyle === 'Playfair Display') return '"Playfair Display", serif'
  return getMenuFontFamily(fontStyle)
}

export function getMenuPatternStyle(bgPattern, bgColor) {
  if (bgPattern === 'pattern-dots') {
    return {
      backgroundColor: bgColor,
      backgroundImage: 'radial-gradient(rgba(17, 24, 39, 0.08) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    }
  }

  if (bgPattern === 'pattern-grid') {
    return {
      backgroundColor: bgColor,
      backgroundImage:
        'linear-gradient(rgba(17, 24, 39, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 24, 39, 0.06) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
    }
  }

  return { backgroundColor: bgColor }
}

/**
 * @param {MenuAppearanceSettings} settings
 * @returns {MenuAppearanceWritePayload}
 */
export function buildMenuAppearancePayload(settings) {
  const activeColor = getActiveMenuColor(settings.themeColor, settings.customColor)

  return {
    hero_title: settings.title,
    hero_subtitle: settings.description,
    primary_color: activeColor,
    accent_color: DEFAULT_ACCENT_COLOR,
    font_style: settings.fontStyle,
    bg_pattern: settings.bgPattern,
    bg_color: settings.bgColor,
    layout_style: settings.layoutStyle,
    header_style: settings.headerStyle,
    show_banner: settings.showBanner,
    show_profile: settings.showProfile,
    show_images: settings.showImages,
    show_description: settings.showDesc,
    card_radius: settings.radius,
    card_shadow: settings.shadow,
    button_style: settings.btnStyle,
    logo_url: settings.logoImg,
    cover_image_url: settings.bannerImg,
  }
}
