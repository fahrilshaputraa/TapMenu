import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function MenuAppearance() {
  // State for all settings
  const [title, setTitle] = useState('Warung Bu Dewi')
  const [description, setDescription] = useState('Rasanya seperti masakan ibu')
  const [themeColor, setThemeColor] = useState('#1B4332')
  const [customColor, setCustomColor] = useState(null)
  const [fontStyle, setFontStyle] = useState('Plus Jakarta Sans')
  const [bgPattern, setBgPattern] = useState('pattern-none')
  const [bgColor, setBgColor] = useState('#F7F5F2')
  const [layoutStyle, setLayoutStyle] = useState('list')
  const [headerStyle, setHeaderStyle] = useState('standard')
  const [showBanner, setShowBanner] = useState(true)
  const [showProfile, setShowProfile] = useState(true)
  const [showImages, setShowImages] = useState(true)
  const [showDesc, setShowDesc] = useState(true)
  const [radius, setRadius] = useState(12)
  const [shadow, setShadow] = useState(1)
  const [btnStyle, setBtnStyle] = useState('circle')
  const [logoImg, setLogoImg] = useState('https://cdn-icons-png.flaticon.com/512/2921/2921822.png')
  const [bannerImg, setBannerImg] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const colors = [
    '#1B4332', '#E07A5F', '#2563EB', '#DC2626',
    '#DB2777', '#7C3AED', '#111827', '#78350F'
  ]

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleColorChange = (color) => {
    setThemeColor(color)
    setCustomColor(null)
  }

  const handleCustomColor = (color) => {
    setCustomColor(color)
    setThemeColor(null)
  }

  const resetTheme = () => {
    setTitle('Warung Bu Dewi')
    setDescription('Rasanya seperti masakan ibu')
    setThemeColor('#1B4332')
    setCustomColor(null)
    setFontStyle('Plus Jakarta Sans')
    setBgPattern('pattern-none')
    setBgColor('#F7F5F2')
    setLayoutStyle('list')
    setHeaderStyle('standard')
    setShowBanner(true)
    setShowProfile(true)
    setShowImages(true)
    setShowDesc(true)
    setRadius(12)
    setShadow(1)
    setBtnStyle('circle')
  }

  const saveTheme = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000)
  }

  const activeColor = customColor || themeColor || '#1B4332'
  const shadowClasses = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md']

  // Get font family for preview
  const getFontFamily = () => {
    switch(fontStyle) {
      case 'Inter': return '"Inter", sans-serif'
      case 'Poppins': return '"Poppins", sans-serif'
      case 'Lato': return '"Lato", sans-serif'
      case 'Playfair Display': return '"Playfair Display", serif'
      default: return '"Plus Jakarta Sans", sans-serif'
    }
  }

  const getTitleFontFamily = () => {
    if (fontStyle === 'Playfair Display') return '"Playfair Display", serif'
    return getFontFamily()
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center -mt-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-dark">Tampilan Menu</h2>
          <p className="text-xs text-gray-500">Kustomisasi tema halaman menu digital pelanggan</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetTheme}
            className="hidden sm:flex px-4 py-2.5 bg-white border border-gray-200 text-gray-500 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all items-center gap-2"
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>Reset</span>
          </button>
          <button
            onClick={saveTheme}
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
              <><i className="fa-solid fa-check"></i> Terapkan</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* CONTROLS (Left Side) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Identitas & Konten */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <i className="fa-solid fa-pen-to-square text-primary"></i> Konten & Identitas
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Judul / Nama Toko</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Deskripsi Singkat</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Uploads */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Logo Profil</label>
                  <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-upload text-gray-400 text-xs"></i>
                    <span className="text-xs text-dark font-medium truncate">Pilih Foto...</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setLogoImg)}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Gambar Banner</label>
                  <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-image text-gray-400 text-xs"></i>
                    <span className="text-xs text-dark font-medium truncate">Pilih Banner...</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setBannerImg)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Warna & Font */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <i className="fa-solid fa-swatchbook text-primary"></i> Warna & Font
            </h3>

            <div className="space-y-6">
              {/* Warna Aksen */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Warna Aksen Toko</label>
                <div className="grid grid-cols-5 sm:grid-cols-9 gap-3">
                  {colors.map((color) => (
                    <label key={color} className="cursor-pointer" style={{ color }}>
                      <input
                        type="radio"
                        name="theme-color"
                        value={color}
                        checked={themeColor === color && !customColor}
                        onChange={() => handleColorChange(color)}
                        className="sr-only"
                      />
                      <div
                        className={`w-8 h-8 rounded-full shadow-sm transition-transform border-2 border-white ${
                          themeColor === color && !customColor ? 'ring-2 ring-offset-2 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color, ringColor: color }}
                      />
                    </label>
                  ))}

                  {/* Custom Color */}
                  <div className="relative w-8 h-8 rounded-full bg-white border-2 border-dashed border-gray-300 hover:border-primary flex items-center justify-center overflow-hidden cursor-pointer group">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      onChange={(e) => handleCustomColor(e.target.value)}
                    />
                    <div
                      className="w-full h-full absolute"
                      style={{ backgroundColor: customColor || 'transparent' }}
                    />
                    {!customColor && (
                      <i className="fa-solid fa-plus text-[10px] text-gray-400 absolute pointer-events-none group-hover:text-primary"></i>
                    )}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Font Family */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Jenis Font</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'Plus Jakarta Sans', label: 'Modern', sub: 'Jakarta Sans', font: 'font-sans' },
                    { value: 'Inter', label: 'Clean', sub: 'Inter', font: 'font-inter' },
                    { value: 'Poppins', label: 'Friendly', sub: 'Poppins', font: 'font-poppins' },
                    { value: 'Lato', label: 'Professional', sub: 'Lato', font: 'font-lato' },
                  ].map((f) => (
                    <label key={f.value} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="font-style"
                        value={f.value}
                        checked={fontStyle === f.value}
                        onChange={() => setFontStyle(f.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span className={`${f.font} font-bold text-sm text-dark`}>{f.label}</span>
                        <span className="text-[10px] text-gray-400">{f.sub}</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors sm:col-span-2">
                    <input
                      type="radio"
                      name="font-style"
                      value="Playfair Display"
                      checked={fontStyle === 'Playfair Display'}
                      onChange={() => setFontStyle('Playfair Display')}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="font-serif font-bold text-sm text-dark">Elegant (Serif)</span>
                      <span className="text-[10px] text-gray-400">Playfair Display</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Latar Belakang */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <i className="fa-regular fa-image text-primary"></i> Latar Belakang
            </h3>

            <div className="space-y-4">
              {/* Pattern Selection */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'pattern-none', label: 'Polos' },
                  { value: 'pattern-dots', label: 'Bintik' },
                  { value: 'pattern-grid', label: 'Kotak' },
                ].map((p) => (
                  <label key={p.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="bg-pattern"
                      value={p.value}
                      checked={bgPattern === p.value}
                      onChange={() => setBgPattern(p.value)}
                      className="peer sr-only"
                    />
                    <div className={`aspect-square border-2 rounded-xl bg-[#F7F5F2] hover:bg-gray-50 transition-all flex items-center justify-center ${
                      bgPattern === p.value ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'
                    } ${p.value}`}>
                      <span className="text-[10px] text-gray-400 font-bold">{p.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Background Color */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <label className="text-xs font-bold text-gray-500 uppercase">Warna Dasar Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0.5"
                  />
                  <button
                    onClick={() => setBgColor('#F7F5F2')}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Layout & Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Layout Options */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="font-bold text-dark mb-4 text-sm">Tata Letak Menu</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'list', icon: 'fa-list', label: 'List' },
                  { value: 'grid', icon: 'fa-border-all', label: 'Grid' },
                ].map((l) => (
                  <label key={l.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="layout-style"
                      value={l.value}
                      checked={layoutStyle === l.value}
                      onChange={() => setLayoutStyle(l.value)}
                      className="peer sr-only"
                    />
                    <div className={`border-2 rounded-xl p-3 hover:bg-gray-50 transition-all text-center ${
                      layoutStyle === l.value ? 'border-primary bg-secondary/20' : 'border-gray-100'
                    }`}>
                      <i className={`fa-solid ${l.icon} text-xl mb-2 ${layoutStyle === l.value ? 'text-primary' : 'text-gray-400'}`}></i>
                      <p className="text-xs font-bold text-dark">{l.label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Header & Banner */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="font-bold text-dark mb-4 text-sm">Header & Banner</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  {[
                    { value: 'standard', label: 'Kiri' },
                    { value: 'center', label: 'Tengah' },
                  ].map((h) => (
                    <label key={h.value} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="header-style"
                        value={h.value}
                        checked={headerStyle === h.value}
                        onChange={() => setHeaderStyle(h.value)}
                        className="peer sr-only"
                      />
                      <div className={`border-2 rounded-xl p-3 hover:bg-gray-50 transition-all text-center ${
                        headerStyle === h.value ? 'border-primary bg-secondary/20' : 'border-gray-100'
                      }`}>
                        <p className="text-xs font-bold text-dark">{h.label}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Toggles */}
                <div className="flex gap-3 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showBanner}
                        onChange={(e) => setShowBanner(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-[10px] font-bold text-gray-500">Banner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showProfile}
                        onChange={(e) => setShowProfile(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-[10px] font-bold text-gray-500">Logo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Isi & Gaya Kartu */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-primary"></i> Isi & Gaya Kartu
            </h3>

            <div className="space-y-5">
              {/* Visibility Toggles */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1 min-w-[140px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showImages}
                      onChange={(e) => setShowImages(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-xs font-bold text-dark">Foto Menu</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1 min-w-[140px]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDesc}
                      onChange={(e) => setShowDesc(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-xs font-bold text-dark">Deskripsi</span>
                </div>
              </div>

              {/* Radius & Shadow */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Sudut (Radius)</label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={radius}
                    step="4"
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Bayangan</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={shadow}
                    step="1"
                    onChange={(e) => setShadow(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Button Style */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Gaya Tombol Tambah</label>
                <div className="flex gap-2">
                  {[
                    { value: 'circle', label: 'Bulat' },
                    { value: 'square', label: 'Kotak' },
                    { value: 'pill', label: 'Pill (+ Tambah)' },
                  ].map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setBtnStyle(b.value)}
                      className={`px-3 py-2 border rounded-lg text-xs hover:bg-gray-50 focus:ring-2 focus:ring-primary ${
                        btnStyle === b.value ? 'bg-primary/10 text-primary border-primary' : 'border-gray-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW (Right Side - Sticky) */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="sticky top-0 pt-4 flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Live Preview</h3>

            {/* Phone Mockup */}
            <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[40px] shadow-[0_0_0_12px_#1f2937,0_20px_50px_-10px_rgba(0,0,0,0.3)] border-[10px] border-gray-800 overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20"></div>

              {/* Screen Content */}
              <div
                className={`w-full h-full overflow-y-auto flex flex-col transition-all duration-300 ${bgPattern}`}
                style={{ backgroundColor: bgColor, fontFamily: getFontFamily() }}
              >

                {/* Header Area */}
                <div className="relative shrink-0 bg-white transition-all duration-300 h-40">
                  <img
                    src={bannerImg}
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{ opacity: showBanner ? 0.9 : 0 }}
                    alt="Banner"
                  />

                  {/* Logo Container */}
                  {showProfile && (
                    <div className={`absolute transition-all duration-300 ${
                      headerStyle === 'center'
                        ? 'left-1/2 -translate-x-1/2 -bottom-8 w-20 h-20'
                        : 'left-4 -bottom-6 w-16 h-16'
                    } bg-white rounded-full p-1 shadow-md`}>
                      <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                        <img src={logoImg} className="w-full h-full object-cover" alt="Logo" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className={`px-4 pb-2 transition-all duration-300 ${
                  headerStyle === 'center' ? 'pt-10 text-center' : 'pt-8 text-left'
                }`}>
                  <h3
                    className="font-bold text-lg leading-tight"
                    style={{ fontFamily: getTitleFontFamily() }}
                  >
                    {title || 'Nama Toko'}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1">{description}</p>
                </div>

                {/* Categories */}
                <div className={`px-4 py-2 flex gap-2 overflow-x-hidden whitespace-nowrap shrink-0 ${
                  headerStyle === 'center' ? 'justify-center' : ''
                }`}>
                  <span
                    className="text-[10px] px-3 py-1.5 rounded-full text-white font-bold shadow-sm"
                    style={{ backgroundColor: activeColor }}
                  >
                    Makanan
                  </span>
                  <span className="text-[10px] px-3 py-1.5 rounded-full bg-white text-gray-500 border border-gray-100">Minuman</span>
                  <span className="text-[10px] px-3 py-1.5 rounded-full bg-white text-gray-500 border border-gray-100">Cemilan</span>
                </div>

                {/* Menu Items */}
                <div className={`p-4 pt-2 flex-1 ${
                  layoutStyle === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'
                }`}>
                  {/* Sample Menu Items */}
                  {[
                    { name: 'Nasi Goreng Spesial', desc: 'Lengkap dengan telur mata sapi dan dua tusuk sate ayam.', price: 'Rp 25.000', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' },
                    { name: 'Es Kopi Susu', desc: 'Gula aren asli dengan susu fresh milk.', price: 'Rp 18.000', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=150&q=80' },
                    { name: 'Sate Ayam', desc: 'Bumbu kacang madura asli dengan lontong.', price: 'Rp 30.000', img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=150&q=80' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-white border border-gray-50 relative group ${shadowClasses[shadow]} ${
                        layoutStyle === 'grid'
                          ? 'p-2.5 flex flex-col gap-2 h-full'
                          : 'p-3 flex gap-3 items-center'
                      }`}
                      style={{ borderRadius: `${radius}px` }}
                    >
                      {showImages && (
                        <div
                          className={`bg-gray-100 shrink-0 overflow-hidden ${
                            layoutStyle === 'grid' ? 'w-full h-24 mb-1' : 'w-16 h-16'
                          }`}
                          style={{ borderRadius: `${Math.max(4, radius - 4)}px` }}
                        >
                          <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col h-full justify-center">
                        <h4 className="font-bold text-xs text-dark truncate mb-0.5">{item.name}</h4>
                        {showDesc && (
                          <p className="text-[9px] text-gray-400 line-clamp-2 mb-1">{item.desc}</p>
                        )}
                        <div className="flex justify-between items-end mt-auto w-full">
                          <span className="font-bold text-sm" style={{ color: activeColor }}>{item.price}</span>
                          <button
                            className={`flex items-center justify-center text-white text-[10px] transition-all ${
                              btnStyle === 'circle' ? 'w-6 h-6 rounded-full' :
                              btnStyle === 'square' ? 'w-6 h-6 rounded-md' :
                              'px-3 py-1 rounded-full font-bold'
                            }`}
                            style={{ backgroundColor: activeColor }}
                          >
                            {btnStyle === 'pill' ? 'Tambah' : <i className="fa-solid fa-plus"></i>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Cart */}
                <div
                  className="absolute bottom-4 left-4 right-4 p-3 rounded-xl text-white flex justify-between items-center shadow-lg z-10"
                  style={{ backgroundColor: activeColor }}
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 w-6 h-6 flex items-center justify-center rounded text-xs font-bold">1</span>
                    <span className="text-xs font-bold">Rp 25.000</span>
                  </div>
                  <i className="fa-solid fa-basket-shopping text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pattern-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 20px 20px;
          color: rgba(0,0,0,0.1);
        }
        .pattern-grid {
          background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
          color: rgba(0,0,0,0.05);
        }
        .pattern-none {
          background-image: none;
        }
      `}</style>
    </DashboardLayout>
  )
}
