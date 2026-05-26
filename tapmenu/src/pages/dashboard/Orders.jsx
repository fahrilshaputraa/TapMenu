import { useEffect, useMemo, useState } from 'react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'
import { Table } from '../../components/Table'
import { useOrdersPolling } from '../../hooks/useOrdersPolling'
import {
  filterOrders,
  formatOrderRupiah,
  getOrderRowClass,
  getOrderStats,
  getOrderStatusLabel,
  mapOrderStatusToUi,
} from '../../utils/orders'

export function Orders() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedOrder, setSelectedOrder] = useState(null)
  const { orders, loading, error, setOrderStatus } = useOrdersPolling()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await setOrderStatus(id, newStatus)
      setSelectedOrder(updated)
    } catch (requestError) {
      // The polling hook already stores the user-visible error state.
      void requestError
    }
  }

  const filteredOrders = useMemo(() => filterOrders(orders, filter, searchQuery), [filter, orders, searchQuery])
  const stats = useMemo(() => getOrderStats(orders), [orders])

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
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

        <div className="flex-1 overflow-y-auto p-6 custom-scroll">
          <div className="max-w-7xl mx-auto space-y-8 fade-in">
            {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
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

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
                <div className="flex bg-white border border-gray-200 p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'new', label: 'Baru', dot: true },
                    { id: 'process', label: 'Diproses' },
                    { id: 'ready', label: 'Siap' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        filter === tab.id ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 font-medium'
                      }`}
                    >
                      {tab.label}
                      {tab.dot ? <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></span> : null}
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari ID / No. Meja..."
                    className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <Table
              columns={[
                {
                  header: 'ID Order',
                  accessor: (order) => (
                    <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">{order.order_code}</span>
                  ),
                },
                {
                  header: 'Pelanggan / Meja',
                  accessor: (order) => <div className="font-bold text-dark text-sm">{order.table_name || order.customer_name || 'Tanpa meja'}</div>,
                },
                {
                  header: 'Menu',
                  className: 'w-1/3',
                  accessor: (order) => {
                    const firstItem = order.items?.[0]
                    if (!firstItem) return <div className="text-sm text-gray-400">Tidak ada item</div>
                    return (
                      <div className="text-sm text-gray-600">
                        <span className="text-dark font-bold">{firstItem.quantity}x</span> {firstItem.item_name || firstItem.menu_item_name}
                        {order.items.length > 1 ? <span className="text-xs text-gray-400 italic"> +{order.items.length - 1} lainnya</span> : null}
                      </div>
                    )
                  },
                },
                {
                  header: 'Waktu',
                  accessor: (order) => (
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><i className="fa-regular fa-clock"></i> {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  ),
                },
                {
                  header: 'Status',
                  accessor: (order) => {
                    const uiStatus = mapOrderStatusToUi(order.status)
                    if (uiStatus === 'new') {
                      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-yellow-50 text-yellow-700 border border-yellow-100"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500 blink-dot"></div> Baru</span>
                    }
                    if (uiStatus === 'process') {
                      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100"><i className="fa-solid fa-fire-burner"></i> Dimasak</span>
                    }
                    if (uiStatus === 'ready') {
                      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100"><i className="fa-solid fa-bell-concierge"></i> Siap</span>
                    }
                    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200"><i className="fa-solid fa-check"></i> Selesai</span>
                  },
                },
                {
                  header: 'Total',
                  className: 'text-right',
                  cellClassName: 'text-right',
                  accessor: (order) => <span className="font-bold text-dark text-sm">{formatOrderRupiah(order.total_amount)}</span>,
                },
                {
                  header: 'Aksi',
                  className: 'text-right',
                  cellClassName: 'text-right',
                  accessor: (order) => (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-primary hover:text-primary transition-all text-xs font-bold shadow-sm"
                    >
                      Lihat
                    </button>
                  ),
                },
              ]}
              data={filteredOrders.map((order) => ({ ...order, _rowClass: getOrderRowClass(order) }))}
              isLoading={loading}
              emptyState={
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                    <i className="fa-solid fa-clipboard-list text-2xl"></i>
                  </div>
                  <h3 className="text-dark font-bold text-sm">Tidak ada pesanan</h3>
                  <p className="text-gray-400 text-xs mt-1">Belum ada pesanan yang sesuai dengan filter ini.</p>
                </div>
              }
            />
          </div>
        </div>

        <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Detail Pesanan" size="md">
          {selectedOrder ? (
            <>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Meja</span>
                    <span className="font-bold text-dark">{selectedOrder.table_name || selectedOrder.customer_name || 'Tanpa meja'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">Waktu</span>
                    <span className="text-xs text-dark font-medium">{new Date(selectedOrder.created_at).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      mapOrderStatusToUi(selectedOrder.status) === 'new'
                        ? 'bg-yellow-100 text-yellow-700'
                        : mapOrderStatusToUi(selectedOrder.status) === 'process'
                          ? 'bg-blue-100 text-blue-700'
                          : mapOrderStatusToUi(selectedOrder.status) === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                    }`}
                    >
                      {getOrderStatusLabel(mapOrderStatusToUi(selectedOrder.status))}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-500 uppercase mb-2 px-1">Daftar Menu</p>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div key={index} className="flex justify-between items-start bg-white p-2 rounded border border-gray-50">
                      <div>
                        <p className="text-sm font-bold text-dark">
                          <span className="text-primary mr-1">{item.quantity}x</span> {item.item_name || item.menu_item_name}
                        </p>
                        {item.notes ? (
                          <p className="text-[10px] text-gray-500 italic bg-gray-50 px-1.5 rounded inline-block mt-0.5">
                            {item.notes}
                          </p>
                        ) : null}
                      </div>
                      <p className="text-xs font-bold text-gray-600">{formatOrderRupiah(item.subtotal || item.quantity * item.unit_price)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatOrderRupiah(selectedOrder.subtotal_amount || selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pajak + Biaya</span>
                    <span>{formatOrderRupiah((selectedOrder.tax_amount || 0) + (selectedOrder.service_amount || 0))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-primary pt-2">
                    <span>Total</span>
                    <span>{formatOrderRupiah(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-white border-t border-gray-100 grid grid-cols-1 gap-3">
                {mapOrderStatusToUi(selectedOrder.status) === 'new' ? (
                  <button onClick={() => updateStatus(selectedOrder.id, 'preparing')} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primaryLight shadow-lg">
                    Terima & Masak
                  </button>
                ) : null}
                {mapOrderStatusToUi(selectedOrder.status) === 'process' ? (
                  <button onClick={() => updateStatus(selectedOrder.id, 'ready')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg">
                    Selesai Masak
                  </button>
                ) : null}
                {mapOrderStatusToUi(selectedOrder.status) === 'ready' ? (
                  <button onClick={() => updateStatus(selectedOrder.id, 'completed')} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
                    Antar & Selesai
                  </button>
                ) : null}
                {mapOrderStatusToUi(selectedOrder.status) === 'completed' ? (
                  <button className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Pesanan Ditutup
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
        </Modal>
      </div>
    </DashboardLayout>
  )
}
