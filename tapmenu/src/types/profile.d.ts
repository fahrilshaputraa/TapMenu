export type ProfileUserRaw = {
  id?: number | string
  full_name?: string
  email?: string
  phone_number?: string
  role?: number | string
}

export type ProfileUser = ProfileUserRaw & {
  id: string
  full_name: string
  email: string
  phone_number: string
  role: number
}

export type ProfileFormData = {
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  joinDate: string
}

export type ProfilePasswordForm = {
  new: string
  confirm: string
}

export type ProfilePinForm = {
  next: string
  confirm: string
}

export type ProfileWritePayload = {
  full_name: string
  email: string
  phone_number: string
  password?: string
  pin_code?: string
}
