import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const quickSteps = [
  {
    icon: 'fa-solid fa-qrcode',
    title: 'Scan QR',
    description: 'Masuk lewat kode meja atau link yang dibagikan kasir.'
  },
  {
    icon: 'fa-solid fa-bowl-food',
    title: 'Pilih Menu',
    description: 'Tambah menu favorit ke keranjang dan atur jumlahnya.'
  },
  {
    icon: 'fa-solid fa-receipt',
    title: 'Pantau Status',
    description: 'Lihat progres pesanan dan riwayat transaksi Anda.'
  }
]

export function CustomerLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    contact: '',
    accessCode: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Customer login attempt', formData)
    alert('Login pelanggan masih dalam mode demo.')
    navigate('/order')
  }

  const handleGuestCheckout = () => {
    alert('Lanjut sebagai tamu (demo)')
    navigate('/order')
  }

  const handleGoogleLogin = () => {
    alert('Login Google pelanggan belum tersedia di demo.')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F5F2] text-dark fade-in">
      {/* Story / Hero */}
      <section className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-[#0f3d2e] to-[#061b13] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-32 -right-10 w-80 h-80 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full border border-white/20 -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')] opacity-20"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col gap-10 px-6 sm:px-10 lg:px-14 py-12">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <i className="fa-solid fa-utensils text-xl"></i>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 font-bold">TapMenu</p>
              <h1 className="text-3xl font-black leading-tight">Masuk sebagai pelanggan setia</h1>
            </div>
          </div>

          <p className="text-white/80 text-base leading-relaxed">
            Akses riwayat kunjungan, pesan ulang menu favorit, dan dapatkan promo spesial
            hanya dengan masuk menggunakan nomor HP atau email Anda.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">Cara Kerja</p>
            <div className="space-y-4">
              {quickSteps.map((step) => (
                <div key={step.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <i className={`${step.icon} text-lg`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{step.title}</p>
                    <p className="text-sm text-white/80">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <p className="text-lg font-semibold mb-4">"Pesan menu jadi nggak perlu antri. Tinggal login, pilih menu, kelar!"</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?img=14" alt="Customer" className="w-12 h-12 rounded-full border border-white/40" />
              <div>
                <p className="font-bold">Mbak Rara</p>
                <p className="text-sm text-white/70">Pelanggan Warung Nusantara</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.4em] uppercase text-primary">Customer Access</p>
            <h2 className="text-3xl font-black text-primary">Masuk ke akun pelanggan</h2>
            <p className="text-gray-500">Gunakan nomor HP, email, atau kode meja yang diberikan pramusaji.</p>
          </div>

          <div className="bg-white rounded-[28px] shadow-xl p-8 space-y-7 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="contact" className="text-sm font-bold text-gray-700">Nomor HP / Email</label>
                <div className="relative">
                  <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100"
                    placeholder="0812 3456 7890"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="accessCode" className="text-sm font-bold text-gray-700">Kode Meja / Pesanan</label>
                  <span className="text-xs text-gray-400">Ada di struk / kartu tanda meja</span>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-chair absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="accessCode"
                    name="accessCode"
                    type="text"
                    value={formData.accessCode}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100"
                    placeholder="Contoh: A12 atau 98U1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-bold text-gray-700">PIN / Password (opsional)</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-accent hover:underline">Lupa PIN?</Link>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#15402f] transition-colors active:scale-[0.99]">Masuk &amp; Mulai Pesan</button>
            </form>

            <div className="relative text-center text-xs text-gray-400">
              <span className="px-3 bg-white relative z-10">atau</span>
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-200 -z-10"></div>
            </div>

            <button
              type="button"
              onClick={handleGuestCheckout}
              className="w-full border border-gray-200 rounded-2xl py-3.5 font-bold text-dark hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <i className="fa-regular fa-face-smile"></i>
              Lanjut tanpa akun
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Masuk dengan Google
            </button>
          </div>

          <div className="text-center space-y-2 text-sm">
            <p className="text-gray-500">
              Pertama kali pesan?{' '}
              <Link to="/customer/register" className="font-bold text-accent hover:underline">Buat akun pelanggan</Link>
            </p>
            <p className="text-gray-400 text-xs">
              Pemilik warung?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">Masuk ke dashboard TapMenu</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
