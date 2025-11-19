import { useState } from 'react'

export function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="font-sans text-dark antialiased overflow-x-hidden">
      {/* NAVBAR */}
      <nav className={`fixed w-full z-50 backdrop-blur-sm border-b border-gray-200/50 transition-all duration-300 ${isMobileMenuOpen ? 'bg-white' : 'bg-[#F7F5F2]/95'}`} id="navbar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-utensils"></i>
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tight">TapMenu</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-500">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-primary transition-colors">Untuk Siapa?</a>
            <a href="#harga" className="hover:text-primary transition-colors">Harga</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-bold text-primary hover:text-primary/80">Masuk</a>
            <a href="/register" className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5">
              Daftar Toko
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-2xl text-primary focus:outline-none">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
            <div className="flex flex-col p-6 space-y-4 font-semibold text-gray-600">
              <a href="#fitur" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Fitur</a>
              <a href="#cara-kerja" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Untuk Siapa?</a>
              <a href="#harga" className="hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Harga</a>
              <hr className="border-gray-100" />
              <a href="/login" className="text-center py-3 bg-secondary text-primary rounded-lg">Masuk</a>
              <a href="/register" className="text-center py-3 bg-primary text-white rounded-lg">Daftar Toko</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Text Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Aplikasi Kasir & Menu Digital Gratis</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary leading-[1.1] mb-6">
              Modernisasi <br />
              Warung <span className="text-accent relative inline-block">
                Anda
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
              Bikin menu digital QR Code, catat pesanan, dan atur stok dalam satu aplikasi simpel. Didesain khusus untuk UMKM Indonesia agar naik kelas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-accent text-white font-bold rounded-xl shadow-lg hover:bg-[#d06a50] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                <span>Coba Gratis Sekarang</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-100 text-dark font-bold rounded-xl hover:border-gray-300 transition-colors flex items-center justify-center gap-2">
                <i className="fa-brands fa-google-play text-gray-500"></i>
                <span>Download App</span>
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                <img src="https://i.pravatar.cc/100?img=2" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                <img src="https://i.pravatar.cc/100?img=3" className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
              </div>
              <p>Bergabung dengan <span className="text-primary font-bold">2.500+</span> UMKM</p>
            </div>
          </div>

          {/* Visual Mockup */}
          <div className="relative md:h-full flex items-center justify-center">
            {/* Blob Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-secondary/50 rounded-full blur-3xl -z-10"></div>

            {/* Phone Card Mockup */}
            <div className="floating-card relative w-[320px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-white overflow-hidden z-10">
              {/* Mockup Header */}
              <div className="bg-primary p-6 pb-10 relative">
                <div className="flex justify-between items-center text-white mb-4">
                  <i className="fa-solid fa-bars"></i>
                  <span className="font-bold">Warung Bu Dewi</span>
                  <i className="fa-solid fa-cart-shopping"></i>
                </div>
                <div className="relative z-10">
                  <h3 className="text-white font-bold text-xl">Mau makan apa?</h3>
                  <div className="mt-3 bg-white/20 backdrop-blur-sm p-2 rounded-lg flex items-center text-white/70 text-sm gap-2">
                    <i className="fa-solid fa-search ml-2"></i> Cari menu...
                  </div>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="bg-[#F7F5F2] h-[350px] -mt-4 rounded-t-[2rem] relative z-20 p-5 overflow-hidden">
                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  <span className="bg-accent text-white px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">Makanan</span>
                  <span className="bg-white text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">Minuman</span>
                  <span className="bg-white text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">Cemilan</span>
                </div>

                {/* Item 1 */}
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3 flex gap-3 items-center">
                  <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=100&q=80" className="w-16 h-16 rounded-lg object-cover" alt="Ayam Geprek" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Ayam Geprek</h4>
                    <p className="text-[10px] text-gray-400">Sambal bawang pedas</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-bold text-sm">Rp 15.000</span>
                      <div className="w-6 h-6 bg-secondary text-primary rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-plus"></i></div>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="bg-white p-3 rounded-xl shadow-sm mb-3 flex gap-3 items-center">
                  <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=100&q=80" className="w-16 h-16 rounded-lg object-cover" alt="Kopi" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Es Kopi Susu</h4>
                    <p className="text-[10px] text-gray-400">Gula aren asli</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-primary font-bold text-sm">Rp 18.000</span>
                      <div className="w-6 h-6 bg-secondary text-primary rounded-full flex items-center justify-center text-xs"><i className="fa-solid fa-plus"></i></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-10 -left-4 bg-white p-4 rounded-xl shadow-soft animate-bounce z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <i className="fa-solid fa-check"></i>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Status</p>
                  <p className="text-sm font-bold text-dark">Pesanan Masuk!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="fitur" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">Semua Fitur, Tanpa Ribet</h2>
            <p className="text-gray-600 text-lg">Fokus pada masakan Anda, biarkan TapMenu mengurus manajemen digitalnya.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group p-8 bg-[#F7F5F2] rounded-[2rem] hover:bg-primary transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl text-accent shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white">Menu QR Code</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-green-100">
                Hemat biaya cetak buku menu. Pelanggan scan QR di meja, langsung lihat foto menu yang menggugah selera.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#F7F5F2] rounded-[2rem] hover:bg-primary transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl text-accent shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white">Catat Kasir</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-green-100">
                Lupakan bon kertas yang sering hilang. Catat pemasukan tunai dan non-tunai (QRIS) dengan rapi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#F7F5F2] rounded-[2rem] hover:bg-primary transition-colors duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl text-accent shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-white">Laporan Bisnis</h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-green-100">
                Pantau menu terlaris dan jam sibuk warung Anda. Data otomatis tersaji tanpa perlu menghitung manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWCASE / AUDIENCE */}
      <section id="cara-kerja" className="py-24 bg-secondary/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
                <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=80" alt="Pemilik UMKM" className="relative z-10 rounded-[2rem] shadow-xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-6">Cocok untuk Segala Jenis Usaha Kuliner</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <i className="fa-solid fa-store"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Warung Makan & Kaki Lima</h4>
                    <p className="text-gray-600 text-sm">Simpel, cepat, tidak butuh HP mahal.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <i className="fa-solid fa-mug-hot"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg">Coffee Shop & Kafe</h4>
                    <p className="text-gray-600 text-sm">Tampilan menu estetik sesuai branding kafe.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <i className="fa-solid fa-truck-fast"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Franchise & Cloud Kitchen</h4>
                    <p className="text-gray-600 text-sm">Kelola stok lebih efisien dan terukur.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          {/* Decoration Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent opacity-20 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Gratis Selamanya.<br />Tanpa Komisi.</h2>
            <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">Kami mendukung UMKM Indonesia untuk Go Digital. Mulai gunakan TapMenu hari ini dan rasakan kemudahannya.</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-4 bg-accent text-white font-bold rounded-xl shadow-lg hover:bg-[#d06a50] transition-colors">
                Daftar Sekarang
              </button>
              <button className="px-10 py-4 bg-transparent border border-green-300 text-white font-bold rounded-xl hover:bg-white hover:text-primary transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <i className="fa-solid fa-utensils text-sm"></i>
                </div>
                <span className="text-xl font-bold text-primary">TapMenu</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Membantu UMKM kuliner Indonesia mengelola bisnis lebih mudah, modern, dan efisien.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-accent">Menu Digital</a></li>
                <li><a href="#" className="hover:text-accent">Aplikasi Kasir</a></li>
                <li><a href="#" className="hover:text-accent">Manajemen Stok</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-accent">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-accent">Karir</a></li>
                <li><a href="#" className="hover:text-accent">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-primary mb-4">Hubungi Kami</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                  <i className="fa-regular fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">&copy; 2024 TapMenu Indonesia. Hak Cipta Dilindungi.</p>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-primary">Kebijakan Privasi</a>
              <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

