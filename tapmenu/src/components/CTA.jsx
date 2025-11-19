import { ArrowRight, Check } from 'lucide-react'

const benefits = [
  'Gratis selamanya untuk UMKM',
  'Tidak perlu kartu kredit',
  'Setup dalam 5 menit',
  'Dukungan pelanggan 24/7',
]

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Siap Tingkatkan Bisnis Anda?
              </h2>
              <p className="text-lg text-emerald-100 mb-8">
                Bergabung dengan ribuan UMKM yang sudah menggunakan TapMenu untuk mengelola bisnis mereka dengan lebih efisien.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-md mx-auto">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-white">
                    <Check className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <a
                href="#signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-emerald-600 bg-white hover:bg-emerald-50 rounded-lg shadow-lg transition-colors"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
