import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function Employee() {
    const [employees, setEmployees] = useState([
        { id: 1, name: "Siti Aminah", role: "Kasir", pin: "112233", active: true, avatar: "https://i.pravatar.cc/150?img=1" },
        { id: 2, name: "Joko Susilo", role: "Kasir", pin: "556677", active: true, avatar: "https://i.pravatar.cc/150?img=11" },
        { id: 3, name: "Rini Wati", role: "Kasir", pin: "889900", active: true, avatar: "https://i.pravatar.cc/150?img=5" },
        { id: 4, name: "Andi Setiawan", role: "Kasir", pin: "000000", active: false, avatar: "https://i.pravatar.cc/150?img=3" },
        { id: 5, name: "Budi Santoso", role: "Kasir", pin: "123123", active: true, avatar: "https://i.pravatar.cc/150?img=8" },
    ])

    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [showPin, setShowPin] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        pin: '',
        avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    })

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = employees.filter(e => e.active).length

    const handleOpenModal = (emp = null) => {
        if (emp) {
            setEditingId(emp.id)
            setFormData({
                name: emp.name,
                pin: emp.pin,
                avatar: emp.avatar
            })
        } else {
            setEditingId(null)
            setFormData({
                name: '',
                pin: '',
                avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
            })
        }
        setShowModal(true)
        setShowPin(false)
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setFormData({ ...formData, avatar: e.target.result })
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        if (!formData.name || formData.pin.length < 4) {
            alert("Nama dan PIN (min 4 digit) wajib diisi!")
            return
        }

        if (editingId) {
            setEmployees(employees.map(emp =>
                emp.id === editingId
                    ? { ...emp, ...formData }
                    : emp
            ))
        } else {
            const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1
            setEmployees([...employees, {
                id: newId,
                ...formData,
                role: "Kasir",
                active: true
            }])
        }
        handleCloseModal()
    }

    const handleDelete = (id) => {
        if (window.confirm("Hapus kasir ini?")) {
            setEmployees(employees.filter(e => e.id !== id))
        }
    }

    const toggleStatus = (id) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, active: !emp.active } : emp
        ))
    }

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="flex justify-between items-center -mt-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-dark">Manajemen Kasir</h2>
                    <p className="text-xs text-gray-500">Kelola akses dan PIN login tim kasir Anda</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primaryLight transition-all flex items-center gap-2"
                >
                    <i className="fa-solid fa-user-plus"></i>
                    <span className="hidden sm:inline">Tambah Kasir</span>
                </button>
            </div>

            {/* Stats & Search */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                <div className="flex items-center gap-8 w-full md:w-auto pl-2">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Kasir</p>
                        <p className="text-3xl font-extrabold text-dark leading-none">{employees.length}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status Aktif</p>
                        <p className="text-3xl font-extrabold text-green-600 leading-none">{activeCount}</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama kasir..."
                        className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Karyawan</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Pegawai</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">PIN Akses</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Login</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                            <i className="fa-solid fa-user-slash text-2xl"></i>
                                        </div>
                                        <h3 className="text-dark font-bold text-sm">Tidak ditemukan</h3>
                                        <p className="text-gray-400 text-xs mt-1">Coba kata kunci lain atau tambah kasir baru.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className={`hover:bg-gray-50 transition-colors group ${!emp.active ? 'opacity-50 bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                                            <div>
                                                <div className="font-bold text-dark text-sm">{emp.name}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-0.5 text-primary/80">Kasir</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">#{emp.id.toString().padStart(3, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 group/pin">
                                            <span className="font-mono font-bold text-dark text-sm tracking-[0.2em] blur-[3px] group-hover/pin:blur-0 transition-all cursor-default">******</span>
                                            <button
                                                onClick={() => alert(`PIN: ${emp.pin}`)}
                                                className="text-gray-300 hover:text-primary transition-colors"
                                                title="Lihat PIN"
                                            >
                                                <i className="fa-regular fa-eye text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative inline-block w-9 align-middle select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={emp.active}
                                                    onChange={() => toggleStatus(emp.id)}
                                                    className="peer absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                                                />
                                                <label
                                                    onClick={() => toggleStatus(emp.id)}
                                                    className="block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 peer-checked:bg-primary"
                                                ></label>
                                            </div>
                                            {emp.active ? (
                                                <span className="text-green-600 font-bold text-xs">Aktif</span>
                                            ) : (
                                                <span className="text-gray-400 font-bold text-xs">Nonaktif</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(emp)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm"
                                            >
                                                <i className="fa-solid fa-pen text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.id)}
                                                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm"
                                            >
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <h3 className="font-bold text-xl text-dark">{editingId ? 'Edit Kasir' : 'Tambah Kasir'}</h3>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-primary/30 group-hover:border-primary transition-colors">
                                        <img
                                            src={formData.avatar}
                                            alt="Preview"
                                            className="w-full h-full rounded-full object-cover bg-gray-50"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                                        <i className="fa-solid fa-camera text-xs"></i>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleAvatarUpload}
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Foto Profil (Opsional)</p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400"
                                            placeholder="Nama Karyawan"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">PIN Akses (6 Digit) <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                        <input
                                            type={showPin ? "text" : "password"}
                                            value={formData.pin}
                                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                            maxLength="6"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:border-primary text-sm font-medium tracking-widest font-mono placeholder-gray-400"
                                            placeholder="000000"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <i className={`fa-regular ${showPin ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                                        <i className="fa-solid fa-circle-info"></i> PIN digunakan untuk login ke sistem POS.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors"
                            >
                                Simpan Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}
