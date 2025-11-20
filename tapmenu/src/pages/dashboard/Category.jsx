import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function Category() {
    // --- DATA ---
    const [categories, setCategories] = useState([
        { id: 1, name: "Makanan Berat", type: "menu", icon: "fa-bowl-rice", count: 12, active: true },
        { id: 2, name: "Minuman", type: "menu", icon: "fa-mug-hot", count: 8, active: true },
        { id: 3, name: "Area Indoor", type: "table", icon: "fa-house", count: 5, active: true },
        { id: 4, name: "Area Outdoor", type: "table", icon: "fa-umbrella-beach", count: 3, active: true },
    ])

    const menuIcons = [
        "fa-bowl-rice", "fa-burger", "fa-pizza-slice", "fa-hotdog", "fa-ice-cream",
        "fa-mug-hot", "fa-wine-glass", "fa-martini-glass", "fa-bottle-water", "fa-utensils",
        "fa-percent", "fa-star", "fa-fire", "fa-leaf", "fa-fish"
    ]
    const tableIcons = [
        "fa-chair", "fa-couch", "fa-umbrella-beach", "fa-house", "fa-building",
        "fa-users", "fa-user", "fa-crown", "fa-door-open", "fa-shop"
    ]

    // --- STATE ---
    const [filter, setFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        type: 'menu',
        icon: menuIcons[0],
        active: true
    })

    // --- LOGIC ---
    const filteredCategories = categories.filter(c => filter === 'all' || c.type === filter)

    const toggleStatus = (id) => {
        setCategories(categories.map(c => c.id === id ? { ...c, active: !c.active } : c))
    }

    const openAddModal = () => {
        setEditingId(null)
        setFormData({
            name: '',
            type: 'menu',
            icon: menuIcons[0],
            active: true
        })
        setIsModalOpen(true)
    }

    const editCategory = (cat) => {
        setEditingId(cat.id)
        setFormData({
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            active: cat.active
        })
        setIsModalOpen(true)
    }

    const saveCategory = () => {
        if (!formData.name) {
            alert("Nama kategori wajib diisi!")
            return
        }

        if (editingId) {
            setCategories(categories.map(c => c.id === editingId ? { ...c, ...formData } : c))
        } else {
            const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
            setCategories([...categories, { id: newId, ...formData, count: 0 }])
        }
        setIsModalOpen(false)
    }

    const deleteCategory = (id) => {
        if (confirm("Hapus kategori ini?")) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    const handleTypeChange = (type) => {
        const icons = type === 'menu' ? menuIcons : tableIcons
        setFormData({ ...formData, type, icon: icons[0] })
    }

    return (
        <DashboardLayout>
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
                        <div>
                            <h2 className="text-xl font-bold text-dark">Manajemen Kategori</h2>
                            <p className="text-xs text-gray-500">Kelola kategori untuk Menu dan Meja</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primaryLight transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span className="hidden sm:inline">Tambah Kategori</span>
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scroll">
                    <div className="max-w-6xl mx-auto space-y-8 fade-in">

                        {/* Filter Type */}
                        <div className="flex gap-2 border-b border-gray-200 pb-1">
                            {['all', 'menu', 'table'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${filter === type
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-dark'
                                        }`}
                                >
                                    {type === 'all' ? 'Semua' : type === 'menu' ? 'Menu Makanan' : 'Meja'}
                                </button>
                            ))}
                        </div>

                        {/* Category Table */}
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Nama Kategori</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Jumlah Item</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredCategories.map(cat => (
                                        <tr key={cat.id} className={`hover:bg-gray-50 transition-colors group ${!cat.active ? 'opacity-50 bg-gray-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-primary shadow-sm">
                                                        <i className={`fa-solid ${cat.icon}`}></i>
                                                    </div>
                                                    <div className="font-bold text-dark text-sm">{cat.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {cat.type === 'menu' ? (
                                                    <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Menu</span>
                                                ) : (
                                                    <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Meja</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">{cat.count} Item</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative inline-block w-9 align-middle select-none">
                                                        <input
                                                            type="checkbox"
                                                            checked={cat.active}
                                                            onChange={() => toggleStatus(cat.id)}
                                                            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                                                        />
                                                        <label
                                                            onClick={() => toggleStatus(cat.id)}
                                                            className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${cat.active ? 'bg-primary' : 'bg-gray-300'}`}
                                                        ></label>
                                                    </div>
                                                    {cat.active ? (
                                                        <span className="text-green-600 font-bold text-xs">Aktif</span>
                                                    ) : (
                                                        <span className="text-gray-400 font-bold text-xs">Nonaktif</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => editCategory(cat)}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm"
                                                    >
                                                        <i className="fa-solid fa-pen text-xs"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(cat.id)}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm"
                                                    >
                                                        <i className="fa-solid fa-trash text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty State */}
                            {filteredCategories.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                        <i className="fa-solid fa-tags text-2xl"></i>
                                    </div>
                                    <h3 className="text-dark font-bold text-sm">Belum ada kategori</h3>
                                    <p className="text-gray-500 text-xs mt-1">Tambahkan kategori baru.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* === ADD/EDIT MODAL === */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-dark">{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scroll">

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipe Kategori <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="cat-type"
                                                value="menu"
                                                checked={formData.type === 'menu'}
                                                onChange={() => handleTypeChange('menu')}
                                                className="peer sr-only"
                                            />
                                            <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-secondary/20 peer-checked:text-primary transition-all">
                                                <i className="fa-solid fa-utensils mb-1"></i>
                                                <span className="text-xs font-bold">Menu Makanan</span>
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input
                                                type="radio"
                                                name="cat-type"
                                                value="table"
                                                checked={formData.type === 'table'}
                                                onChange={() => handleTypeChange('table')}
                                                className="peer sr-only"
                                            />
                                            <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-secondary/20 peer-checked:text-primary transition-all">
                                                <i className="fa-solid fa-chair mb-1"></i>
                                                <span className="text-xs font-bold">Meja / Area</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Kategori <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400"
                                        placeholder="Contoh: Makanan Berat / Indoor"
                                    />
                                </div>

                                {/* Icon Picker */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Ikon</label>
                                    <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto custom-scroll p-1">
                                        {(formData.type === 'menu' ? menuIcons : tableIcons).map(icon => (
                                            <div
                                                key={icon}
                                                onClick={() => setFormData({ ...formData, icon })}
                                                className={`w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors text-gray-500 ${formData.icon === icon ? 'bg-secondary border-primary text-primary' : ''
                                                    }`}
                                            >
                                                <i className={`fa-solid ${icon}`}></i>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-bold text-dark">Status Aktif</p>
                                        <p className="text-[10px] text-gray-400">Tampilkan di aplikasi</p>
                                    </div>
                                    <div className="relative inline-block w-10 align-middle select-none">
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                                        />
                                        <label
                                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                                            className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${formData.active ? 'bg-primary' : 'bg-gray-300'}`}
                                        ></label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={saveCategory}
                                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
