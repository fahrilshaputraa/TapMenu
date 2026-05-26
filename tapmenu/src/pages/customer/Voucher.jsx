import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  claimCustomerVoucher,
  customerVoucherStatusLabels,
  defaultCustomerVouchers,
  filterCustomerVouchers,
  formatCustomerVoucherRupiah,
  getCustomerVoucherBenefitLabel,
  getCustomerVoucherEmptyStateText,
} from '../../utils/customerVouchers'

/** @typedef {import('../../types/customerVouchers').CustomerVoucherClaimStatus} CustomerVoucherClaimStatus */

export function CustomerVoucher() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('active')
  const [vouchers, setVouchers] = useState(defaultCustomerVouchers)
  const [voucherCode, setVoucherCode] = useState('')
  /** @type {[CustomerVoucherClaimStatus | null, import('react').Dispatch<import('react').SetStateAction<CustomerVoucherClaimStatus | null>>]} */
  const [claimStatus, setClaimStatus] = useState(null)

  const filteredVouchers = useMemo(() => filterCustomerVouchers(vouchers, tab), [tab, vouchers])

  const handleClaimVoucher = (event) => {
    event.preventDefault()
    const result = claimCustomerVoucher(vouchers, voucherCode)
    setVouchers(result.nextVouchers)
    setVoucherCode(result.nextVoucherCode)
    setClaimStatus(result.claimStatus)
  }

  const emptyStateText = getCustomerVoucherEmptyStateText(tab)

  return (
    <div id="voucher-view" className="min-h-screen bg-[#F7F5F2] pb-6 flex flex-col fade-in">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center gap-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-gray-50 text-dark hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Voucher</p>
          <h2 className="text-base font-bold text-dark">Voucher Saya</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        <div className="max-w-lg w-full mx-auto space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-2 flex gap-2 text-sm font-bold">
            <button
              type="button"
              onClick={() => setTab('active')}
              className={`flex-1 py-2 rounded-xl transition-all ${tab === 'active'
                ? 'bg-primary text-white shadow'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`flex-1 py-2 rounded-xl transition-all ${tab === 'history'
                ? 'bg-primary text-white shadow'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              Riwayat
            </button>
          </div>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 space-y-3">
            <div>
              <h3 className="text-base font-bold text-dark">Klaim Kode Voucher</h3>
              <p className="text-xs text-gray-500">Masukkan kode promo yang kamu miliki.</p>
            </div>
            <form className="flex gap-2" onSubmit={handleClaimVoucher}>
              <input
                type="text"
                value={voucherCode}
                onChange={(event) => {
                  setVoucherCode(event.target.value.toUpperCase())
                  setClaimStatus(null)
                }}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono font-bold uppercase focus:outline-none focus:border-primary"
                placeholder="MASUKKAN KODE"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow hover:bg-primaryLight transition-colors flex items-center gap-2"
              >
                Klaim
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </form>
            {claimStatus && (
              <p className={`text-xs font-semibold ${
                claimStatus.type === 'success' ? 'text-green-600' :
                  claimStatus.type === 'info' ? 'text-blue-600' :
                    'text-red-500'
              }`}>
                {claimStatus.message}
              </p>
            )}
          </section>

          <div className="space-y-3" id="customer-voucher-list">
            {filteredVouchers.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                {emptyStateText}
              </div>
            )}

            {filteredVouchers.map((voucher) => {
              const statusInfo = customerVoucherStatusLabels[voucher.status]
              const isDisabled = voucher.status !== 'active'

              return (
                <section key={voucher.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl -mr-4 -mt-4"></div>
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusInfo?.className || 'bg-gray-100 text-gray-500'}`}>
                          {statusInfo?.label || 'Tidak diketahui'}
                        </span>
                        <h3 className="text-lg font-extrabold text-dark mt-2 leading-tight">{voucher.title}</h3>
                        <p className="text-[11px] text-gray-500">{voucher.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Kode</div>
                        <div className="text-base font-mono font-bold text-primary">{voucher.code}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-500">
                      <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <p className="font-bold text-dark text-xs">Min. Transaksi</p>
                        <p className="mt-1">{formatCustomerVoucherRupiah(voucher.minOrder)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                        <p className="font-bold text-dark text-xs">Berlaku s/d</p>
                        <p className="mt-1">{voucher.expiresAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-bold text-primary">
                        <span>{getCustomerVoucherBenefitLabel(voucher)}</span>
                      </div>
                      <button
                        type="button"
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white shadow hover:bg-primaryLight'
                          }`}
                      >
                        {isDisabled ? 'Tidak Tersedia' : 'Gunakan'}
                        {!isDisabled && <i className="fa-solid fa-arrow-right text-xs"></i>}
                      </button>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
