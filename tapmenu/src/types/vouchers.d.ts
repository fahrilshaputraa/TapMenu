export type VoucherRaw = {
  id: number
  code?: string
  name?: string
  discount_type?: string
  amount?: number | string
  minimum_spend?: number | string
  max_discount?: number | string | null
  valid_from?: string | null
  valid_until?: string | null
  is_active?: boolean
}

export type Voucher = VoucherRaw & {
  code: string
  name: string
  discount_type: string
  amount: number
  minimum_spend: number
  max_discount: number | null
  valid_from: string
  valid_until: string
  is_active: boolean
}

export type VoucherFormData = {
  code: string
  name: string
  discount_type: string
  amount: number | string
  minimum_spend: number | string
  max_discount: number | string
  valid_from: string
  valid_until: string
  is_active: boolean
}

export type VoucherWritePayload = {
  code: string
  name: string
  discount_type: string
  amount: number
  minimum_spend: number
  max_discount: number | null
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
}
