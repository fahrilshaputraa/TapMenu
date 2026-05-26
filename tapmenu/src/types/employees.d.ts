export type EmployeeRaw = {
  id: number
  full_name?: string
  email?: string
  phone_number?: string
  employee_code?: string
  role?: number | string
  pin_code?: string
  is_active?: boolean
}

export type Employee = EmployeeRaw & {
  full_name: string
  email: string
  phone_number: string
  employee_code: string
  role: number
  pin_code: string
  is_active: boolean
}

export type EmployeeFormData = {
  full_name: string
  email: string
  phone_number: string
  role: number | string
  pin_code: string
  password: string
  is_active: boolean
}

export type EmployeeWritePayload = {
  full_name: string
  email: string
  phone_number: string
  role: number
  is_active: boolean
  pin_code?: string
  password?: string
}

export type EmployeeRoleOption = {
  label: string
  value: number
}
