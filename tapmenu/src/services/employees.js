import { api } from './api'
import { mapEmployee, mapEmployeeCollection } from '../utils/employees'

/** @typedef {import('../types/employees').Employee} Employee */
/** @typedef {import('../types/employees').EmployeeWritePayload} EmployeeWritePayload */

/**
 * @returns {Promise<Employee[]>}
 */
export async function loadEmployees() {
  const payload = await api.get('/api/v1/auth/employees/')
  const results = Array.isArray(payload?.results) ? payload.results : (payload || [])
  return mapEmployeeCollection(results)
}

/**
 * @param {EmployeeWritePayload} payload
 * @returns {Promise<Employee>}
 */
export async function createEmployee(payload) {
  const created = await api.post('/api/v1/auth/employees/', payload)
  return mapEmployee(created)
}

/**
 * @param {number | string} employeeId
 * @param {EmployeeWritePayload} payload
 * @returns {Promise<Employee>}
 */
export async function updateEmployee(employeeId, payload) {
  const updated = await api.patch(`/api/v1/auth/employees/${employeeId}/`, payload)
  return mapEmployee(updated)
}

/**
 * @param {number | string} employeeId
 * @returns {Promise<void>}
 */
export async function deleteEmployee(employeeId) {
  await api.delete(`/api/v1/auth/employees/${employeeId}/`)
}

/**
 * @param {number | string} employeeId
 * @param {boolean} isActive
 * @returns {Promise<Employee>}
 */
export async function updateEmployeeStatus(employeeId, isActive) {
  const updated = await api.patch(`/api/v1/auth/employees/${employeeId}/`, { is_active: isActive })
  return mapEmployee(updated)
}
