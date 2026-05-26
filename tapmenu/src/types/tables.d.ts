export type TableRaw = {
  id: number
  name?: string
  code?: string
  area?: string
  seats?: number | string
  public_token?: string
  is_active?: boolean
}

export type Table = TableRaw & {
  name: string
  code: string
  area: string
  seats: number
  public_token: string
  is_active: boolean
}

export type TableFormData = {
  name: string
  code: string
  area: string
  seats: number | string
  is_active: boolean
}

export type TableWritePayload = {
  name: string
  code: string
  area: string
  seats: number
  is_active: boolean
}
