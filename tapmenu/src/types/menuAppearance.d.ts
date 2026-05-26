export type MenuAppearanceRaw = {
  hero_title?: string
  hero_subtitle?: string
  primary_color?: string
  accent_color?: string
  font_style?: string
  bg_pattern?: string
  bg_color?: string
  layout_style?: string
  header_style?: string
  show_banner?: boolean
  show_profile?: boolean
  show_images?: boolean
  show_description?: boolean
  card_radius?: number
  card_shadow?: number
  button_style?: string
  logo_url?: string
  cover_image_url?: string
}

export type MenuAppearance = MenuAppearanceRaw & {
  hero_title: string
  hero_subtitle: string
  primary_color: string
  accent_color: string
  font_style: string
  bg_pattern: string
  bg_color: string
  layout_style: string
  header_style: string
  show_banner: boolean
  show_profile: boolean
  show_images: boolean
  show_description: boolean
  card_radius: number
  card_shadow: number
  button_style: string
  logo_url: string
  cover_image_url: string
}

export type MenuAppearanceSettings = {
  title: string
  description: string
  themeColor: string
  customColor: string | null
  fontStyle: string
  bgPattern: string
  bgColor: string
  layoutStyle: string
  headerStyle: string
  showBanner: boolean
  showProfile: boolean
  showImages: boolean
  showDesc: boolean
  radius: number
  shadow: number
  btnStyle: string
  logoImg: string
  bannerImg: string
}

export type MenuAppearanceWritePayload = {
  hero_title: string
  hero_subtitle: string
  primary_color: string
  accent_color: string
  font_style: string
  bg_pattern: string
  bg_color: string
  layout_style: string
  header_style: string
  show_banner: boolean
  show_profile: boolean
  show_images: boolean
  show_description: boolean
  card_radius: number
  card_shadow: number
  button_style: string
  logo_url: string
  cover_image_url: string
}

export type MenuAppearanceOption = {
  value: string
  label: string
}

export type MenuAppearanceFontOption = {
  value: string
  label: string
  sub: string
  font: string
}
