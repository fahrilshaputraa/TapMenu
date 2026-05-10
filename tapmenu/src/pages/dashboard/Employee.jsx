import { useEffect, useMemo, useState } from 'react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { Table } from '../../components/Table'
import { api } from '../../services/api'
import { getRoleLabel } from '../../services/auth'

const ROLE_OPTIONS = [
  { label: 'Manager', value: 2 },
  { label: 'Cashier', value: 3 },
  { label: 'Kitchen', value: 4 },
]

function getAvatarUrl(employee) {
  return `https://i.pravatar.cc/150?u=${employee.email || employee.id}`
}

export function Employee() {
  const [employees, setEmployees] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showPin, setShowPin] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 3,
    pin_code: '',
    password: '',
    is_active: true,
  })

  useEffect(() => {
    let active = true

    async function loadEmployees() {
      try {
        const payload = await api.get('/api/v1/auth/employees/')
        const results = Array.isArray(payload?.results) ? payload.results : payload
        if (active) setEmployees(results || [])
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadEmployees()
    return () => {
      active = false
    }
  }, [])

  const filteredEmployees = useMemo(() => {
    const keyword = searchQuery.toLowerCase()
    return employees.filter((employee) => {
      return (
        String(employee.full_name || '').toLowerCase().includes(keyword) ||
        String(employee.email || '').toLowerCase().includes(keyword) ||
        String(employee.employee_code || '').toLowerCase().includes(keyword)
      )
    })
  }, [employees, searchQuery])

  const activeCount = employees.filter((employee) => employee.is_active).length

  const handleOpenModal = (employee = null) => {
    setError('')
    setEditingEmployee(employee)
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        role: employee.role || 3,
        pin_code: '',
        password: '',
        is_active: employee.is_active,
      })
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        role: 3,
        pin_code: '',
        password: '',
        is_active: true,
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.full_name || !formData.email) {
      setError('Nama lengkap dan email wajib diisi.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone_number: formData.phone_number,
      role: Number(formData.role),
      is_active: formData.is_active,
      ...(formData.pin_code ? { pin_code: formData.pin_code } : {}),
      ...(formData.password ? { password: formData.password } : {}),
    }

    try {
      if (editingEmployee) {
        const updated = await api.patch(`/api/v1/auth/employees/${editingEmployee.id}/`, payload)
        setEmployees((current) => current.map((employee) => (employee.id === editingEmployee.id ? updated : employee)))
      } else {
        const created = await api.post('/api/v1/auth/employees/', payload)
        setEmployees((current) => [created, ...current])
      }
      setShowModal(false)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteEmployee = async (id) => {
    if (!window.confirm('Hapus karyawan ini?')) return

    try {
      await api.delete(`/api/v1/auth/employees/${id}/`)
      setEmployees((current) => current.filter((employee) => employee.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const toggleStatus = async (employee) => {
    try {
      const updated = await api.patch(`/api/v1/auth/employees/${employee.id}/`, { is_active: !employee.is_active })
      setEmployees((current) => current.map((item) => (item.id === employee.id ? updated : item)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const togglePinVisibility = (id) => {
    setShowPin((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center -mt-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-dark">Manajemen Karyawan</h2>
            <p className="text-xs text-gray-500">Kelola akses dan PIN login tim Anda</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primaryLight transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span className="hidden sm:inline">Tambah Karyawan</span>
          </button>
        </div>

        {error ? <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
          <div className="flex items-center gap-8 w-full md:w-auto pl-2">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Karyawan</p>
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
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama karyawan..."
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
            />
          </div>
        </div>

        <Table
          columns={[
            {
              header: 'Karyawan',
              className: 'w-1/3',
              accessor: (employee) => (
                <div className="flex items-center gap-4">
                  <img src={getAvatarUrl(employee)} alt={employee.full_name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <div className="font-bold text-dark text-sm">{employee.full_name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-0.5 text-primary/80">{getRoleLabel(employee.role)}</div>
                  </div>
                </div>
              ),
            },
            {
              header: 'ID Pegawai',
              accessor: (employee) => <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200">{employee.employee_code || '-'}</span>,
            },
            {
              header: 'PIN Akses',
              accessor: (employee) => (
                <div className="flex items-center gap-3 group/pin">
                  <span className="font-mono font-bold text-dark text-sm tracking-[0.2em]">{showPin[employee.id] ? employee.pin_code || '------' : '******'}</span>
                  <button onClick={() => togglePinVisibility(employee.id)} className="text-gray-300 hover:text-primary transition-colors" title="Lihat PIN">
                    <i className={`fa-regular ${showPin[employee.id] ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                  </button>
                </div>
              ),
            },
            {
              header: 'Status Login',
              accessor: (employee) => (
                <div className="flex items-center gap-3">
                  <div className="relative inline-block w-9 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={employee.is_active}
                      onChange={() => toggleStatus(employee)}
                      className="peer absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                    />
                    <label onClick={() => toggleStatus(employee)} className="block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 peer-checked:bg-primary"></label>
                  </div>
                  {employee.is_active ? <span className="text-green-600 font-bold text-xs">Aktif</span> : <span className="text-gray-400 font-bold text-xs">Nonaktif</span>}
                </div>
              ),
            },
            {
              header: 'Aksi',
              className: 'text-right',
              cellClassName: 'text-right',
              accessor: (employee) => (
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(employee)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary hover:bg-white transition-all flex items-center justify-center bg-white shadow-sm">
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button onClick={() => deleteEmployee(employee.id)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center bg-white shadow-sm">
                    <i className="fa-solid fa-trash text-xs"></i>
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredEmployees.map((employee) => ({ ...employee, _rowClass: !employee.is_active ? 'opacity-50 bg-gray-50' : '' }))}
          isLoading={loading}
          emptyState={
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                <i className="fa-solid fa-user-slash text-2xl"></i>
              </div>
              <h3 className="text-dark font-bold text-sm">Tidak ditemukan</h3>
              <p className="text-gray-400 text-xs mt-1">Coba kata kunci lain atau tambah karyawan baru.</p>
            </div>
          }
        />

        {showModal ? (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h3 className="font-bold text-xl text-dark">{editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input type="text" value={formData.full_name} onChange={(event) => setFormData({ ...formData, full_name: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400" placeholder="Nama Karyawan" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400" placeholder="email@contoh.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nomor HP</label>
                    <input type="text" value={formData.phone_number} onChange={(event) => setFormData({ ...formData, phone_number: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark placeholder-gray-400" placeholder="08xxxxxxxxxx" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Role</label>
                    <select value={formData.role} onChange={(event) => setFormData({ ...formData, role: Number(event.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium text-dark">
                      {ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">PIN Akses</label>
                    <input type="text" value={formData.pin_code} onChange={(event) => setFormData({ ...formData, pin_code: event.target.value })} maxLength="6" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium tracking-widest font-mono placeholder-gray-400" placeholder={editingEmployee ? 'Kosongkan jika tidak diubah' : '000000'} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Password</label>
                    <input type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-medium placeholder-gray-400" placeholder={editingEmployee ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'} />
                  </div>

                  <label className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 cursor-pointer">
                    <div>
                      <p className="text-sm font-bold text-dark">Status Aktif</p>
                      <p className="text-[10px] text-gray-400">Bisa login ke sistem</p>
                    </div>
                    <input type="checkbox" checked={formData.is_active} onChange={(event) => setFormData({ ...formData, is_active: event.target.checked })} />
                  </label>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors">Batal</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primaryLight transition-colors disabled:opacity-70">{saving ? 'Menyimpan...' : 'Simpan Data'}</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  )
}
