import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  customerFavoriteCategories,
  defaultCustomerFavorites,
  filterCustomerFavorites,
  formatCustomerFavoriteRupiah,
  removeCustomerFavorite,
} from '../../utils/customerFavorites'

export function CustomerFavorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState(defaultCustomerFavorites)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [query, setQuery] = useState('')

  const filteredFavorites = useMemo(
    () => filterCustomerFavorites(favorites, selectedCategory, query),
    [favorites, selectedCategory, query],
  )

  const removeFavorite = (itemId) => {
    setFavorites((prev) => removeCustomerFavorite(prev, itemId))
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-6 flex flex-col fade-in">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center gap-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-gray-50 text-dark hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Favorit</p>
          <h2 className="text-base font-bold text-dark">Favorit Saya</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <div className="max-w-lg w-full mx-auto space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 space-y-4">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="Cari menu favoritmu..."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {customerFavoriteCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${selectedCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow shadow-primary/30'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFavorites.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                Belum ada menu favorit untuk filter ini.
              </div>
            ) : (
              filteredFavorites.map((item) => (
                <section key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 flex gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl -mr-4 -mt-4"></div>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold text-dark px-2 py-0.5 rounded-full shadow-sm">
                      {item.rating.toFixed(1)} ★
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 relative z-10 flex flex-col">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold text-dark text-base leading-tight">{item.name}</h3>
                        <p className="text-[11px] text-gray-500 line-clamp-2">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFavorite(item.id)}
                        className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                        aria-label={`Hapus ${item.name} dari favorit`}
                      >
                        <i className="fa-solid fa-xmark text-sm"></i>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 rounded-full">
                          {tag}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-secondary text-primary rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Harga</p>
                        <p className="text-lg font-extrabold text-primary">{formatCustomerFavoriteRupiah(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow hover:bg-primaryLight transition-colors flex items-center gap-2"
                      >
                        Pesan Lagi
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  </div>
                </section>
              ))
            )}
          </div>

          <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <i className="fa-brands fa-whatsapp text-green-500 text-lg"></i> Hubungi Bantuan
          </button>
        </div>
      </div>
    </div>
  )
}
