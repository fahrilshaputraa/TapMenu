import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function Orders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-1024",
      table: "Meja 4 (Indoor)",
      time: "Baru Saja",
      timestamp: Date.now(),
      status: "new",
      total: 58000,
      items: [
        { name: "Nasi Goreng Spesial", qty: 1, price: 25000, notes: "Pedas, Tanpa Acar" },
        { name: "Sate Ayam Madura", qty: 1, price: 25000, notes: "" },
        { name: "Es Teh Manis", qty: 1, price: 8000, notes: "Es Sedikit" }
      ]
    },
    {
      id: "ORD-1023",
      table: "Meja 2",
      time: "5 Menit lalu",
      timestamp: Date.now() - 300000,
      status: "new",
      total: 18000,
      items: [
        { name: "Kopi Susu Gula Aren", qty: 1, price: 18000, notes: "Less Sugar" }
      ]
    },
    {
      id: "ORD-1022",
      table: "Meja 8 (Outdoor)",
      time: "12:15",
      timestamp: Date.now() - 900000,
      status: "process",
      total: 45000,
      items: [
        { name: "Pisang Keju", qty: 2, price: 15000, notes: "" },
        { name: "Jus Alpukat", qty: 1, price: 15000, notes: "" }
      ]
    },
    {
      id: "ORD-1020",
      table: "Bungkus - Rini",
      time: "12:00",
      timestamp: Date.now() - 1800000,
      status: "ready",
      total: 30000,
      items: [
        { name: "Ayam Geprek", qty: 2, price: 15000, notes: "Sambal Pisah" }
      ]
    },
    {
      id: "ORD-1019",
      table: "Meja 5",
      time: "11:45",
      timestamp: Date.now() - 2700000,
      status: "completed",
      total: 55000,
      items: [
        { name: "Mie Goreng Jawa", qty: 2, price: 20000, notes: "" },
        { name: "Es Teh", qty: 3, price: 5000, notes: "" }
      ]
    }
  ])

  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
  }

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        let newTime = order.time
        if (newStatus === 'process') newTime = 'Sedang Dimasak'
        if (newStatus === 'ready') newTime = 'Baru Saja'
        return { ...order, status: newStatus, time: newTime }
      }
      return order
    }))
    setSelectedOrder(null)
  }

  const filteredOrders = orders.filter(order => {
    const matchStatus = filter === 'all' || order.status === filter
    const matchSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'new').length
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
            <div>
              <h2 className="text-xl font-bold text-dark">Daftar Pesanan</h2>
              <p className="text-xs text-gray-500">Kelola pesanan masuk dan status dapur</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-primary">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[10px] text-gray-400">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-8 fade-in">

            {/* Stats & Filter */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">

              {/* Stats */}
              <div className="flex items-center gap-8 w-full md:w-auto pl-2">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pesanan Hari Ini</p>
                  <p className="text-3xl font-extrabold text-dark leading-none">{stats.total}</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Perlu Diproses</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-extrabold text-yellow-600 leading-none">{stats.pending}</p>
                    {stats.pending > 0 && <span className="w-2 h-2 bg-red-500 rounded-full blink-dot"></span>}
                  </div>
                </div>
              </div>

              {/* Filter & Search */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
                {/* Filter Tabs */}
                <div className="flex bg-white border border-gray-200 p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'new', label: 'Baru', dot: true },
                    { id: 'process', label: 'Diproses' },
                    { id: 'ready', label: 'Siap' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filter === tab.id
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 font-medium"
                        }`}
                    >
                      {tab.label}
                      {tab.dot && <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></span>}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative sm:w-64">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ID / No. Meja..."
                    className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Order Table */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Order</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pelanggan / Meja</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Menu</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map(order => {
                    let statusBadge;
                    let rowClass = '';

                    if (order.status === 'new') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-yellow-50 text-yellow-700 border border-yellow-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 blink-dot"></div> Baru
                        </span>
                      );
                      rowClass = 'bg-yellow-50/30';
                    } else if (order.status === 'process') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                          <i className="fa-solid fa-fire-burner"></i> Dimasak
                        </span>
                      );
                    } else if (order.status === 'ready') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100">
                          <i className="fa-solid fa-bell-concierge"></i> Siap
                        </span>
                      );
                    } else {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
                          <i className="fa-solid fa-check"></i> Selesai
                        </span>
                      );
                      rowClass = 'opacity-75 grayscale-[0.5]';
                    }

                    return (
                      <tr key={order.id} className={`hover:bg-gray-50 transition-colors group ${rowClass}`}>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-dark text-sm">{order.table}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            <span className="text-dark font-bold">{order.items[0].qty}x</span> {order.items[0].name}
                            {order.items.length > 1 && <span className="text-xs text-gray-400 italic"> +{order.items.length - 1} lainnya</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><i className="fa-regular fa-clock"></i> {order.time}</span>
                        </td>
                        <td className="px-6 py-4">
                          {statusBadge}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-dark text-sm">{formatRupiah(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-all text-xs font-bold shadow-sm"
                          >
                            Lihat
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                    <i className="fa-solid fa-clipboard-list text-2xl"></i>
                  </div>
                  <h3 className="text-dark font-bold text-sm">Tidak ada pesanan</h3>
                  <p className="text-gray-400 text-xs mt-1">Belum ada pesanan yang sesuai dengan filter ini.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <div>
                  <h3 className="font-bold text-lg text-dark">Detail Pesanan</h3>
                  <p className="text-xs text-gray-500">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scroll bg-[#F9FAFB]">

                {/* Status Box */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Meja</span>
                    <span className="font-bold text-dark">{selectedOrder.table}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Waktu</span>
                    <span className="text-xs text-dark font-medium">{selectedOrder.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${selectedOrder.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                        selectedOrder.status === 'process' ? 'bg-blue-100 text-blue-700' :
                          selectedOrder.status === 'ready' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-500'
                      }`}>
                      {selectedOrder.status === 'new' ? 'Baru' :
                        selectedOrder.status === 'process' ? 'Dimasak' :
                          selectedOrder.status === 'ready' ? 'Siap Saji' : 'Selesai'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 px-1">Daftar Menu</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start bg-white p-2 rounded border border-gray-50">
                      <div>
                        <p className="text-sm font-bold text-dark">
                          <span className="text-primary mr-1">{item.qty}x</span> {item.name}
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-gray-500 italic bg-gray-50 px-1.5 rounded inline-block mt-0.5">
                            {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-600">{formatRupiah(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatRupiah(selectedOrder.total / 1.1)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pajak (10%)</span>
                    <span>{formatRupiah(selectedOrder.total - (selectedOrder.total / 1.1))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-primary pt-2">
                    <span>Total</span>
                    <span>{formatRupiah(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-5 bg-white border-t border-gray-100 grid grid-cols-1 gap-3">
                {selectedOrder.status === 'new' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'process')}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primaryLight shadow-lg"
                  >
                    Terima & Masak
                  </button>
                )}
                {selectedOrder.status === 'process' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'ready')}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg"
                  >
                    Selesai Masak
                  </button>
                )}
                {selectedOrder.status === 'ready' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'completed')}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg"
                  >
                    Antar & Selesai
                  </button>
                )}
                {selectedOrder.status === 'completed' && (
                  <button className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Pesanan Ditutup
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
