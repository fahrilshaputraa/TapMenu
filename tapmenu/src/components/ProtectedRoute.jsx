import { Navigate, useLocation, Link } from 'react-router-dom'
import { isAuthenticated, getStoredAuth } from '../services/auth'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const auth = getStoredAuth()
  const role = Number(auth?.user?.role)
  const path = location.pathname

  // Role Based Access Controls
  if (role === 3) {
    // 3: Cashier
    const allowed = ['/dashboard', '/dashboard/orders', '/dashboard/cashier', '/dashboard/vouchers', '/dashboard/settings/profile']
    const isAllowed = allowed.some(p => {
      if (p === '/dashboard') return path === '/dashboard'
      return path === p || path.startsWith(p + '/')
    })
    if (!isAllowed) return <Unauthorized404 />
  } else if (role === 4) {
    // 4: Kitchen
    const allowed = ['/dashboard/orders', '/dashboard/settings/profile']
    const isAllowed = allowed.some(p => {
      if (p === '/dashboard') return path === '/dashboard'
      return path === p || path.startsWith(p + '/')
    })
    if (!isAllowed) return <Unauthorized404 />
    
    // Auto-redirect kitchen to orders if they try landing exactly on /dashboard
    if (path === '/dashboard') return <Navigate to="/dashboard/orders" replace />
  }

  return children
}

function Unauthorized404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F5F2] text-center p-6 fade-in">
      <div className="w-24 h-24 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fa-solid fa-file-circle-question text-4xl"></i>
      </div>
      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-dark mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        Maaf, halaman yang Anda cari tidak ada atau URL yang dimasukkan salah.
      </p>
      <Link to="/dashboard" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-[#143326] transition-all">
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
