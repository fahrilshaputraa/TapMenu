import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

export function PublicRoute({ children }) {
  const location = useLocation()
  if (isAuthenticated()) {
    // Redirect ke dashboard jika sudah login
    const redirectTo = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={redirectTo} replace />
  }
  return children
}
