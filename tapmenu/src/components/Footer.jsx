import { QrCode } from 'lucide-react'

const footerLinks = {
  produk: [
    { name: 'Fitur', href: '#features' },
    { name: 'Cara Kerja', href: '#how-it-works' },
    { name: 'Harga', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ],
  perusahaan: [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Karir', href: '#careers' },
    { name: 'Kontak', href: '#contact' },
  ],
  legal: [
    { name: 'Kebijakan Privasi', href: '#privacy' },
    { name: 'Syarat & Ketentuan', href: '#terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-lg">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-white">TapMenu</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm">
              Solusi lengkap untuk UMKM dalam mengelola pesanan, pembayaran, dan laporan bisnis. Gratis selamanya.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} TapMenu. All rights reserved.
            </p>
          </div>

          {/* Produk */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Produk</h3>
            <ul className="space-y-3">
              {footerLinks.produk.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Perusahaan</h3>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
