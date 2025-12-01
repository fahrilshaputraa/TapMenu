import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../services/auth'

export function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true
    if (path === '/dashboard/settings' && location.pathname !== '/dashboard/settings') return false
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinkClass = (path) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(path)
    ? 'bg-secondary/50 text-primary font-bold'
    : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-dark'
    }`

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex fade-in">

      {/* SIDEBAR (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden md:h-screen transition-transform duration-300 md:translate-x-0 md:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
            <i className="fa-solid fa-utensils text-xs"></i>
          </div>
          <span className="text-lg font-extrabold text-primary tracking-tight">TapMenu</span>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden ml-auto text-gray-400 hover:text-dark"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scroll min-h-0">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Utama</div>

          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            <i className="fa-solid fa-house w-5"></i> Dashboard
          </Link>
          <Link to="/dashboard/orders" className={navLinkClass('/dashboard/orders')}>
            <i className="fa-solid fa-receipt w-5"></i> Pesanan
            <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </Link>
          <Link to="/dashboard/menu" className={navLinkClass('/dashboard/menu')}>
            <i className="fa-solid fa-book-open w-5"></i> Daftar Menu
          </Link>
          <Link to="/dashboard/category" className={navLinkClass('/dashboard/category')}>
            <i className="fa-solid fa-tags w-5"></i> Kategori
          </Link>
          <Link to="/dashboard/tables" className={navLinkClass('/dashboard/tables')}>
            <i className="fa-solid fa-chair w-5"></i> Meja
          </Link>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-2">Promosi</div>

          <Link to="/dashboard/vouchers" className={navLinkClass('/dashboard/vouchers')}>
            <i className="fa-solid fa-ticket w-5"></i> Voucher & Diskon
          </Link>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-2">Keuangan</div>

          <Link to="/dashboard/reports" className={navLinkClass('/dashboard/reports')}>
            <i className="fa-solid fa-chart-simple w-5"></i> Laporan
          </Link>
          <Link to="/dashboard/cashier" className={navLinkClass('/dashboard/cashier')}>
            <i className="fa-solid fa-wallet w-5"></i> Kasir
          </Link>
          <Link to="/dashboard/employee" className={navLinkClass('/dashboard/employee')}>
            <i className="fa-solid fa-users-gear w-5"></i> Karyawan
          </Link>
          <Link to="/dashboard/settings" className={navLinkClass('/dashboard/settings')}>
            <i className="fa-solid fa-gears w-5"></i> Sistem & Bayar
          </Link>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-2">Pengaturan</div>

          <Link to="/dashboard/settings/store" className={navLinkClass('/dashboard/settings/store')}>
            <i className="fa-solid fa-store w-5"></i> Profil Toko
          </Link>
          <Link to="/dashboard/settings/appearance" className={navLinkClass('/dashboard/settings/appearance')}>
            <i className="fa-solid fa-palette w-5"></i> Tampilan Menu
          </Link>
          <Link to="/dashboard/settings/profile" className={navLinkClass('/dashboard/settings/profile')}>
            <i className="fa-solid fa-user-gear w-5"></i> Akun Saya
          </Link>
        </div>

        {/* User Profile Bottom */}
        <div className="p-4 border-t border-gray-100 relative shrink-0">
          <div
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <img src="https://i.pravatar.cc/100?img=5" className="w-9 h-9 rounded-full border border-gray-200" alt="User" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-dark truncate">Pak Budi</p>
              <p className="text-xs text-gray-500 truncate">Owner</p>
            </div>
            <i className={`fa-solid fa-chevron-${isProfileDropdownOpen ? 'down' : 'right'} text-xs text-gray-400 transition-transform`}></i>
          </div>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 slide-up">
              <Link
                to="/dashboard/settings/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <i className="fa-solid fa-user w-4 text-gray-400"></i>
                Profil Saya
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <i className="fa-solid fa-gear w-4 text-gray-400"></i>
                Pengaturan
              </Link>
              <Link
                to="/dashboard/settings/store"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <i className="fa-solid fa-store w-4 text-gray-400"></i>
                Pengaturan Toko
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <button
                onClick={async () => {
                  setIsProfileDropdownOpen(false)
                  try {
                    await logout()
                    navigate('/login', { replace: true })
                  } catch (error) {
                    console.error('Logout error:', error)
                    navigate('/login', { replace: true })
                  }
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <i className="fa-solid fa-right-from-bracket w-4"></i>
                Keluar
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative w-full">

        {/* Header Mobile & Desktop */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-primary text-xl"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <span className="font-bold text-primary">Dashboard</span>
          </div>

          {/* Greeting (Desktop) */}
          <div className="hidden md:block">
            <h2 className="text-xl font-bold text-dark">Halo, Warung Bu Dewi 👋</h2>
            <p className="text-xs text-gray-500">Rabu, 25 Oktober 2023</p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-[#F7F5F2] rounded-full px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-white transition-all">
              <i className="fa-solid fa-search text-gray-400 text-sm"></i>
              <input type="text" placeholder="Cari pesanan..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 outline-none text-dark placeholder-gray-400" />
            </div>

            {/* Notification */}
            <button className="relative w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center">
              <i className="fa-regular fa-bell"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border border-white"></span>
            </button>

            {/* Store Status Toggle */}
            <Link to="/order" className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-secondary cursor-pointer hover:bg-secondary/40 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full live-indicator"></div>
              <span className="text-xs font-bold text-primary">Buka menu</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-primary ml-1"></i>
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}
