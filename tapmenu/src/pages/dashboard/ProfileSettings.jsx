import { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
  Shield,
  Monitor,
  LogOut,
  IdCard
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/DashboardLayout'
import { logout } from '../../services/auth'
import { loadProfile, saveProfile } from '../../services/profile'
import {
  createDefaultPasswordForm,
  createDefaultPinForm,
  createDefaultProfileFormData,
  validateProfileSecurity,
} from '../../utils/profile'

export function ProfileSettings() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [roleId, setRoleId] = useState(null)
  const [profileData, setProfileData] = useState(createDefaultProfileFormData())

  const [passwords, setPasswords] = useState(createDefaultPasswordForm())
  const [pinData, setPinData] = useState(createDefaultPinForm())

  useEffect(() => {
    let active = true

    async function fetchProfile() {
      try {
        const payload = await loadProfile()
        if (!active) return
        setProfileData(payload.profileData)
        setRoleId(Number(payload.user.role))
        setError('')
      } catch (requestError) {
        if (active) setError(requestError.message)
      }
    }

    fetchProfile()
    return () => {
      active = false
    }
  }, [])

  const canChangePin = roleId === 3

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileData((current) => ({ ...current, avatar: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    const validationError = validateProfileSecurity(passwords, pinData, canChangePin)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const payload = await saveProfile(profileData, passwords, pinData)
      setProfileData((current) => ({ ...current, ...payload.profileData, avatar: current.avatar }))
      setRoleId(Number(payload.user.role))
      setSuccess('Profil berhasil disimpan.')
      setPasswords(createDefaultPasswordForm())
      setPinData(createDefaultPinForm())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-dark">Profil Akun</h1>
            <p className="text-xs text-gray-500">
              Kelola data pribadi dan keamanan akun
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 fade-in">
          {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
          {success ? <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div> : null}
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-[#2D6A4F]"></div>
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative group">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  />
                  <button
                    onClick={() => document.getElementById('avatar-upload').click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </div>
                <div className="mb-2 hidden sm:block">
                  <span className="bg-secondary text-primary px-3 py-1 rounded-full text-xs font-bold border border-green-200 inline-flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {profileData.role}
                  </span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-dark mb-1">Pak {profileData.name}</h1>
              <p className="text-gray-500 text-sm">Bergabung sejak {profileData.joinDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <IdCard className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-dark">Data Diri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark font-medium"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Email Login
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark font-medium"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                      *Email ini digunakan untuk login ke dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Nomor HP
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Peran (Role)
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.role}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Session */}
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <Lock className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-dark">Keamanan</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark"
                    />
                  </div>

                  {canChangePin ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                          PIN Kasir Baru
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength="6"
                          value={pinData.next}
                          onChange={(e) => setPinData({ ...pinData, next: e.target.value.replace(/\D/g, '') })}
                          placeholder="4-6 digit"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark font-mono tracking-[0.2em]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                          Konfirmasi PIN Kasir
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength="6"
                          value={pinData.confirm}
                          onChange={(e) => setPinData({ ...pinData, confirm: e.target.value.replace(/\D/g, '') })}
                          placeholder="Ulangi PIN baru"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-dark font-mono tracking-[0.2em]"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">PIN ini dipakai untuk login ke terminal kasir.</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Session Info */}
              <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                <h3 className="font-bold text-dark mb-4 text-sm">Sesi Login Aktif</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-dark">Windows PC - Chrome</p>
                    <p className="text-[10px] text-gray-500">Bandung, ID • Sedang Aktif</p>
                  </div>
                </div>

                <hr className="border-gray-100 my-4" />

                <button
                  onClick={handleLogout}
                  className="w-full text-red-500 text-sm font-bold hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Aplikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
