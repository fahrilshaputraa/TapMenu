/** @typedef {import('../types/employees').EmployeeRaw} EmployeeRaw */
/** @typedef {import('../types/employees').Employee} Employee */
/** @typedef {import('../types/employees').EmployeeFormData} EmployeeFormData */
/** @typedef {import('../types/employees').EmployeeWritePayload} EmployeeWritePayload */
/** @typedef {import('../types/employees').EmployeeRoleOption} EmployeeRoleOption */

export const ROLE_OPTIONS = [
  { label: 'Manager', value: 2 },
  { label: 'Cashier', value: 3 },
  { label: 'Kitchen', value: 4 },
]

/**
 * @param {EmployeeRaw} employee
 * @returns {Employee}
 */
export function mapEmployee(employee) {
  return {
    ...employee,
    full_name: employee?.full_name || '',
    email: employee?.email || '',
    phone_number: employee?.phone_number || '',
    employee_code: employee?.employee_code || '',
    role: Number(employee?.role || 3),
    pin_code: employee?.pin_code || '',
    is_active: employee?.is_active !== false,
  }
}

/**
 * @param {EmployeeRaw[]} employees
 * @returns {Employee[]}
 */
export function mapEmployeeCollection(employees) {
  return (employees || []).map(mapEmployee)
}

/**
 * @returns {EmployeeFormData}
 */
export function createDefaultEmployeeFormData() {
  return {
    full_name: '',
    email: '',
    phone_number: '',
    role: 3,
    pin_code: '',
    password: '',
    is_active: true,
  }
}

/**
 * @param {Employee | null | undefined} employee
 * @returns {EmployeeFormData}
 */
export function createEmployeeFormData(employee) {
  if (!employee) {
    return createDefaultEmployeeFormData()
  }

  return {
    full_name: employee.full_name || '',
    email: employee.email || '',
    phone_number: employee.phone_number || '',
    role: Number(employee.role || 3),
    pin_code: '',
    password: '',
    is_active: employee.is_active !== false,
  }
}

/**
 * @param {EmployeeFormData} formData
 * @returns {EmployeeWritePayload}
 */
export function buildEmployeePayload(formData) {
  const payload = {
    full_name: formData.full_name.trim(),
    email: formData.email.trim(),
    phone_number: formData.phone_number.trim(),
    role: Number(formData.role || 3),
    is_active: formData.is_active,
  }

  if (formData.pin_code.trim()) {
    payload.pin_code = formData.pin_code.trim()
  }

  if (formData.password.trim()) {
    payload.password = formData.password.trim()
  }

  return payload
}

/**
 * @param {Employee[]} employees
 * @param {string} searchQuery
 * @returns {Employee[]}
 */
export function filterEmployees(employees, searchQuery) {
  const keyword = searchQuery.toLowerCase()

  return employees.filter((employee) => (
    String(employee.full_name || '').toLowerCase().includes(keyword) ||
    String(employee.email || '').toLowerCase().includes(keyword) ||
    String(employee.employee_code || '').toLowerCase().includes(keyword)
  ))
}

/**
 * @param {Employee[]} employees
 * @returns {{ activeCount: number }}
 */
export function getEmployeeStats(employees) {
  return {
    activeCount: employees.filter((employee) => employee.is_active).length,
  }
}

/**
 * @param {Employee} employee
 * @returns {string}
 */
export function getEmployeeAvatarUrl(employee) {
  return `https://i.pravatar.cc/150?u=${employee.email || employee.id}`
}

/**
 * @param {Employee} employee
 * @returns {string}
 */
export function getEmployeeRowClass(employee) {
  return employee.is_active ? '' : 'opacity-50 bg-gray-50'
}
