import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { DashboardOverview } from './pages/dashboard/Overview'
import { Cashier } from './pages/dashboard/Cashier'
import { Orders } from './pages/dashboard/Orders'
import { MenuManagement } from './pages/dashboard/MenuManagement'
import { Tables } from './pages/dashboard/Tables'
import { TableForm } from './pages/dashboard/TableForm'
import { Reports } from './pages/dashboard/Reports'
import { Settings } from './pages/dashboard/Settings'
import { ProfileSettings } from './pages/dashboard/ProfileSettings'
import { StoreSettings } from './pages/dashboard/StoreSettings'
import { MenuAppearance } from './pages/dashboard/MenuAppearance'
import { CustomerMenu } from './pages/customer/Menu'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/dashboard/cashier" element={<Cashier />} />
        <Route path="/dashboard/orders" element={<Orders />} />
        <Route path="/dashboard/menu" element={<MenuManagement />} />
        <Route path="/dashboard/tables" element={<Tables />} />
        <Route path="/dashboard/tables/add" element={<TableForm />} />
        <Route path="/dashboard/tables/edit/:id" element={<TableForm />} />
        <Route path="/dashboard/reports" element={<Reports />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/settings/profile" element={<ProfileSettings />} />
        <Route path="/dashboard/settings/store" element={<StoreSettings />} />
        <Route path="/dashboard/settings/appearance" element={<MenuAppearance />} />
        <Route path="/order/:tableId" element={<CustomerMenu />} />
        <Route path="/order" element={<CustomerMenu />} />
      </Routes>
    </Router>
  )
}

export default App
