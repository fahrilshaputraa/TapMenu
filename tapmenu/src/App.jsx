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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/cashier" element={<Cashier />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/menu" element={<MenuManagement />} />
        <Route path="/dashboard/category" element={<Category />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/tables" element={<Tables />} />
        <Route path="/dashboard/tables/add" element={<TableForm />} />
        <Route path="/dashboard/tables/edit/:id" element={<TableForm />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/settings/profile" element={<ProfileSettings />} />
        <Route path="/dashboard/settings/store" element={<StoreSettings />} />
        <Route path="/dashboard/settings/appearance" element={<MenuAppearance />} />
        <Route path="/dashboard/employee" element={<Employee />} />
        <Route path="/dashboard/vouchers" element={<VoucherManagement />} />
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
