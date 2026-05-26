import { api } from './api'
import { mapReportsSummary } from '../utils/reports'

/** @typedef {import('../types/reports').ReportsSummary} ReportsSummary */

/**
 * @returns {Promise<ReportsSummary>}
 */
export async function loadReportsSummary() {
  const payload = await api.get('/api/v1/reports/summary/')
  return mapReportsSummary(payload)
}
