import { useState } from 'react'
import {
  Bell,
  CreditCard,
  Printer,
  Palette,
  Save,
  User,
  Store
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'

const tabs = [
  { id: 'notifications', name: 'Notifikasi', icon: Bell },
  { id: 'payment', name: 'Pembayaran', icon: CreditCard },
  { id: 'printer', name: 'Printer', icon: Printer },
  { id: 'appearance', name: 'Tampilan', icon: Palette },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('notifications')

  const [notifications, setNotifications] = useState({
    newOrder: true,
    orderCompleted: true,
    lowStock: true,
    dailyReport: false,
    weeklyReport: true,
    emailNotif: true,
    pushNotif: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    qris: true,
    cash: true,
    transfer: true,
    bankName: 'BCA',
    accountNumber: '1234567890',
    accountName: 'Pak Budi',
  })

  const handleSave = () => {
    alert('Pengaturan berhasil disimpan!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark">Pengaturan</h1>
            <p className="text-sm text-gray-500">
              Kelola pengaturan aplikasi Anda
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/dashboard/settings/profile"
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-dark">Profil Saya</h3>
              <p className="text-sm text-gray-500">Kelola informasi profil dan password</p>
            </div>
          </Link>

          <Link
            to="/dashboard/settings/store"
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-dark">Pengaturan Toko</h3>
              <p className="text-sm text-gray-500">Kelola informasi dan jam operasional toko</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-secondary text-primary'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6">

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-dark">Pengaturan Notifikasi</h2>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-dark">Notifikasi Pesanan</h3>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Pesanan baru masuk</span>
                      <input
                        type="checkbox"
                        checked={notifications.newOrder}
                        onChange={(e) => setNotifications({ ...notifications, newOrder: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Pesanan selesai</span>
                      <input
                        type="checkbox"
                        checked={notifications.orderCompleted}
                        onChange={(e) => setNotifications({ ...notifications, orderCompleted: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Stok menipis</span>
                      <input
                        type="checkbox"
                        checked={notifications.lowStock}
                        onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-sm font-medium text-dark">Laporan</h3>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Laporan harian</span>
                      <input
                        type="checkbox"
                        checked={notifications.dailyReport}
                        onChange={(e) => setNotifications({ ...notifications, dailyReport: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Laporan mingguan</span>
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReport}
                        onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-sm font-medium text-dark">Channel</h3>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Email</span>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotif}
                        onChange={(e) => setNotifications({ ...notifications, emailNotif: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Push notification</span>
                      <input
                        type="checkbox"
                        checked={notifications.pushNotif}
                        onChange={(e) => setNotifications({ ...notifications, pushNotif: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-dark">Pengaturan Pembayaran</h2>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-dark">Metode Pembayaran Aktif</h3>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">QRIS</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.qris}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, qris: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Cash</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.cash}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, cash: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-gray-600">Transfer Bank</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.transfer}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, transfer: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-sm font-medium text-dark">Rekening Bank</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        No. Rekening
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Atas Nama
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, accountName: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Printer Settings */}
              {activeTab === 'printer' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-dark">Pengaturan Printer</h2>

                  <div className="p-4 bg-secondary/50 rounded-lg border border-secondary">
                    <p className="text-sm text-primary">
                      Fitur printer akan segera hadir. Anda akan dapat menghubungkan printer thermal untuk mencetak struk dan pesanan dapur.
                    </p>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-dark">Pengaturan Tampilan</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-3 border-2 border-primary rounded-lg text-center">
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mb-2" />
                        <span className="text-xs font-medium text-dark">Light</span>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg text-center hover:border-primary">
                        <div className="w-full h-8 bg-dark rounded mb-2" />
                        <span className="text-xs font-medium text-dark">Dark</span>
                      </button>
                      <button className="p-3 border border-gray-200 rounded-lg text-center hover:border-primary">
                        <div className="w-full h-8 bg-gradient-to-r from-white to-dark rounded mb-2" />
                        <span className="text-xs font-medium text-dark">System</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
