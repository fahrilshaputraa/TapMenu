export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')) ||
  `${window.location.protocol}//${window.location.hostname}:8009`

export const AUTH_STORAGE_KEY = 'tapmenu.auth'

function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function getStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (_error) {
    return null
  }
}

async function parseResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  return isJson ? response.json() : null
}

function buildError(data) {
  if (data?.non_field_errors?.length) {
    return new Error(data.non_field_errors[0])
  }
  if (data && typeof data === 'object') {
    const firstFieldMessage = Object.values(data).find((value) => {
      if (Array.isArray(value) && value.length > 0) return true
      return typeof value === 'string' && value.trim()
    })

    if (firstFieldMessage) {
      const message = Array.isArray(firstFieldMessage) ? firstFieldMessage[0] : firstFieldMessage
      const error = new Error(message)
      error.fieldErrors = data
      error.payload = data
      return error
    }
  }
  if (data && typeof data === 'object' && !data.detail && !data.message && !data.error) {
    const error = new Error('Validation error')
    error.fieldErrors = data
    error.payload = data
    return error
  }

  const error = new Error(data?.detail || data?.message || data?.error || 'Terjadi kesalahan. Coba lagi.')
  error.payload = data
  return error
}

export function parseJwtPayload(token) {
  if (!token) return null

  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch (_error) {
    return null
  }
}

export function hasValidStoredAccessToken() {
  const accessToken = getStoredAuth()?.tokens?.access
  if (!accessToken) return false

  const payload = parseJwtPayload(accessToken)
  if (!payload?.exp) return false

  return payload.exp * 1000 > Date.now()
}

function isInvalidAuthResponse(response, data, options) {
  if (options.auth === false || response.status !== 401) return false

  return (
    data?.code === 'token_not_valid' ||
    data?.detail === 'Given token not valid for any token type' ||
    data?.messages?.some((message) => message?.token_class === 'AccessToken')
  )
}

function handleInvalidStoredAuth() {
  clearStoredAuth()

  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
    window.location.replace('/login')
  }
}

export async function apiRequest(path, options = {}) {
  const auth = getStoredAuth()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.auth !== false && auth?.tokens?.access
        ? { Authorization: `Bearer ${auth.tokens.access}` }
        : {}),
      ...options.headers,
    },
  })

  const data = await parseResponse(response)
  if (isInvalidAuthResponse(response, data, options)) {
    handleInvalidStoredAuth()
  }

  if (!response.ok) {
    throw buildError(data)
  }

  return data
}

export const api = {
  get(path, options) {
    return apiRequest(path, { ...options, method: 'GET' })
  },
  post(path, body, options) {
    return apiRequest(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  },
  put(path, body, options) {
    return apiRequest(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  },
  patch(path, body, options) {
    return apiRequest(path, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    })
  },
  delete(path, options) {
    return apiRequest(path, { ...options, method: 'DELETE' })
  },
}
