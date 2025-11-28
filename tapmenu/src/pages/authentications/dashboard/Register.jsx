import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Register() {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle register logic here
    console.log('Register:', formData)
    alert('Pendaftaran Berhasil! (Demo)')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div id="register-view" className="fixed inset-0 z-[60] bg-[#F7F5F2] overflow-y-auto fade-in">
      <div className="min-h-screen flex">

        {/* Left Side: Visual for Register */}
        <div className="hidden lg:flex w-1/2 bg-[#1B4332] relative items-center justify-center overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#D8F3DC 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

          <div className="relative z-10 max-w-lg text-white px-12 text-center">
            <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <i className="fa-solid fa-rocket text-4xl text-accent"></i>
            </div>
            <h2 className="text-4xl font-bold mb-4">Mulai Langkah Digital Anda</h2>
            <p className="text-green-100 text-lg leading-relaxed">
              Bergabung dengan ribuan UMKM lain yang telah beralih ke sistem digital. Gratis, mudah, dan membantu pembukuan Anda.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">30 Detik</div>
                <div className="text-xs text-green-200">Waktu Daftar</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">0 Rupiah</div>
                <div className="text-xs text-green-200">Biaya Awal</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">1 Akun</div>
                <div className="text-xs text-green-200">Semua Fitur</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative bg-white md:bg-[#F7F5F2]">
          {/* Back Button */}
          <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-semibold text-sm">
            <i className="fa-solid fa-arrow-left"></i> Kembali
          </button>

          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Buat Akun Toko</h2>
              <p className="text-gray-500">Lengkapi data di bawah untuk memulai.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nama Pemilik */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Pemilik</label>
                <div className="relative">
                  <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="Nama Lengkap Anda"
                  />
                </div>
              </div>

              {/* Nama Usaha */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Usaha (Toko/Warung)</label>
                <div className="relative">
                  <i className="fa-solid fa-store absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="Cth: Seblak Prasmanan"
                  />
                </div>
              </div>

              {/* No WA */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <i className="fa-brands fa-whatsapp absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="0812xxxx"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Buat Password</label>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              {/* Checkbox Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  Saya menyetujui <a href="#" className="text-primary underline">Syarat & Ketentuan</a> serta <a href="#" className="text-primary underline">Kebijakan Privasi</a> TapMenu.
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#d06a50] transition-all transform active:scale-[0.98] mt-2">
                Daftar Sekarang
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-600">
              Sudah punya akun?
              <Link to="/login" className="font-bold text-primary hover:underline ml-1">Masuk disini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
