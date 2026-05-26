import {
  api,
  AUTH_STORAGE_KEY,
  CASHIER_SESSION_STORAGE_KEY,
  hasValidStoredAccessToken,
  registerRefreshHandler,
} from './api'

function persistAuth(payload) {
  if (!payload?.tokens || !payload?.user) return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
}

export function getStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(CASHIER_SESSION_STORAGE_KEY)
}

export function persistStoredAuth(payload) {
  persistAuth(payload)
}

export function setCashierSessionUnlocked(userId) {
  if (!userId) return
  localStorage.setItem(CASHIER_SESSION_STORAGE_KEY, JSON.stringify({ userId: String(userId), unlocked: true }))
}

export function hasUnlockedCashierSession(userId) {
  if (!userId) return false

  try {
    const raw = localStorage.getItem(CASHIER_SESSION_STORAGE_KEY)
    if (!raw) return false
    const session = JSON.parse(raw)
    return session?.unlocked === true && session?.userId === String(userId)
  } catch {
    return false
  }
}

export function clearCashierSession() {
  localStorage.removeItem(CASHIER_SESSION_STORAGE_KEY)
}

export function isAuthenticated() {
  if (!hasValidStoredAccessToken()) {
    clearStoredAuth()
    return false
  }

  return true
}

export function getRoleLabel(role) {
  const labels = {
    1: 'Owner',
    2: 'Manager',
    3: 'Cashier',
    4: 'Kitchen',
    5: 'Buyer',
  }
  return labels[role] || 'User'
}

export function getRedirectForRole(role) {
  if (role === 3) return '/dashboard/cashier'
  if (role === 5) return '/order/history'
  return '/dashboard'
}

export async function login(email, password) {
  const payload = await api.post('/api/v1/auth/login/', { email, password }, { auth: false })
  persistAuth(payload)
  return payload
}

export async function loginCashier(employeeCode, pinCode) {
  const payload = await api.post(
    '/api/v1/auth/cashier-login/',
    { employee_code: employeeCode, pin_code: pinCode },
    { auth: false },
  )
  persistAuth(payload)
  return payload
}

export async function registerOwner({ email, password, fullName, phoneNumber }) {
  const payload = await api.post(
    '/api/v1/auth/register/',
    {
      email,
      password,
      full_name: fullName,
      phone_number: phoneNumber,
      role: 1,
    },
    { auth: false },
  )
  persistAuth(payload)
  return payload
}

export async function registerBuyer({ email, password, fullName, phoneNumber }) {
  const payload = await api.post(
    '/api/v1/auth/register/',
    {
      email,
      password,
      full_name: fullName,
      phone_number: phoneNumber,
      role: 5,
    },
    { auth: false },
  )
  persistAuth(payload)
  return payload
}

export async function fetchMe() {
  return api.get('/api/v1/auth/me/')
}

export async function updateMe(payload) {
  const user = await api.put('/api/v1/auth/me/', payload)
  const auth = getStoredAuth()
  if (auth?.tokens) {
    persistAuth({ ...auth, user })
  }
  return user
}

export async function requestPasswordReset(email) {
  return api.post('/api/v1/auth/forgot-password/', { email }, { auth: false })
}

export async function resetPassword({ email, token, newPassword }) {
  return api.post(
    '/api/v1/auth/reset-password/',
    {
      email,
      token,
      new_password: newPassword,
    },
    { auth: false },
  )
}

let refreshPromise = null

export async function refreshAccessToken() {
  const auth = getStoredAuth()
  const refresh = auth?.tokens?.refresh

  if (!refresh) {
    throw new Error('Missing refresh token.')
  }

  if (!refreshPromise) {
    refreshPromise = api
      .post('/api/v1/auth/refresh/', { refresh }, { auth: false })
      .then((payload) => {
        if (!payload?.access) {
          throw new Error('Refresh token response did not include an access token.')
        }

        const nextAuth = {
          ...auth,
          tokens: {
            ...auth.tokens,
            access: payload.access,
            ...(payload.refresh ? { refresh: payload.refresh } : {}),
          },
        }

        persistAuth(nextAuth)
        return nextAuth
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

export async function logout() {
  const auth = getStoredAuth()
  if (auth?.tokens?.refresh) {
    try {
      await api.post('/api/v1/auth/logout/', { refresh: auth.tokens.refresh })
    } catch {
      // Ignore logout failures and clear local auth regardless.
    }
  }
  clearStoredAuth()
}

registerRefreshHandler(refreshAccessToken)
