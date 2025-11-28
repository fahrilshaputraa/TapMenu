import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SAMPLE_ORDER = {
  code: 'ORD-1024',
  status: 'cooking',
  statusLabel: 'Sedang Dimasak',
  date: '25 Okt 2023, 14:30',
  restaurantLogo: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
  items: [
    { name: 'Nasi Goreng Spesial', quantity: 1, price: 25000 },
    { name: 'Es Teh Manis', quantity: 1, price: 5000 },
  ],
}

const TIMELINE_STEPS = [
  {
    id: 'received',
    title: 'Pesanan Diterima',
    description: '14:30 • Pesanan masuk ke dapur',
    icon: 'fa-solid fa-check',
  },
  {
    id: 'cooking',
    title: 'Sedang Dimasak',
    description: 'Mohon tunggu, koki sedang menyiapkan.',
    icon: 'fa-solid fa-fire-burner',
  },
  {
    id: 'ready',
    title: 'Siap Disajikan',
    description: 'Pesanan akan diantar ke meja.',
    icon: 'fa-solid fa-bell-concierge',
  },
]

const statusColors = {
  received: 'bg-green-100 text-green-700',
  cooking: 'bg-blue-100 text-blue-700',
  ready: 'bg-gray-100 text-gray-600',
}

export function CustomerOrder() {
  const navigate = useNavigate()
  const [searchCode, setSearchCode] = useState(SAMPLE_ORDER.code)

  const totals = useMemo(() => {
    const subtotal = SAMPLE_ORDER.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return {
      subtotal,
      formatted: subtotal.toLocaleString('id-ID'),
    }
  }, [])

  return (
    <div id="check-order-view" className="min-h-screen bg-[#F7F5F2] pb-6 flex flex-col fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center gap-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-gray-50 text-dark hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Lacak</p>
          <h2 className="text-base font-bold text-dark">Status Pesanan</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <div className="max-w-lg w-full mx-auto space-y-4">
          {/* Search Box */}
          <section className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100">
            <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block tracking-wide">Cari Kode Pesanan</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCode}
                onChange={(event) => setSearchCode(event.target.value.toUpperCase())}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-primary focus:outline-none focus:border-primary uppercase"
                placeholder="ORD-XXXX"
              />
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-xl shadow hover:bg-primaryLight transition-colors flex items-center justify-center"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </section>

          {/* Order Card */}
          <section className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-[2rem] -mr-4 -mt-4"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[SAMPLE_ORDER.status]}`}>{SAMPLE_ORDER.statusLabel}</span>
                  <h3 className="text-xl font-extrabold text-dark mt-2 leading-tight">{SAMPLE_ORDER.code}</h3>
                  <p className="text-[11px] text-gray-500">{SAMPLE_ORDER.date}</p>
                </div>
                <div className="w-11 h-11 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                  <img src={SAMPLE_ORDER.restaurantLogo} alt="Logo restoran" className="w-8 h-8 object-contain" />
                </div>
              </div>

              <div className="space-y-5 relative pl-3">
                <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-100"></div>
                {TIMELINE_STEPS.map((step) => {
                  const isActive = step.id === SAMPLE_ORDER.status
                  const isDone = TIMELINE_STEPS.findIndex((s) => s.id === step.id) <
                    TIMELINE_STEPS.findIndex((s) => s.id === SAMPLE_ORDER.status)

                  const bubbleClass = isDone
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-blue-500 border-4 border-blue-100 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-500'

                  return (
                    <div key={step.id} className={`flex gap-3 items-start ${!isActive && !isDone ? 'opacity-60' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${bubbleClass}`}>
                        <i className={`${step.icon} text-[10px]`}></i>
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold leading-none ${isActive ? 'text-blue-600' : 'text-dark'}`}>{step.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Rincian Pesanan</p>
                <div className="space-y-2">
                  {SAMPLE_ORDER.items.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm text-gray-600">
                      <span>
                        <b className="text-dark">{item.quantity}x</b> {item.name}
                      </span>
                      <span className="font-bold text-dark">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-lg font-extrabold text-primary">
                  <span>Total</span>
                  <span>Rp {totals.formatted}</span>
                </div>
              </div>
            </div>
          </section>

          <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <i className="fa-brands fa-whatsapp text-green-500 text-lg"></i> Hubungi Bantuan
          </button>
        </div>
      </div>
    </div>
  )
}
