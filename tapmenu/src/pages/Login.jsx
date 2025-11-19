import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login:', formData)
    alert('Ini hanya demo!')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div id="login-view" className="fixed inset-0 z-[60] bg-[#F7F5F2] overflow-y-auto fade-in">
      <div className="min-h-screen flex">

        {/* Left Side: Visual / Branding (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center overflow-hidden">
          {/* Abstract Circles */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-white"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full border border-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-md text-white px-12">
            <div className="mb-8">
              <i className="fa-solid fa-quote-left text-4xl text-accent mb-4"></i>
              <h2 className="text-3xl font-bold leading-tight mb-4">"Sejak pakai TapMenu, omzet warung naik 30% karena pelayanan jadi lebih cepat."</h2>
              <div className="flex items-center gap-4">
                <img src="https://i.pravatar.cc/100?img=5" className="w-12 h-12 rounded-full border-2 border-accent" alt="Testimonial" />
                <div>
                  <p className="font-bold text-lg">Pak Budi</p>
                  <p className="text-green-200 text-sm">Pemilik Bakso Mercon</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative">
          {/* Back Button */}
          <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-semibold text-sm">
            <i className="fa-solid fa-arrow-left"></i> Kembali
          </button>

          <div className="max-w-md w-full mx-auto">
            {/* Logo Mobile */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-utensils text-xs"></i>
              </div>
              <span className="text-xl font-extrabold text-primary">TapMenu</span>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-primary mb-2">Selamat Datang!</h2>
              <p className="text-gray-500">Masuk untuk mengelola warung digital Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email / No. HP</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="contoh@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <a href="#" className="text-xs text-accent font-bold hover:underline">Lupa password?</a>
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-green-100 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#143326] transition-all transform active:scale-[0.98]">
                Masuk Sekarang
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F7F5F2] text-gray-500">atau masuk dengan</span>
              </div>
            </div>

            {/* Google Button */}
            <button className="w-full bg-white border border-gray-200 text-dark font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Google Account
            </button>

            <p className="text-center mt-8 text-sm text-gray-600">
              Belum punya akun toko?
              <Link to="/register" className="font-bold text-accent hover:underline ml-1">Daftar Gratis</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
