import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'

export function StoreSettings() {
  const [storeData, setStoreData] = useState({
    name: 'Warung Bu Dewi',
    slogan: 'Rasanya seperti masakan ibu',
    category: 'Warung Makan',
    phone: '81234567890',
    address: 'Jl. Merdeka No. 45, RT 02/RW 05, Kecamatan Bandung Wetan, Kota Bandung, Jawa Barat',
    instagram: 'warungbudewi',
    googleMaps: '',
    openTime: '08:00',
    closeTime: '22:00',
  })

  const [logoImg, setLogoImg] = useState('https://cdn-icons-png.flaticon.com/512/2921/2921822.png')
  const [bannerImg, setBannerImg] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [operationalDays, setOperationalDays] = useState({
    senin: true,
    selasa: true,
    rabu: true,
    kamis: true,
    jumat: true,
    sabtu: true,
    minggu: false,
  })

  const [settings, setSettings] = useState({
    acceptOnlineOrders: true,
    showPrices: true,
    newOrderNotification: true,
  })

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const saveStoreProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000)
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 -mt-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark">Profil Toko</h2>
          <p className="text-xs text-gray-500">Informasi ini akan tampil di menu digital pelanggan</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/order"
            className="hidden sm:flex px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all items-center gap-2"
          >
            <i className="fa-regular fa-eye"></i>
            <span>Lihat Menu</span>
          </Link>
          <button
            onClick={saveStoreProfile}
            disabled={isSaving}
            className={`px-6 py-2.5 text-white text-sm font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 ${
              saveSuccess ? 'bg-green-600' : isSaving ? 'bg-primary opacity-75 cursor-not-allowed' : 'bg-primary hover:bg-primaryLight'
            }`}
          >
            {isSaving ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
            ) : saveSuccess ? (
              <><i className="fa-solid fa-check"></i> Tersimpan</>
            ) : (
              <><i className="fa-regular fa-floppy-disk"></i> Simpan</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 fade-in">
        {/* Visual Branding Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 flex flex-col items-center text-center h-full">
            <h3 className="font-bold text-dark text-sm mb-4 w-full text-left border-b border-gray-50 pb-2">
              Logo Toko
            </h3>

            <div className="relative w-32 h-32 group cursor-pointer">
              <img
                src={logoImg}
                alt="Logo"
                className="w-32 h-32 rounded-full object-cover border-4 border-secondary shadow-sm transition-opacity group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 text-white rounded-full p-2">
                  <i className="fa-solid fa-camera"></i>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageUpload(e, setLogoImg)}
              />
            </div>

            <p className="text-[10px] text-gray-400 mt-4 px-4">
              Disarankan format persegi (1:1), min. 500x500px. Max 2MB.
            </p>
          </div>

          {/* Banner Upload */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-card border border-gray-100 h-full flex flex-col">
            <h3 className="font-bold text-dark text-sm mb-4 border-b border-gray-50 pb-2">
              Banner Menu Digital
            </h3>

            <div className="relative w-full h-32 sm:h-40 bg-gray-100 rounded-xl overflow-hidden group cursor-pointer border-2 border-dashed border-gray-200 hover:border-primary transition-colors flex-1">
              {bannerImg ? (
                <img src={bannerImg} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary">
                  <i className="fa-solid fa-image text-3xl mb-2"></i>
                  <span className="text-xs font-bold">Upload Banner / Foto Depan Toko</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleImageUpload(e, setBannerImg)}
              />
            </div>

            <p className="text-[10px] text-gray-400 mt-3">
              Tampil di bagian paling atas menu digital. Disarankan rasio landscape (16:9).
            </p>
          </div>
        </div>

        {/* Store Details Form */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <i className="fa-solid fa-store text-primary"></i>
            <h3 className="font-bold text-dark">Identitas & Alamat</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Toko */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Nama Usaha / Toko <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-bold text-dark"
                placeholder="Cth: Kopi Kenangan Masa Lalu"
              />
            </div>

            {/* Slogan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Slogan / Tagline (Opsional)
              </label>
              <input
                type="text"
                value={storeData.slogan}
                onChange={(e) => setStoreData({ ...storeData, slogan: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm text-dark"
                placeholder="Cth: Jagonya Ayam Geprek"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Kategori Bisnis <span className="text-red-500">*</span>
              </label>
              <select
                value={storeData.category}
                onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark"
              >
                <option>Warung Makan</option>
                <option>Restoran</option>
                <option>Coffee Shop</option>
                <option>Bakery & Pastry</option>
                <option>Fast Food</option>
              </select>
            </div>

            {/* Nomor WA */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                No. WhatsApp Admin <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">+62</span>
                <input
                  type="tel"
                  value={storeData.phone}
                  onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark"
                  placeholder="812xxx"
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Alamat Lengkap
              </label>
              <textarea
                rows="3"
                value={storeData.address}
                onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm text-dark resize-none"
              />
            </div>
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <i className="fa-solid fa-clock text-primary"></i>
            <h3 className="font-bold text-dark">Jam Operasional</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jam Buka */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Jam Buka
              </label>
              <div className="relative">
                <i className="fa-regular fa-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="time"
                  value={storeData.openTime}
                  onChange={(e) => setStoreData({ ...storeData, openTime: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark"
                />
              </div>
            </div>

            {/* Jam Tutup */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Jam Tutup
              </label>
              <div className="relative">
                <i className="fa-regular fa-clock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="time"
                  value={storeData.closeTime}
                  onChange={(e) => setStoreData({ ...storeData, closeTime: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark"
                />
              </div>
            </div>

            {/* Hari Operasional */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Hari Operasional
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(operationalDays).map(([day, isActive]) => (
                  <label
                    key={day}
                    className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setOperationalDays({ ...operationalDays, [day]: e.target.checked })}
                      className="sr-only"
                    />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Links */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <i className="fa-solid fa-share-nodes text-primary"></i>
            <h3 className="font-bold text-dark">Media Sosial & Link</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Instagram Username
              </label>
              <div className="relative">
                <i className="fa-brands fa-instagram absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={storeData.instagram}
                  onChange={(e) => setStoreData({ ...storeData, instagram: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm text-dark"
                  placeholder="username_tanpa_at"
                />
              </div>
            </div>

            {/* Google Maps */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Link Google Maps
              </label>
              <div className="relative">
                <i className="fa-solid fa-map-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="url"
                  value={storeData.googleMaps}
                  onChange={(e) => setStoreData({ ...storeData, googleMaps: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm text-dark"
                  placeholder="https://goo.gl/maps/..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pengaturan Tambahan */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <i className="fa-solid fa-sliders text-primary"></i>
            <h3 className="font-bold text-dark">Pengaturan Tambahan</h3>
          </div>

          <div className="space-y-4">
            {/* Terima Pesanan Online */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-dark">Terima Pesanan Online</h4>
                <p className="text-xs text-gray-500 mt-0.5">Pelanggan dapat memesan melalui QR menu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.acceptOnlineOrders}
                  onChange={(e) => setSettings({ ...settings, acceptOnlineOrders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Tampilkan Harga di Menu */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-dark">Tampilkan Harga di Menu</h4>
                <p className="text-xs text-gray-500 mt-0.5">Harga akan terlihat di halaman menu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPrices}
                  onChange={(e) => setSettings({ ...settings, showPrices: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Notifikasi Pesanan Baru */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex-1">
                <h4 className="text-sm font-bold text-dark">Notifikasi Pesanan Baru</h4>
                <p className="text-xs text-gray-500 mt-0.5">Terima notifikasi saat ada pesanan masuk</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.newOrderNotification}
                  onChange={(e) => setSettings({ ...settings, newOrderNotification: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
