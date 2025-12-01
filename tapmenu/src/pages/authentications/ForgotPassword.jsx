import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { requestPasswordReset } from '../../services/auth'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '' })
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await requestPasswordReset(email)
      setStep(2)
      showToast('Kode OTP berhasil dikirim!')
    } catch (err) {
      setError(err.message || 'Gagal mengirim kode OTP.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 4) {
      setError('Masukkan kode OTP 4 digit.')
      return
    }
    setIsSubmitting(true)
    // TODO: Verify OTP with backend
    setTimeout(() => {
      setStep(3)
      setIsSubmitting(false)
      showToast('Kode OTP valid!')
    }, 1000)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setIsSubmitting(true)
    // TODO: Reset password with backend
    setTimeout(() => {
      showToast('Password berhasil diubah!')
      setTimeout(() => navigate('/login'), 2000)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div id="forgot-view" className="fixed inset-0 z-[60] bg-[#F7F5F2] overflow-y-auto fade-in">
      <div className="min-h-screen flex">
        {/* Left Side: Visual / Branding */}
        <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-white"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full border border-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-md text-white px-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <i className="fa-solid fa-shield-halved text-4xl text-secondary"></i>
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-4">Keamanan Akun Anda Adalah Prioritas Kami</h2>
              <p className="text-green-100 text-lg">Ikuti langkah mudah untuk memulihkan akses ke akun toko Anda.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Flow */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white sm:bg-[#F7F5F2] lg:bg-white">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-semibold text-sm">
            <i className="fa-solid fa-arrow-left"></i> Kembali
          </button>

          <div className="max-w-md w-full mx-auto">
            {/* Logo Mobile Only */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-utensils text-xs"></i>
              </div>
              <span className="text-xl font-extrabold text-primary">TapMenu</span>
            </div>

            {/* STEP 1: INPUT EMAIL */}
            {step === 1 && (
              <div className="transition-all duration-300">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary mb-2">Lupa Password? 🔒</h2>
                  <p className="text-gray-500">Masukkan email yang terdaftar untuk menerima kode OTP.</p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-regular fa-envelope text-gray-400 group-focus-within:text-primary transition-colors"></i>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-medium text-dark placeholder-gray-400 transition-all"
                        placeholder="contoh@email.com"
                      />
                    </div>
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Kode'}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: INPUT OTP */}
            {step === 2 && (
              <div className="slide-in">
                <div className="mb-10 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-regular fa-envelope-open text-2xl text-green-600"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Cek Email Anda</h2>
                  <p className="text-gray-500 text-sm">
                    Kode OTP 4 digit telah dikirim ke <br />
                    <span className="font-bold text-dark">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-14 h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all focus:bg-white"
                      />
                    ))}
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">{error}</div>}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Memverifikasi...' : 'Verifikasi Kode'}
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Kode dikirim ulang!')}
                      className="text-sm text-gray-500 hover:text-primary font-medium"
                    >
                      Kirim Ulang Kode
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <div className="slide-in">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary mb-2">Password Baru 🔑</h2>
                  <p className="text-gray-500">Buat password baru yang aman untuk akun Anda.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Password Baru</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-lock text-gray-400 group-focus-within:text-primary transition-colors"></i>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-medium text-dark transition-all"
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dark cursor-pointer"
                      >
                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-lock text-gray-400 group-focus-within:text-primary transition-colors"></i>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-medium text-dark transition-all"
                        placeholder="••••••"
                      />
                    </div>
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div>}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan & Masuk'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-dark text-white px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 animate-[slideDown_0.5s_ease-out]">
          <i className="fa-solid fa-check-circle text-green-400"></i>
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
