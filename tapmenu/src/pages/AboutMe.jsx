import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function CustomerAbout() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Tentang Warung Bu Dewi'
  }, [])

  return (
    <div
      className="min-h-screen font-sans text-dark pb-24 bg-[#F7F5F2] relative"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="fixed top-4 left-4 z-30">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali ke halaman sebelumnya"
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-dark shadow-lg hover:bg-white transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
      </div>

      <div className="relative h-64 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
          className="w-full h-full object-cover"
          alt="Sampul Warung Bu Dewi"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F5F2] via-transparent to-transparent"></div>
      </div>

      <main className="px-6 -mt-20 relative z-10 fade-in">
        <div className="bg-white rounded-3xl p-6 shadow-card text-center mb-6">
          <div className="w-28 h-28 bg-white rounded-full p-1 mx-auto -mt-20 shadow-md mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
              className="w-full h-full object-cover rounded-full bg-gray-50"
              alt="Logo Warung Bu Dewi"
            />
          </div>

          <h1 className="text-2xl font-extrabold text-primary mb-1">Warung Bu Dewi</h1>
          <p className="text-sm text-gray-500 font-medium mb-3">Masakan Rumahan & Kopi Kekinian</p>

          <div className="flex justify-center gap-2 mb-6">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <i className="fa-solid fa-circle text-[8px] animate-pulse"></i> Buka Sekarang
            </span>
            <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <i className="fa-solid fa-star"></i> 4.8 (120 Ulasan)
            </span>
          </div>

          <div className="flex justify-center gap-4 border-t border-gray-100 pt-5">
            <a
              href="#"
              className="flex-1 flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg mb-1">
                <i className="fa-brands fa-instagram"></i>
              </div>
              <span className="text-[10px] font-bold">Instagram</span>
            </a>
            <a
              href="#"
              className="flex-1 flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg mb-1">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <span className="text-[10px] font-bold">WhatsApp</span>
            </a>
            <a
              href="#"
              className="flex-1 flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg mb-1">
                <i className="fa-solid fa-share-nodes"></i>
              </div>
              <span className="text-[10px] font-bold">Share</span>
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-lg text-dark mb-3 flex items-center gap-2">
            <i className="fa-solid fa-quote-left text-accent"></i> Cerita Kami
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
            "Warung Bu Dewi bermula dari resep keluarga turun-temurun sejak tahun 2010. Kami percaya bahwa makanan
            yang enak berasal dari bahan segar dan dimasak dengan hati. Tujuan kami sederhana: menyajikan rasa hangat
            rumah di setiap piring Anda."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-dark text-sm mb-1">Lokasi Kami</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Jl. Merdeka No. 45, Bandung Wetan, Kota Bandung, Jawa Barat
              </p>
              <a href="#" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                Lihat di Google Maps <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shrink-0">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-dark text-sm mb-2">Jam Operasional</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Senin - Jumat</span>
                  <span className="font-bold text-dark">08:00 - 21:00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Sabtu - Minggu</span>
                  <span className="font-bold text-dark">10:00 - 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg text-dark mb-3">Galeri Suasana</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                alt="Suasana Warung Bu Dewi 1"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=300&q=80"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                alt="Suasana Warung Bu Dewi 2"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 relative">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                alt="Suasana Warung Bu Dewi 3"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                +5 Lainnya
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-gray-400">&copy; 2024 Warung Bu Dewi. All rights reserved.</p>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="#"
          aria-label="Hubungi via WhatsApp"
          className="w-14 h-14 bg-[#25D366] rounded-full shadow-lg shadow-green-200 flex items-center justify-center text-white text-2xl hover:scale-105 transition-transform animate-bounce"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
      </div>
    </div>
  )
}
