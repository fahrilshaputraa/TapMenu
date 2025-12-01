import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { registerOwner } from '../../../services/auth'
import { useFormHandler } from '../../../lib/formHelpers'
import { FormInput } from '../../../components/FormInput'

export function Register() {
  const navigate = useNavigate()
  const { formData, fieldErrors, error, isSubmitting, setIsSubmitting, handleChange, handleError, resetErrors } = useFormHandler({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    resetErrors()
    setIsSubmitting(true)
    try {
      await registerOwner({
        email: formData.email,
        password: formData.password,
        fullName: formData.ownerName || formData.businessName,
        phoneNumber: formData.phone,
      })
      navigate('/dashboard')
    } catch (err) {
      handleError(err, { full_name: 'ownerName', phone_number: 'phone' })
    } finally {
      setIsSubmitting(false)
    }
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
              <FormInput
                label="Nama Pemilik"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Nama Lengkap Anda"
                icon="fa-regular fa-user"
                error={fieldErrors.ownerName?.[0]}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="owner@tapmenu.id"
                icon="fa-regular fa-envelope"
                error={fieldErrors.email?.[0]}
                required
              />

              <FormInput
                label="Nama Usaha (Toko/Warung)"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Cth: Seblak Prasmanan"
                icon="fa-solid fa-store"
              />

              <FormInput
                label="Nomor WhatsApp"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0812xxxx"
                icon="fa-brands fa-whatsapp"
                error={fieldErrors.phone?.[0]}
              />

              <FormInput
                label="Buat Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                icon="fa-solid fa-lock"
                error={fieldErrors.password?.[0]}
              />

              {/* Checkbox Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="terms" className="text-xs text-gray-500">
                  Saya menyetujui <a href="#" className="text-primary underline">Syarat & Ketentuan</a> serta <a href="#" className="text-primary underline">Kebijakan Privasi</a> TapMenu.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#d06a50] transition-all transform active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </form>

            {error ? (
              <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                {error}
              </div>
            ) : null}

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
