const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')) ||
  'http://localhost:8111';

const AUTH_STORAGE_KEY = 'tapmenu.auth';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    // Handle non_field_errors (general errors like invalid credentials)
    if (data?.non_field_errors) {
      throw new Error(data.non_field_errors[0]);
    }
    // Handle validation errors (field-specific errors)
    if (data && typeof data === 'object' && !data.detail && !data.message) {
      const error = new Error('Validation error');
      error.fieldErrors = data;
      throw error;
    }
    const detail = data?.detail || data?.message || 'Terjadi kesalahan. Coba lagi.';
    throw new Error(detail);
  }

  return data;
}

function persistAuth(payload) {
  if (!payload?.tokens || !payload?.user) return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function getStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  const auth = getStoredAuth();
  return Boolean(auth?.tokens?.access);
}

export async function login(email, password) {
  const payload = await request('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  persistAuth(payload);
  return payload;
}

export async function registerOwner({ email, password, fullName, phoneNumber }) {
  const payload = await request('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      phone_number: phoneNumber,
      role: 1, // Owner
    }),
  });
  persistAuth(payload);
  return payload;
}

export async function registerBuyer({ email, password, fullName, phoneNumber }) {
  const payload = await request('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      phone_number: phoneNumber,
      role: 5, // Buyer
    }),
  });
  persistAuth(payload);
  return payload;
}

export async function requestPasswordReset(email) {
  return request('/api/v1/auth/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function logout() {
  const auth = getStoredAuth();
  if (auth?.tokens?.refresh) {
    try {
      await request('/api/v1/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ refresh: auth.tokens.refresh }),
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }
  clearStoredAuth();
}
