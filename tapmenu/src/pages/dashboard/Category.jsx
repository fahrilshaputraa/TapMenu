import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Modal } from '../../components/Modal'
import { Table } from '../../components/Table'

export function Category() {
    // --- DATA ---
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

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
    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories/')
            if (response.ok) {
                const data = await response.json()
                const mappedCategories = (data.results || data).map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    type: cat.type,
                    icon: cat.icon || 'fa-utensils',
                    count: cat.count || 0,
                    active: cat.is_active
                }))
                setCategories(mappedCategories)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCategories = categories.filter(c => filter === 'all' || c.type === filter)

    const toggleStatus = async (id) => {
        const category = categories.find(c => c.id === id)
        if (!category) return

        const newStatus = !category.active

        // Optimistic update
        setCategories(categories.map(c => c.id === id ? { ...c, active: newStatus } : c))

        try {
            const response = await fetch(`/api/categories/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: newStatus })
            })

            if (!response.ok) {
                // Revert if failed
                setCategories(categories.map(c => c.id === id ? { ...c, active: !newStatus } : c))
                alert("Gagal mengubah status")
            }
        } catch (error) {
            setCategories(categories.map(c => c.id === id ? { ...c, active: !newStatus } : c))
            console.error('Error updating status:', error)
        }
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

    const saveCategory = async () => {
        if (!formData.name) {
            alert("Nama kategori wajib diisi!")
            return
        }

        const payload = {
            name: formData.name,
            type: formData.type,
            icon: formData.icon,
            is_active: formData.active,
            restaurant: 1 // Hardcoded for now
        }

        try {
            let response
            if (editingId) {
                response = await fetch(`/api/categories/${editingId}/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            } else {
                response = await fetch('/api/categories/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            }

            if (response.ok) {
                fetchCategories()
                setIsModalOpen(false)
            } else {
                const errData = await response.json()
                alert("Gagal menyimpan kategori: " + JSON.stringify(errData))
            }
        } catch (error) {
            console.error('Error saving category:', error)
            alert("Terjadi kesalahan saat menyimpan kategori")
        }
    }

    const deleteCategory = async (id) => {
        if (confirm("Hapus kategori ini?")) {
            try {
                const response = await fetch(`/api/categories/${id}/`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    setCategories(categories.filter(c => c.id !== id))
                } else {
                    alert("Gagal menghapus kategori")
                }
            } catch (error) {
                console.error('Error deleting category:', error)
                alert("Terjadi kesalahan saat menghapus kategori")
            }
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
                        {loading ? (
                            <div className="text-center py-20 text-gray-500">Loading categories...</div>
                        ) : (
                            <Table
                                columns={[
                                    {
                                        header: 'Nama Kategori',
                                        className: 'w-1/3',
                                        accessor: (cat) => (
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-primary shadow-sm">
                                                    <i className={`fa-solid ${cat.icon}`}></i>
                                                </div>
                                                <div className="font-bold text-dark text-sm">{cat.name}</div>
                                            </div>
                                        )
                                    },
                                    {
                                        header: 'Tipe',
                                        accessor: (cat) => cat.type === 'menu' ? (
                                            <span className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Menu</span>
                                        ) : (
                                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Meja</span>
                                        )
                                    },
                                    {
                                        header: 'Jumlah Item',
                                        accessor: (cat) => (
                                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-gray-200">{cat.count} Item</span>
                                        )
                                    },
                                    {
                                        header: 'Status',
                                        accessor: (cat) => (
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
                                        )
                                    },
                                    {
                                        header: 'Aksi',
                                        className: 'text-right',
                                        cellClassName: 'text-right',
                                        accessor: (cat) => (
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
                                        )
                                    }
                                ]}
                                data={filteredCategories.map(cat => ({
                                    ...cat,
                                    _rowClass: !cat.active ? 'opacity-50 bg-gray-50' : ''
                                }))}
                                emptyState={
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                            <i className="fa-solid fa-tags text-2xl"></i>
                                        </div>
                                        <h3 className="text-dark font-bold text-sm">Belum ada kategori</h3>
                                        <p className="text-gray-500 text-xs mt-1">Tambahkan kategori baru.</p>
                                    </div>
                                }
                            />
                        )}

                    </div>
                </div>

                {/* === ADD/EDIT MODAL === */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingId ? 'Edit Kategori' : 'Tambah Kategori'}
                    size="md"
                >
                    <div className="space-y-5">

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

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                             <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={saveCategory}
                                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>

                </Modal>
            </div>
        </DashboardLayout>
    )
}
