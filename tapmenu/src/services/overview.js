import { api } from './api'
import { mapOverviewSummary } from '../utils/overview'

/** @typedef {import('../types/overview').OverviewSummary} OverviewSummary */

/**
 * @returns {Promise<OverviewSummary>}
 */
export async function loadOverview() {
  const payload = await api.get('/api/v1/restaurants/overview/')
  return mapOverviewSummary(payload)
}
