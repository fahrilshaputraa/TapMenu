import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { requestPasswordReset, resetPassword } from '../../services/auth'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const prefixedEmail = searchParams.get('email') || ''
  const [step, setStep] = useState(prefixedEmail ? 2 : 1)
  const [email, setEmail] = useState(prefixedEmail)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ show: false, message: '' })
  const otpRefs = useRef([])

  const token = useMemo(() => otp.join(''), [otp])

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
      showToast('Kode verifikasi berhasil dikirim.')
    } catch (err) {
      setError(err.message || 'Gagal mengirim kode verifikasi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const nextOtp = [...otp]
    nextOtp[index] = value.slice(-1)
    setOtp(nextOtp)

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    setError('')

    if (token.length !== 6) {
      setError('Masukkan kode verifikasi 6 digit.')
      return
    }

    setStep(3)
    showToast('Kode verifikasi siap digunakan.')
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (token.length !== 6) {
      setError('Kode verifikasi harus 6 digit.')
      setStep(2)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({ email, token, newPassword })
      showToast('Password berhasil diubah.')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (err) {
      setError(err.message || 'Gagal mengubah password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await requestPasswordReset(email)
      showToast('Kode verifikasi dikirim ulang.')
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang kode.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="forgot-view" className="fixed inset-0 z-[60] bg-[#F7F5F2] overflow-y-auto fade-in">
      <div className="min-h-screen flex">
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
              <h2 className="text-3xl font-bold leading-tight mb-4">Pulihkan akses akun Anda</h2>
              <p className="text-green-100 text-lg">Minta kode verifikasi, lalu gunakan kode tersebut untuk membuat password baru.</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative bg-white sm:bg-[#F7F5F2] lg:bg-white">
          <button onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors flex items-center gap-2 font-semibold text-sm">
            <i className="fa-solid fa-arrow-left"></i> Kembali
          </button>

          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-utensils text-xs"></i>
              </div>
              <span className="text-xl font-extrabold text-primary">TapMenu</span>
            </div>

            {step === 1 ? (
              <div className="transition-all duration-300">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary mb-2">Lupa Password?</h2>
                  <p className="text-gray-500">Masukkan email yang terdaftar untuk menerima kode verifikasi 6 digit.</p>
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

                  {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div> : null}

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
            ) : null}

            {step === 2 ? (
              <div className="slide-in">
                <div className="mb-10 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-regular fa-envelope-open text-2xl text-green-600"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-2">Masukkan Kode Verifikasi</h2>
                  <p className="text-gray-500 text-sm">
                    Kode 6 digit telah dikirim ke <br />
                    <span className="font-bold text-dark">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element
                        }}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-16 text-center text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all focus:bg-white"
                      />
                    ))}
                  </div>

                  {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 text-center">{error}</div> : null}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] transition-all mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Lanjut
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isSubmitting}
                      className="text-sm text-gray-500 hover:text-primary font-medium disabled:opacity-70"
                    >
                      Kirim Ulang Kode
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="slide-in">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-primary mb-2">Password Baru</h2>
                  <p className="text-gray-500">Gunakan kode verifikasi yang sudah Anda masukkan untuk menyimpan password baru.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Kode Verifikasi</label>
                    <input
                      type="text"
                      value={token}
                      readOnly
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 font-mono font-bold tracking-[0.5em] text-center text-dark"
                    />
                  </div>

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
                        className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-medium text-dark placeholder-gray-400 transition-all"
                        placeholder="Minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                      >
                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 font-medium text-dark placeholder-gray-400 transition-all"
                      placeholder="Ulangi password baru"
                    />
                  </div>

                  {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">{error}</div> : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#143326] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Password Baru'}</span>
                    <i className="fa-solid fa-check"></i>
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Sudah ingat password?
                  <Link to="/login" className="font-bold text-accent hover:underline ml-1">Kembali ke login</Link>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {toast.show ? (
        <div className="fixed bottom-6 right-6 bg-dark text-white px-4 py-3 rounded-xl shadow-xl text-sm z-[80]">
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
