import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ordersSeed = [
  {
    id: 'ORD-1021',
    type: 'Dine-in',
    table: 'Meja 4',
    date: '24 Okt 2023',
    time: '13:10',
    status: 'completed',
    total: 82000,
    payment: 'QRIS',
    items: [
      { name: 'Nasi Rawon', qty: 1 },
      { name: 'Es Kopi Susu', qty: 1 },
    ],
  },
  {
    id: 'ORD-1020',
    type: 'Take Away',
    table: 'Pickup',
    date: '23 Okt 2023',
    time: '19:25',
    status: 'cancelled',
    total: 45000,
    payment: 'Tunai',
    items: [
      { name: 'Ayam Bakar Madu', qty: 1 },
      { name: 'Es Teh', qty: 1 },
    ],
  },
  {
    id: 'ORD-1019',
    type: 'Delivery',
    table: 'JNE Express',
    date: '22 Okt 2023',
    time: '11:00',
    status: 'completed',
    total: 125000,
    payment: 'Transfer',
    items: [
      { name: 'Paket Nasi Liwet', qty: 2 },
      { name: 'Tahu Crispy', qty: 1 },
    ],
  },
]

const statusMap = {
  completed: { label: 'Selesai', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  pending: { label: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
}

const formatRupiah = (value) => `Rp ${value.toLocaleString('id-ID')}`

export function CustomerOrderHistory() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const filteredOrders = useMemo(() => {
    return ordersSeed.filter((order) => {
      if (tab === 'completed' && order.status !== 'completed') return false
      if (tab === 'cancelled' && order.status !== 'cancelled') return false
      if (query && !order.id.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [tab, query])

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
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Riwayat</p>
          <h2 className="text-base font-bold text-dark">Riwayat Pesanan</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <div className="max-w-lg w-full mx-auto space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-3 space-y-3">
            <div className="flex gap-2 text-sm font-bold">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'completed', label: 'Selesai' },
                { id: 'cancelled', label: 'Dibatalkan' },
              ].map((button) => (
                <button
                  key={button.id}
                  type="button"
                  onClick={() => setTab(button.id)}
                  className={`flex-1 py-2 rounded-xl transition-all ${tab === button.id
                    ? 'bg-primary text-white shadow'
                    : 'bg-gray-50 text-gray-500 hover:text-dark'
                    }`}
                >
                  {button.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Cari kode pesanan (misal: ORD-1021)"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                Riwayat pesanan untuk filter ini kosong.
              </div>
            )}

            {filteredOrders.map((order) => {
              const statusInfo = statusMap[order.status] || statusMap.pending
              return (
                <section key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[2.5rem] -mr-6 -mt-6"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                        <h3 className="text-xl font-extrabold text-dark mt-2 leading-tight">{order.id}</h3>
                        <p className="text-xs text-gray-500">{order.date} • {order.time}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p className="font-bold text-dark">{order.type}</p>
                        <p>{order.table}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-3">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Ringkasan Menu</div>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {order.items.map((item) => (
                          <li key={item.name} className="flex justify-between">
                            <span><b className="text-dark">{item.qty}x</b> {item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        <p className="font-bold text-gray-600">Pembayaran</p>
                        <p>{order.payment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold uppercase text-gray-400">Total</p>
                        <p className="text-lg font-extrabold text-primary">{formatRupiah(order.total)}</p>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <i className="fa-brands fa-whatsapp text-green-500 text-lg"></i> Hubungi Bantuan
          </button>
        </div>
      </div>
    </div>
  )
}
