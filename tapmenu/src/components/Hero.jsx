import { ArrowRight, QrCode, Smartphone, CreditCard, CheckCircle2 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-slate-50 to-slate-50 dark:from-emerald-950/40 dark:via-slate-950 dark:to-slate-950" />

      {/* Animated shapes */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              100% Gratis untuk UMKM Indonesia
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
              Revolusi Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500">
                Bisnis Kuliner
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Kelola pesanan, pembayaran, dan laporan keuangan dalam satu aplikasi pintar.
              Tingkatkan omzet dengan pengalaman pelanggan yang lebih modern.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <a
                href="#signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                Mulai Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl backdrop-blur-sm transition-all hover:border-emerald-500/50"
              >
                Lihat Demo
              </a>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { icon: QrCode, text: "QR Code Menu" },
                { icon: Smartphone, text: "Pesan via HP" },
                { icon: CreditCard, text: "Bayar QRIS" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000">
            <div className="relative w-full max-w-lg transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">
              {/* Glass Card Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10" />

              <div className="glass-card rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-6 py-4 bg-white/50 dark:bg-slate-900/50 border-b border-white/10 backdrop-blur-md">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-100/50 dark:bg-slate-800/50 rounded-lg px-4 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                      tapmenu.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard preview */}
                <div className="p-8 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Pendapatan</p>
                      <div className="flex items-end justify-between">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">Rp 2.450.000</p>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">+12.5%</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pesanan Aktif</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Meja Terisi</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">8/12</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Pesanan Terbaru</p>
                      <span className="text-xs text-emerald-600 cursor-pointer">Lihat Semua</span>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-900 dark:text-white">Meja {i + 4}</p>
                              <p className="text-[10px] text-slate-500">2 item • Baru saja</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">Rp {45 + i * 15}.000</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

