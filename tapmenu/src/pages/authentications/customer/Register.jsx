import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerBuyer } from '../../../services/auth'

const perks = [
  {
    icon: 'fa-solid fa-bowl-food',
    title: 'Order Tanpa Antri',
    description: 'Langsung pilih dan bayar dari ponselmu begitu sampai di meja.',
  },
  {
    icon: 'fa-solid fa-ticket',
    title: 'Voucher Eksklusif',
    description: 'Pelanggan terdaftar dapat notifikasi promo dan hadiah loyalti.',
  },
  {
    icon: 'fa-solid fa-clock-rotate-left',
    title: 'Riwayat Otomatis',
    description: 'Pesanan tersimpan sehingga kamu bisa reorder hanya dengan sekali klik.',
  },
]

const onboardingSteps = [
  { label: '1', title: 'Isi Identitas', description: 'Nama lengkap & kontak aktif' },
  { label: '2', title: 'Verifikasi', description: 'Terima kode OTP WhatsApp' },
  { label: '3', title: 'Aktif', description: 'Langsung pesan di seluruh outlet' },
]

const securityPoints = [
  'Data pelanggan dienkripsi dan hanya digunakan untuk kebutuhan layanan',
  'Bisa minta penghapusan data kapan saja melalui CS TapMenu',
]

export function CustomerRegister() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    email: '',
    password: '',
    referral: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Daftar Pelanggan TapMenu'
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await registerBuyer({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.contact,
      })
      navigate('/order')
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Pastikan email valid.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGuestCheckout = () => {
    alert('Melanjutkan sebagai tamu untuk demo.')
    navigate('/order')
  }

  const handleGoogleRegister = () => {
    alert('Daftar dengan Google belum tersedia di demo.')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F5F2] text-dark fade-in">
      <section className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-[#0f3d2e] to-[#061b13] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-accent blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full border border-white/20 -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/topography.png')] opacity-20 mix-blend-screen"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col gap-10 px-6 sm:px-10 lg:px-14 py-12">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <i className="fa-solid fa-user-plus text-xl"></i>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/70 font-bold">TapMenu</p>
              <h1 className="text-3xl font-black leading-tight">Daftar pelanggan setia</h1>
            </div>
          </div>

          <p className="text-white/80 text-base leading-relaxed max-w-lg">
            Satu akun TapMenu bisa dipakai di seluruh merchant yang bekerja sama. Simpan preferensi makananmu dan nikmati
            pengalaman makan tanpa ribet.
          </p>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">Keuntungan</p>
            <div className="space-y-4">
              {perks.map((perk) => (
                <div key={perk.title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <i className={`${perk.icon} text-lg`}></i>
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{perk.title}</p>
                    <p className="text-sm text-white/80">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur space-y-4">
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?img=45" alt="Customer" className="w-12 h-12 rounded-full border border-white/40" />
              <div>
                <p className="font-bold">Mas Damar</p>
                <p className="text-sm text-white/70">Food vlogger Bandung</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              "Sekali daftar bisa pakai di semua resto partner TapMenu. Sistem loyalti dan update status pesanan super cepat."
            </p>
          </div>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-semibold text-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Kembali
        </button>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.4em] uppercase text-primary">Customer Access</p>
            <h2 className="text-3xl font-black text-primary">Buat akun pelanggan</h2>
            <p className="text-gray-500">
              Kami kirim tautan verifikasi melalui WhatsApp atau email untuk memastikan akunmu aman.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6 space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {onboardingSteps.map((step) => (
                <div key={step.label} className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
                  <div className="text-primary text-base font-black">{step.label}</div>
                  <p className="text-[11px] text-dark">{step.title}</p>
                  <p className="text-[10px] text-gray-500 font-normal normal-case tracking-normal">{step.description}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Nama sesuai identitas"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nomor WhatsApp Aktif</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+62</span>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    placeholder="812xxxxxxx"
                    className="w-full pl-14 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@tapmenu.id"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Buat PIN / Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-primary"
                  >
                    {showPassword ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Kode Referal (Opsional)</label>
                <div className="relative">
                  <i className="fa-solid fa-gift absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    placeholder="Masukkan kode temanmu"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="agreement" required className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="agreement" className="text-xs text-gray-500 leading-relaxed">
                  Dengan mendaftar saya menyetujui{' '}
                  <a href="#" className="text-primary font-semibold underline">
                    Ketentuan Layanan
                  </a>{' '}
                  TapMenu serta bersedia menerima informasi promo melalui WhatsApp/email.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-primaryLight transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mendaftar...' : 'Daftar & Mulai Pesan'}
              </button>
            </form>

            {error ? (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl p-3">
                {error}
              </div>
            ) : null}

            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 text-xs text-gray-500 space-y-2">
              {securityPoints.map((point) => (
                <div key={point} className="flex gap-2">
                  <i className="fa-solid fa-shield text-primary mt-0.5"></i>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-google text-primary"></i>
              Daftar dengan Google
            </button>
            <button
              type="button"
              onClick={handleGuestCheckout}
              className="w-full border border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:border-primary/40 hover:text-primary transition-all"
            >
              Lanjut tanpa akun
            </button>
            <p>
              Sudah punya akun?{' '}
              <Link to="/customer/login" className="font-bold text-primary hover:underline">
                Masuk disini
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
