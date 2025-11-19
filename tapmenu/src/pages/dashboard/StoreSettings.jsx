import { useState } from 'react'
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Save,
  Upload,
  Image,
  X,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'

export function StoreSettings() {
  const [storeData, setStoreData] = useState({
    name: 'Warung Bu Dewi',
    address: 'Jl. Merdeka No. 45, Bandung',
    phone: '08123456789',
    email: 'warungbudewi@email.com',
    description: 'Warung makan dengan berbagai menu masakan Indonesia yang lezat dan terjangkau. Buka setiap hari untuk melayani Anda.',
    openTime: '08:00',
    closeTime: '22:00',
    logo: null,
  })

  const [operationalDays, setOperationalDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
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
        setStoreData({ ...storeData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setStoreData({ ...storeData, logo: null })
  }

  const handleSave = () => {
    alert('Pengaturan toko berhasil disimpan!')
  }

  const dayNames = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard/settings"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-dark">Pengaturan Toko</h1>
              <p className="text-sm text-gray-500">
                Kelola informasi dan pengaturan toko Anda
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Logo Toko</h2>

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  {storeData.logo ? (
                    <div className="relative">
                      <img
                        src={storeData.logo}
                        alt="Logo toko"
                        className="w-32 h-32 rounded-xl object-cover border border-gray-200"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 p-1 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-bg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Image className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-secondary rounded-lg cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-gray-400 text-center">
                  Format: JPG, PNG, GIF. Maksimal 2MB.
                </p>
                <p className="text-xs text-gray-400 text-center">
                  Rekomendasi: 200x200 pixel
                </p>
              </div>
            </div>

            {/* Operational Hours Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Jam Operasional</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Jam Buka
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={storeData.openTime}
                      onChange={(e) => setStoreData({ ...storeData, openTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Jam Tutup
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={storeData.closeTime}
                      onChange={(e) => setStoreData({ ...storeData, closeTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Hari Operasional
                  </label>
                  <div className="space-y-2">
                    {Object.entries(operationalDays).map(([day, isActive]) => (
                      <label key={day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{dayNames[day]}</span>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setOperationalDays({ ...operationalDays, [day]: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Informasi Toko</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Nama Toko
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={storeData.name}
                      onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      No. Telepon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={storeData.phone}
                        onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={storeData.email}
                        onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Alamat
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      value={storeData.address}
                      onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                      rows={2}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    Deskripsi Toko
                  </label>
                  <textarea
                    value={storeData.description}
                    onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                    rows={4}
                    placeholder="Ceritakan tentang toko Anda..."
                    className="w-full px-4 py-2.5 text-sm bg-bg border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Deskripsi ini akan ditampilkan di halaman menu pelanggan
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Pengaturan Tambahan</h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-dark">Terima Pesanan Online</span>
                    <p className="text-xs text-gray-500">Pelanggan dapat memesan melalui QR menu</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-dark">Tampilkan Harga di Menu</span>
                    <p className="text-xs text-gray-500">Harga akan terlihat di halaman menu</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-bg rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-dark">Notifikasi Pesanan Baru</span>
                    <p className="text-xs text-gray-500">Terima notifikasi saat ada pesanan masuk</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
