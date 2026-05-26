/** @typedef {import('../types/profile').ProfileUserRaw} ProfileUserRaw */
/** @typedef {import('../types/profile').ProfileUser} ProfileUser */
/** @typedef {import('../types/profile').ProfileFormData} ProfileFormData */
/** @typedef {import('../types/profile').ProfilePasswordForm} ProfilePasswordForm */
/** @typedef {import('../types/profile').ProfilePinForm} ProfilePinForm */
/** @typedef {import('../types/profile').ProfileWritePayload} ProfileWritePayload */

export const DEFAULT_PROFILE_AVATAR = 'https://i.pravatar.cc/150?img=5'

export function createDefaultProfileFormData() {
  return {
    name: 'Budi Santoso',
    email: 'budi.warung@gmail.com',
    phone: '0812-3456-7890',
    role: 'Owner',
    avatar: DEFAULT_PROFILE_AVATAR,
    joinDate: '12 Januari 2023',
  }
}

export function createDefaultPasswordForm() {
  return {
    new: '',
    confirm: '',
  }
}

export function createDefaultPinForm() {
  return {
    next: '',
    confirm: '',
  }
}

export function mapProfileUser(user) {
  return {
    ...user,
    id: String(user?.id || ''),
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    role: Number(user?.role || 0),
  }
}

export function mapProfileFormData(user, roleLabel) {
  const defaults = createDefaultProfileFormData()
  return {
    ...defaults,
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    role: roleLabel || defaults.role,
  }
}

export function buildProfilePayload(profileData, passwords, pinData) {
  const payload = {
    full_name: profileData.name,
    email: profileData.email,
    phone_number: profileData.phone,
  }

  if (passwords.new) {
    payload.password = passwords.new
  }

  if (pinData.next) {
    payload.pin_code = pinData.next
  }

  return payload
}

export function validateProfileSecurity(passwords, pinData, canChangePin) {
  if (passwords.new && passwords.new !== passwords.confirm) {
    return 'Konfirmasi password belum sama.'
  }

  if (pinData.next || pinData.confirm) {
    if (!canChangePin) {
      return 'PIN hanya tersedia untuk akun kasir.'
    }
    if (!/^\d{4,6}$/.test(pinData.next)) {
      return 'PIN kasir harus terdiri dari 4 sampai 6 digit angka.'
    }
    if (pinData.next !== pinData.confirm) {
      return 'Konfirmasi PIN belum sama.'
    }
  }

  return ''
}
