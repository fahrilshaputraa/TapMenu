import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'

import { DashboardLayout } from '../../components/DashboardLayout'
import { createTable, loadTable, updateTable } from '../../services/tables'
import {
  buildTableOrderUrl,
  buildTablePayload,
  createDefaultTableFormData,
  createTableFormData,
} from '../../utils/tables'

export function TableForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [formData, setFormData] = useState(createDefaultTableFormData())
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [publicToken, setPublicToken] = useState('')

  useEffect(() => {
    if (!isEdit) {
      setFormData(createDefaultTableFormData())
      setLoading(false)
      return
    }

    let active = true
    async function fetchTable() {
      try {
        const payload = await loadTable(id)
        if (!active) return
        setFormData(createTableFormData(payload))
        setPublicToken(payload.public_token || '')
        setError('')
      } catch (requestError) {
        if (active) setError(requestError.message || 'Gagal memuat data meja.')
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchTable()
    return () => {
      active = false
    }
  }, [id, isEdit])

  const qrData = isEdit
    ? buildTableOrderUrl(window.location.origin, publicToken)
    : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = buildTablePayload(formData)

      if (isEdit) {
        await updateTable(id, payload)
      } else {
        await createTable(payload)
      }
      navigate('/dashboard/tables', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Gagal menyimpan meja.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/tables"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isEdit ? 'Edit Meja' : 'Tambah Meja'}
            </h1>
            <p className="text-sm text-zinc-600">
              {isEdit ? 'Perbarui informasi meja yang sudah ada.' : 'Buat meja baru untuk kebutuhan QR ordering.'}
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            Memuat data meja...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                Informasi Meja
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Nama Meja <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Meja 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Kode Meja <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="T01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleChange('area', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Indoor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Kapasitas Kursi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => handleChange('seats', e.target.value)}
                    required
                    min="1"
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="4"
                  />
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-600">Meja aktif</span>
                </label>
              </div>
            </div>

            {isEdit ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4">
                  QR Access
                </h2>

                <div className="space-y-3">
                  <div className="rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs font-mono text-zinc-600 break-all">
                    {qrData}
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open(qrData, '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Buka Link Meja
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/tables"
                className="flex-1 px-4 py-2.5 text-sm font-medium text-center text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-70"
              >
                {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Meja'}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
