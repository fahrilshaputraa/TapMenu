import { createBrowserRouter } from 'react-router-dom';

// Layouts
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { KitchenLayout } from '@/components/layouts/KitchenLayout';
import { CashierLayout } from '@/components/layouts/CashierLayout';

// Auth pages
import { LoginPage } from '@/routes/auth/LoginPage';
import { RegisterPage } from '@/routes/auth/RegisterPage';

// Admin pages
import { DashboardPage } from '@/routes/admin/DashboardPage';
import { MenuPage } from '@/routes/admin/MenuPage';
import { TablesPage } from '@/routes/admin/TablesPage';
import { OrdersPage } from '@/routes/admin/OrdersPage';
import { StaffPage } from '@/routes/admin/StaffPage';
import { SettingsPage } from '@/routes/admin/SettingsPage';

// Kitchen pages
import { KitchenDisplayPage } from '@/routes/kitchen/KitchenDisplayPage';

// Cashier pages
import { CashierOrdersPage } from '@/routes/cashier/CashierOrdersPage';
import { PaymentsPage } from '@/routes/cashier/PaymentsPage';

// Public pages
import { ScanPage } from '@/routes/public/ScanPage';
import { MenuViewPage } from '@/routes/public/MenuViewPage';
import { CartPage } from '@/routes/public/CartPage';
import { OrderTrackPage } from '@/routes/public/OrderTrackPage';

export const router = createBrowserRouter([
  // Auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'menu', element: <MenuPage /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Kitchen routes
  {
    path: '/kitchen',
    element: <KitchenLayout />,
    children: [
      { index: true, element: <KitchenDisplayPage /> },
    ],
  },

  // Cashier routes
  {
    path: '/cashier',
    element: <CashierLayout />,
    children: [
      { index: true, element: <CashierOrdersPage /> },
      { path: 'payments', element: <PaymentsPage /> },
    ],
  },

  // Public routes (customer-facing)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <ScanPage /> },
      { path: 'menu/:restaurantSlug', element: <MenuViewPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'order/:uuid', element: <OrderTrackPage /> },
    ],
  },
]);
