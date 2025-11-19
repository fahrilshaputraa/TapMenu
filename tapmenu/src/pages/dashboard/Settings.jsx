import { useState } from 'react'
import {
  Store,
  User,
  Bell,
  CreditCard,
  Printer,
  Shield,
  Palette,
  Save,
  Upload,
  Image,
  X
} from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

const tabs = [
  { id: 'business', name: 'Bisnis', icon: Store },
  { id: 'account', name: 'Akun', icon: User },
  { id: 'notifications', name: 'Notifikasi', icon: Bell },
  { id: 'payment', name: 'Pembayaran', icon: CreditCard },
  { id: 'printer', name: 'Printer', icon: Printer },
  { id: 'appearance', name: 'Tampilan', icon: Palette },
]

export function Settings() {
  const [activeTab, setActiveTab] = useState('business')
  const [businessData, setBusinessData] = useState({
    name: 'Warung Pak Joko',
    address: 'Jl. Merdeka No. 123, Jakarta Selatan',
    phone: '08123456789',
    email: 'warungpakjoko@email.com',
    description: 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau.',
    openTime: '08:00',
    closeTime: '22:00',
    logo: null,
  })

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setBusinessData({ ...businessData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setBusinessData({ ...businessData, logo: null })
  }

  const [accountData, setAccountData] = useState({
    name: 'Joko Widodo',
    email: 'joko@email.com',
    phone: '08123456789',
  })

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
    accountName: 'Joko Widodo',
  })

  const handleSave = () => {
    // Save logic here
    alert('Pengaturan berhasil disimpan!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pengaturan</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Kelola pengaturan bisnis dan akun Anda
            </p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
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
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              {/* Business Settings */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Informasi Bisnis</h2>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                      Logo Bisnis
                    </label>
                    <div className="flex items-start gap-4">
                      {/* Logo Preview */}
                      <div className="relative">
                        {businessData.logo ? (
                          <div className="relative">
                            <img
                              src={businessData.logo}
                              alt="Logo bisnis"
                              className="w-24 h-24 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                            />
                            <button
                              onClick={removeLogo}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                            <Image className="w-8 h-8 text-zinc-400" />
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg cursor-pointer transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Logo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                          Format: JPG, PNG, GIF. Maksimal 2MB.
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Rekomendasi ukuran: 200x200 pixel
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Nama Bisnis
                      </label>
                      <input
                        type="text"
                        value={businessData.name}
                        onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        No. Telepon
                      </label>
                      <input
                        type="tel"
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={businessData.email}
                      onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Alamat
                    </label>
                    <textarea
                      value={businessData.address}
                      onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Deskripsi
                    </label>
                    <textarea
                      value={businessData.description}
                      onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        value={businessData.openTime}
                        onChange={(e) => setBusinessData({ ...businessData, openTime: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        value={businessData.closeTime}
                        onChange={(e) => setBusinessData({ ...businessData, closeTime: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Informasi Akun</h2>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={accountData.name}
                      onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      value={accountData.phone}
                      onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Ubah Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Password Lama
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pengaturan Notifikasi</h2>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Notifikasi Pesanan</h3>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Pesanan baru masuk</span>
                      <input
                        type="checkbox"
                        checked={notifications.newOrder}
                        onChange={(e) => setNotifications({ ...notifications, newOrder: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Pesanan selesai</span>
                      <input
                        type="checkbox"
                        checked={notifications.orderCompleted}
                        onChange={(e) => setNotifications({ ...notifications, orderCompleted: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Stok menipis</span>
                      <input
                        type="checkbox"
                        checked={notifications.lowStock}
                        onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Laporan</h3>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Laporan harian</span>
                      <input
                        type="checkbox"
                        checked={notifications.dailyReport}
                        onChange={(e) => setNotifications({ ...notifications, dailyReport: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Laporan mingguan</span>
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReport}
                        onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Channel</h3>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Email</span>
                      <input
                        type="checkbox"
                        checked={notifications.emailNotif}
                        onChange={(e) => setNotifications({ ...notifications, emailNotif: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Push notification</span>
                      <input
                        type="checkbox"
                        checked={notifications.pushNotif}
                        onChange={(e) => setNotifications({ ...notifications, pushNotif: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pengaturan Pembayaran</h2>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Metode Pembayaran Aktif</h3>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">QRIS</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.qris}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, qris: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Cash</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.cash}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, cash: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">Transfer Bank</span>
                      <input
                        type="checkbox"
                        checked={paymentSettings.transfer}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, transfer: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-4">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Rekening Bank</h3>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.bankName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        No. Rekening
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Atas Nama
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.accountName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, accountName: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Printer Settings */}
              {activeTab === 'printer' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pengaturan Printer</h2>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Fitur printer akan segera hadir. Anda akan dapat menghubungkan printer thermal untuk mencetak struk dan pesanan dapur.
                    </p>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Pengaturan Tampilan</h2>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-3 border-2 border-emerald-500 rounded-lg text-center">
                        <div className="w-full h-8 bg-white border border-zinc-200 rounded mb-2" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-white">Light</span>
                      </button>
                      <button className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center hover:border-emerald-500">
                        <div className="w-full h-8 bg-zinc-900 rounded mb-2" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-white">Dark</span>
                      </button>
                      <button className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg text-center hover:border-emerald-500">
                        <div className="w-full h-8 bg-gradient-to-r from-white to-zinc-900 rounded mb-2" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-white">System</span>
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
