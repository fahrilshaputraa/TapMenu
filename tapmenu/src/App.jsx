import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/authentications/dashboard/Login'
import { Register } from './pages/authentications/dashboard/Register'
import { CustomerLogin } from './pages/authentications/customer/Login'
import { CustomerRegister } from './pages/authentications/customer/Register'
import { ForgotPassword } from './pages/authentications/ForgotPassword'
import { DashboardOverview } from './pages/dashboard/Overview'
import { Cashier } from './pages/dashboard/Cashier'
import { Orders } from './pages/dashboard/Orders'
import { MenuManagement } from './pages/dashboard/MenuManagement'
import { Category } from './pages/dashboard/Category'
import { Tables } from './pages/dashboard/Tables'
import { TableForm } from './pages/dashboard/TableForm'
import { Reports } from './pages/dashboard/Reports'
import { Settings } from './pages/dashboard/Settings'
import { ProfileSettings } from './pages/dashboard/ProfileSettings'
import { StoreSettings } from './pages/dashboard/StoreSettings'
import { MenuAppearance } from './pages/dashboard/MenuAppearance'
import { Employee } from './pages/dashboard/Employee'
import { VoucherManagement } from './pages/dashboard/VoucherManagement'
import { CustomerMenu } from './pages/customer/Menu'
import { CustomerOrder } from './pages/customer/Order'
import { CustomerVoucher } from './pages/customer/Voucher'
import { CustomerOrderHistory } from './pages/customer/OrderHistory'
import { CustomerFavorites } from './pages/customer/Favorites'
import { CustomerAbout } from './pages/AboutMe'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicRoute } from './components/PublicRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/customer/login"
          element={
            <PublicRoute>
              <CustomerLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/customer/register"
          element={
            <PublicRoute>
              <CustomerRegister />
            </PublicRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cashier"
          element={
            <ProtectedRoute>
              <Cashier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/menu"
          element={
            <ProtectedRoute>
              <MenuManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables"
          element={
            <ProtectedRoute>
              <Tables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables/add"
          element={
            <ProtectedRoute>
              <TableForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tables/edit/:id"
          element={
            <ProtectedRoute>
              <TableForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/profile"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/store"
          element={
            <ProtectedRoute>
              <StoreSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings/appearance"
          element={
            <ProtectedRoute>
              <MenuAppearance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute>
              <Employee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vouchers"
          element={
            <ProtectedRoute>
              <VoucherManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/order/:tableId" element={<CustomerMenu />} />
        <Route path="/order" element={<CustomerMenu />} />
        <Route path="/order/status" element={<CustomerOrder />} />
        <Route path="/order/vouchers" element={<CustomerVoucher />} />
        <Route path="/order/history" element={<CustomerOrderHistory />} />
        <Route path="/order/favorites" element={<CustomerFavorites />} />
        <Route path="/order/about" element={<CustomerAbout />} />
      </Routes>
    </Router>
  )
}

export default App
