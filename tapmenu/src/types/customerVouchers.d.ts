export type CustomerVoucherStatus = 'active' | 'used' | 'expired'

export type CustomerVoucherType = 'percentage' | 'cash' | 'bonus'

export type CustomerVoucherTab = 'active' | 'history'

export type CustomerVoucher = {
  id: number
  title: string
  code: string
  description: string
  minOrder: number
  expiresAt: string
  status: CustomerVoucherStatus
  type: CustomerVoucherType
  value: number | null
}

export type CustomerVoucherStatusInfo = {
  label: string
  className: string
}

export type CustomerVoucherClaimStatus = {
  type: 'success' | 'info' | 'error'
  message: string
}

export type CustomerVoucherClaimResult = {
  nextVouchers: CustomerVoucher[]
  nextVoucherCode: string
  claimStatus: CustomerVoucherClaimStatus
}
