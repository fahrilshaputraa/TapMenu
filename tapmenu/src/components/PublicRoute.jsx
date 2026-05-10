import { Navigate, useLocation } from 'react-router-dom'
import { getRedirectForRole, getStoredAuth, isAuthenticated } from '../services/auth'

export function PublicRoute({ children }) {
  const location = useLocation()
  if (isAuthenticated()) {
    const auth = getStoredAuth()
    const redirectTo = location.state?.from?.pathname || getRedirectForRole(auth?.user?.role)
    return <Navigate to={redirectTo} replace />
  }
  return children
}
