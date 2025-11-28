import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'

export function VoucherManagement() {
    // --- DATA ---
    const [vouchers, setVouchers] = useState([
        {
            id: 1,
            code: "MERDEKA45",
            type: "percentage",
            value: 17,
            minPurchase: 50000,
            maxDiscount: 20000,
            usage: 45,
            limit: 100,
            startDate: "2023-08-01",
            endDate: "2023-08-31",
            active: true
        },
        {
            id: 2,
            code: "DISKON10",
            type: "fixed",
            value: 10000,
            minPurchase: 100000,
            maxDiscount: 0,
            usage: 88,
            limit: 100,
            startDate: "2023-10-01",
            endDate: "2023-10-31",
            active: false
        },
        {
            id: 3,
            code: "PROMO25",
            type: "percentage",
            value: 25,
            minPurchase: 40000,
            maxDiscount: 15000,
            usage: 12,
            limit: 50,
            startDate: "2023-10-25",
            endDate: "2023-11-05",
            active: true
        }
    ])

    // --- STATE ---
    const [searchInput, setSearchInput] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        maxDiscount: '',
        limit: '',
        startDate: '',
        endDate: ''
    })

    // --- LOGIC ---
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num)
    }

    const filteredVouchers = vouchers.filter(v => {
        const matchCode = v.code.toLowerCase().includes(searchInput.toLowerCase())
        const matchStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && v.active) ||
            (statusFilter === 'expired' && !v.active)
        return matchCode && matchStatus
    })

    const toggleStatus = (id) => {
        setVouchers(vouchers.map(v => v.id === id ? { ...v, active: !v.active } : v))
    }

    const openAddModal = () => {
        setEditingId(null)
        setFormData({
            code: '',
            type: 'percentage',
            value: '',
            minPurchase: '',
            maxDiscount: '',
            limit: '',
            startDate: '',
            endDate: ''
        })
        setIsModalOpen(true)
    }

    const editVoucher = (voucher) => {
        setEditingId(voucher.id)
        setFormData({
            code: voucher.code,
            type: voucher.type,
            value: voucher.value,
            minPurchase: voucher.minPurchase,
            maxDiscount: voucher.maxDiscount,
            limit: voucher.limit,
            startDate: voucher.startDate,
            endDate: voucher.endDate
        })
        setIsModalOpen(true)
    }

    const saveVoucher = () => {
        const { code, type, value, minPurchase, maxDiscount, limit, startDate, endDate } = formData

        if (!code || !value || !startDate || !endDate) {
            alert("Mohon lengkapi data wajib!")
            return
        }

        const data = {
            code: code.toUpperCase(),
            type,
            value: parseInt(value),
            minPurchase: parseInt(minPurchase) || 0,
            maxDiscount: parseInt(maxDiscount) || 0,
            limit: parseInt(limit) || 0,
            startDate,
            endDate
        }

        if (editingId) {
            setVouchers(vouchers.map(v => v.id === editingId ? { ...v, ...data } : v))
        } else {
            const newId = vouchers.length > 0 ? Math.max(...vouchers.map(v => v.id)) + 1 : 1
            setVouchers([...vouchers, { id: newId, ...data, usage: 0, active: true }])
        }

        setIsModalOpen(false)
    }

    const deleteVoucher = (id) => {
        if (confirm("Hapus voucher ini secara permanen?")) {
            setVouchers(vouchers.filter(v => v.id !== id))
        }
    }

    const getValuePrefix = () => {
        return formData.type === 'percentage' ? '%' : 'Rp'
    }

    return (
        <DashboardLayout>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
                        <div>
                            <h2 className="text-2xl font-bold text-dark tracking-tight">Voucher & Promo</h2>
                            <p className="text-xs text-gray-500 font-medium">Buat kode diskon untuk menarik pelanggan</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="group relative px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg hover:bg-primaryLight hover:shadow-glow transition-all flex items-center gap-2 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <i className="fa-solid fa-plus"></i> Buat Voucher
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scroll">
                    <div className="max-w-7xl mx-auto space-y-8 fade-in">

                        {/* Stats & Filter */}
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">

                            {/* Simple Stats */}
                            <div className="flex items-center gap-8 w-full md:w-auto pl-2">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Voucher</p>
                                    <p className="text-3xl font-extrabold text-dark leading-none">{vouchers.length}</p>
                                </div>
                                <div className="w-px h-8 bg-gray-300"></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Aktif</p>
                                    <p className="text-3xl font-extrabold text-green-600 leading-none">
                                        {vouchers.filter(v => v.active).length}
                                    </p>
                                </div>
                            </div>

                            {/* Search & Filter */}
                            <div className="flex gap-3 w-full md:w-auto flex-1 justify-end">
                                {/* Status Filter */}
                                <div className="relative">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-50"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="active">Aktif</option>
                                        <option value="expired">Berakhir</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                        <i className="fa-solid fa-chevron-down text-xs"></i>
                                    </div>
                                </div>

                                {/* Search */}
                                <div className="relative w-full md:w-64">
                                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Cari kode voucher..."
                                        className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Voucher Table */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[250px]">
                                                Kode Voucher
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Nilai Diskon
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Min. Belanja
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Penggunaan
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                Masa Berlaku
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredVouchers.length === 0 ? (
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                                            <i className="fa-solid fa-ticket-simple text-2xl"></i>
                                                        </div>
                                                        <h3 className="text-dark font-bold text-sm">Belum ada voucher</h3>
                                                        <p className="text-gray-400 text-xs mt-1">Buat kode promo pertama Anda untuk menarik pelanggan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredVouchers.map(v => {
                                                const opacity = v.active ? '' : 'opacity-50 grayscale bg-gray-50/50'
                                                const limitText = v.limit ? `${v.usage}/${v.limit}` : `${v.usage} / `
                                                const progressPercent = v.limit ? Math.min(100, Math.round((v.usage / v.limit) * 100)) : 0

                                                return (
                                                    <tr key={v.id} className={`hover:bg-gray-50 transition-colors group ${opacity}`}>
                                                        <td className="px-6 py-4 align-middle">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
                                                                    <i className="fa-solid fa-ticket"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-dark text-sm tracking-wide">{v.code}</div>
                                                                    <div className="text-[10px] text-gray-400 font-mono uppercase">{v.type}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 align-middle">
                                                            {v.type === 'percentage' ? (
                                                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                                                                    {v.value}% OFF
                                                                </span>
                                                            ) : (
                                                                <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold border border-orange-100">
                                                                    {formatRupiah(v.value)} OFF
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 align-middle">
                                                            <span className="text-sm font-medium text-gray-600">{formatRupiah(v.minPurchase)}</span>
                                                        </td>
                                                        <td className="px-6 py-4 align-middle">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold text-dark">{limitText}</span>
                                                                {v.limit && (
                                                                    <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                                        <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 align-middle">
                                                            <div className="text-xs text-gray-500 font-medium flex flex-col">
                                                                <span>{v.startDate}</span>
                                                                <span className="text-[9px] text-gray-400">s/d {v.endDate}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 align-middle text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="relative inline-block w-8 align-middle select-none">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={v.active}
                                                                        onChange={() => toggleStatus(v.id)}
                                                                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                                                                    />
                                                                    <label
                                                                        onClick={() => toggleStatus(v.id)}
                                                                        className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${v.active ? 'bg-primary' : 'bg-gray-300'}`}
                                                                    ></label>
                                                                </div>
                                                                {v.active ? (
                                                                    <span className="text-green-600 font-bold text-[10px] bg-green-50 px-2 py-1 rounded-md border border-green-100">Aktif</span>
                                                                ) : (
                                                                    <span className="text-gray-500 font-bold text-[10px] bg-gray-100 px-2 py-1 rounded-md border border-gray-200">Nonaktif</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 align-middle text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => editVoucher(v)}
                                                                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm"
                                                                >
                                                                    <i className="fa-solid fa-pen text-xs"></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteVoucher(v.id)}
                                                                    className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm"
                                                                >
                                                                    <i className="fa-solid fa-trash text-xs"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                {/* === ADD/EDIT MODAL === */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingId ? 'Edit Voucher' : 'Buat Voucher Baru'}
                    size="lg"
                    footer={
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveVoucher}
                                className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors"
                            >
                                Simpan Voucher
                            </button>
                        </div>
                    }
                >
                    <div className="space-y-6">

                        {/* Code & Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                    Kode Voucher <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-ticket absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-lg font-bold text-primary uppercase tracking-wider placeholder-gray-300"
                                        placeholder="CONTOH: DISKON10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tipe Potongan</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium"
                                >
                                    <option value="percentage">Persentase (%)</option>
                                    <option value="fixed">Nominal (Rp)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                                    Nilai Potongan <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className={`absolute ${formData.type === 'percentage' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm`}>
                                        {getValuePrefix()}
                                    </span>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3 focus:outline-none focus:border-primary text-sm font-bold ${formData.type === 'percentage' ? 'px-4 pr-8' : 'pl-10 pr-4'}`}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Limits */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min. Belanja (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Maks. Potongan (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                        placeholder="0 (Unlimited)"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Kuota Pemakaian</label>
                                <input
                                    type="number"
                                    value={formData.limit}
                                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Contoh: 100"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak terbatas.</p>
                            </div>
                        </div>

                        {/* Validity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tanggal Berakhir</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
        </DashboardLayout>
    )
}
