/** @typedef {import('../types/tables').TableRaw} TableRaw */
/** @typedef {import('../types/tables').Table} Table */
/** @typedef {import('../types/tables').TableFormData} TableFormData */
/** @typedef {import('../types/tables').TableWritePayload} TableWritePayload */

export const DEFAULT_TABLE_AREA = 'Indoor'

/**
 * @param {TableRaw} table
 * @returns {Table}
 */
export function mapTable(table) {
  return {
    ...table,
    name: table?.name || '',
    code: table?.code || '',
    area: table?.area || DEFAULT_TABLE_AREA,
    seats: Number(table?.seats || 4),
    public_token: table?.public_token || '',
    is_active: table?.is_active !== false,
  }
}

/**
 * @param {TableRaw[]} tables
 * @returns {Table[]}
 */
export function mapTableCollection(tables) {
  return (tables || []).map(mapTable)
}

/**
 * @returns {TableFormData}
 */
export function createDefaultTableFormData() {
  return {
    name: '',
    code: '',
    area: DEFAULT_TABLE_AREA,
    seats: 4,
    is_active: true,
  }
}

/**
 * @param {Table | null | undefined} table
 * @returns {TableFormData}
 */
export function createTableFormData(table) {
  if (!table) {
    return createDefaultTableFormData()
  }

  return {
    name: table.name || '',
    code: table.code || '',
    area: table.area || DEFAULT_TABLE_AREA,
    seats: Number(table.seats || 4),
    is_active: table.is_active !== false,
  }
}

/**
 * @param {TableFormData} formData
 * @returns {TableWritePayload}
 */
export function buildTablePayload(formData) {
  return {
    name: formData.name.trim(),
    code: formData.code.trim(),
    area: formData.area.trim() || DEFAULT_TABLE_AREA,
    seats: Math.max(Number(formData.seats) || 1, 1),
    is_active: formData.is_active,
  }
}

/**
 * @param {Table[]} tables
 * @param {string} filter
 * @returns {Table[]}
 */
export function filterTablesByArea(tables, filter) {
  if (filter === 'all') return tables
  return tables.filter((table) => table.area === filter)
}

/**
 * @param {Table[]} tables
 * @returns {{ indoorCount: number, outdoorCount: number }}
 */
export function getTableAreaStats(tables) {
  return {
    indoorCount: tables.filter((table) => table.area === 'Indoor').length,
    outdoorCount: tables.filter((table) => table.area === 'Outdoor').length,
  }
}

/**
 * @param {string} origin
 * @param {string} publicToken
 * @returns {string}
 */
export function buildTableOrderUrl(origin, publicToken) {
  return `${origin}/order?table=${publicToken}`
}

/**
 * @param {string} origin
 * @param {string} publicToken
 * @returns {string}
 */
export function buildTableQrUrl(origin, publicToken) {
  const qrData = encodeURIComponent(buildTableOrderUrl(origin, publicToken))
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}&color=1B4332&bgcolor=ffffff&margin=10`
}
