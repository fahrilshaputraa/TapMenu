import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { loadCustomerTrackedOrder } from '../../services/customerOrders'
import {
  CUSTOMER_LAST_ORDER_CODE_KEY,
  CUSTOMER_TIMELINE_STEPS,
  formatCustomerOrderCurrency,
  formatCustomerOrderDateTime,
  getCustomerOrderStatusColor,
  getCustomerOrderStatusLabel,
  getCustomerOrderTimelineState,
  getInitialCustomerOrderCode,
} from '../../utils/customerOrders'

export function CustomerOrder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchCode, setSearchCode] = useState(getInitialCustomerOrderCode(searchParams))
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(Boolean(getInitialCustomerOrderCode(searchParams)))
  const [error, setError] = useState('')

  useEffect(() => {
    const initialCode = getInitialCustomerOrderCode(searchParams)
    if (!initialCode) return

    let active = true

    async function loadOrder() {
      try {
        const payload = await loadCustomerTrackedOrder(initialCode)
        if (!active) return
        setOrder(payload)
        setError('')
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadOrder()
    return () => {
      active = false
    }
  }, [searchParams])

  const handleSearchOrder = async () => {
    if (!searchCode.trim()) {
      setError('Masukkan kode pesanan terlebih dahulu.')
      return
    }

    setLoading(true)
    try {
      const payload = await loadCustomerTrackedOrder(searchCode.trim().toUpperCase())
      setOrder(payload)
      localStorage.setItem(CUSTOMER_LAST_ORDER_CODE_KEY, payload.order_code)
      setError('')
    } catch (requestError) {
      setOrder(null)
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  const currentStatus = order?.status || 'PENDING'
  const currentStatusLabel = getCustomerOrderStatusLabel(currentStatus)
  const restaurantLogo = 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png'
  const createdAtLabel = formatCustomerOrderDateTime(order?.created_at)

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
                onClick={handleSearchOrder}
                className="px-4 py-2 bg-primary text-white rounded-xl shadow hover:bg-primaryLight transition-colors flex items-center justify-center"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </section>

          {error ? <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4">{error}</div> : null}

          {loading ? (
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 text-center text-sm text-gray-500">Memuat status pesanan...</div>
          ) : order ? (
          <section className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-[2rem] -mr-4 -mt-4"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getCustomerOrderStatusColor(currentStatus)}`}>{currentStatusLabel}</span>
                  <h3 className="text-xl font-extrabold text-dark mt-2 leading-tight">{order.order_code}</h3>
                  <p className="text-[11px] text-gray-500">{createdAtLabel}</p>
                </div>
                <div className="w-11 h-11 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                  <img src={restaurantLogo} alt="Logo restoran" className="w-8 h-8 object-contain" />
                </div>
              </div>

              <div className="space-y-5 relative pl-3">
                <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-100"></div>
                {CUSTOMER_TIMELINE_STEPS.map((step) => {
                  const { isActive, isDone } = getCustomerOrderTimelineState(step.id, currentStatus)

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
                  {order.items.map((item) => (
                    <div key={`${item.item_name}-${item.id}`} className="flex justify-between text-sm text-gray-600">
                      <span>
                        <b className="text-dark">{item.quantity}x</b> {item.item_name}
                      </span>
                      <span className="font-bold text-dark">{formatCustomerOrderCurrency(Number(item.unit_price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-lg font-extrabold text-primary">
                  <span>Total</span>
                  <span>{formatCustomerOrderCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </section>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-dashed border-gray-200 text-center text-sm text-gray-500">
              Masukkan kode pesanan untuk melihat status terbaru.
            </div>
          )}

          <button className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <i className="fa-brands fa-whatsapp text-green-500 text-lg"></i> Hubungi Bantuan
          </button>
        </div>
      </div>
    </div>
  )
}
