import { QrCode, Utensils, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: QrCode,
    step: '01',
    title: 'Scan QR Code',
    description: 'Pelanggan scan QR code yang ada di meja menggunakan kamera HP.',
  },
  {
    icon: Utensils,
    step: '02',
    title: 'Pilih Menu',
    description: 'Lihat menu digital lengkap dengan foto dan deskripsi, lalu pilih pesanan.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Bayar Online',
    description: 'Bayar langsung via QRIS, e-wallet, atau transfer bank.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Pesanan Diproses',
    description: 'Dapur menerima pesanan otomatis dan pelanggan tinggal tunggu.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Cara Kerja TapMenu
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Proses sederhana yang memudahkan pelanggan dan meningkatkan efisiensi bisnis Anda.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent -translate-x-1/2" />
              )}

              <div className="text-center">
                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                  <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-full" />
                  <div className="relative flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full text-white">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold rounded-full">
                    {item.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
