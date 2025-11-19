import {
  QrCode,
  BarChart3,
  CreditCard,
  Clock,
  Smartphone,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'Pemesanan QR Code',
    description: 'Pelanggan scan QR di meja, lihat menu, dan pesan langsung dari HP mereka. Tidak perlu antri atau panggil pelayan.',
  },
  {
    icon: BarChart3,
    title: 'Laporan Pendapatan',
    description: 'Pantau pendapatan harian, mingguan, dan bulanan. Lihat produk terlaris dan analisis penjualan dengan mudah.',
  },
  {
    icon: CreditCard,
    title: 'Payment Gateway',
    description: 'Terima pembayaran QRIS, transfer bank, dan e-wallet. Semua transaksi tercatat otomatis di sistem.',
  },
  {
    icon: Clock,
    title: 'Antrian Otomatis',
    description: 'Sistem mengelola antrian pesanan secara otomatis. Dapur tahu urutan prioritas tanpa kebingungan.',
  },
  {
    icon: Smartphone,
    title: 'Menu Digital',
    description: 'Buat dan kelola menu digital dengan foto, deskripsi, dan harga. Update kapan saja tanpa cetak ulang.',
  },
  {
    icon: Users,
    title: 'Akun Pelanggan',
    description: 'Pelanggan bisa login untuk lihat riwayat pesanan, simpan favorit, dan dapatkan promo khusus.',
  },
  {
    icon: ShieldCheck,
    title: 'Keamanan Data',
    description: 'Data bisnis dan pelanggan terenkripsi dan aman. Backup otomatis setiap hari.',
  },
  {
    icon: Zap,
    title: 'Setup Cepat',
    description: 'Daftar, tambah menu, cetak QR, dan langsung pakai. Tidak perlu skill teknis atau hardware khusus.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Semua yang Dibutuhkan UMKM
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Fitur lengkap untuk mengelola bisnis kuliner Anda, dari pemesanan hingga laporan keuangan.
            Didesain khusus untuk kemudahan dan efisiensi.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="flex items-center justify-center w-14 h-14 mb-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

