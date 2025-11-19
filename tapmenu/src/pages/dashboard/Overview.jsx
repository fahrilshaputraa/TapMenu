import { Link } from 'react-router-dom'
import { Search, Filter, Eye, Check, X } from 'lucide-react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function DashboardOverview() {
  return (
    <DashboardLayout>
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Omzet Hari Ini</p>
              <h3 className="text-2xl font-bold text-dark">Rp 1.250.000</h3>
            </div>
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-primary">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i> 12%
            </span>
            <span className="text-gray-400">vs kemarin</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-accent relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Pesanan Masuk</p>
              <h3 className="text-2xl font-bold text-dark">45 Pesanan</h3>
            </div>
            <div className="w-10 h-10 bg-[#FFF0EB] rounded-lg flex items-center justify-center text-accent">
              <i className="fa-solid fa-receipt"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-accent font-bold">3 Pesanan</span>
            <span className="text-gray-400">Belum diproses</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Menu Terjual</p>
              <h3 className="text-2xl font-bold text-dark">128 Item</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-bowl-food"></i>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500"><span className="font-bold text-dark">Ayam Geprek</span> paling laris</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Recent Orders (Takes 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-dark">Pesanan Terbaru</h3>
            <Link to="/dashboard/orders" className="text-sm text-primary font-bold hover:underline">Lihat Semua</Link>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100">
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-semibold">ID Pesanan</th>
                    <th className="p-4 font-semibold">Menu</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {/* Row 1 */}
                  <tr className="hover:bg-[#F7F5F2] transition-colors group">
                    <td className="p-4 font-medium text-primary">#ORD-0092</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark">Meja 4</span>
                        <span className="text-xs text-gray-500">2x Ayam Bakar, 2x Es Teh</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-dark">Rp 48.000</td>
                    <td className="p-4">
                      <span className="bg-[#FFF0EB] text-accent px-2.5 py-1 rounded-full text-xs font-bold">Baru</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors" title="Terima">
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Tolak">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[#F7F5F2] transition-colors group">
                    <td className="p-4 font-medium text-gray-500">#ORD-0091</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark">Bungkus (Dani)</span>
                        <span className="text-xs text-gray-500">1x Nasi Goreng Spesial</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-dark">Rp 25.000</td>
                    <td className="p-4">
                      <span className="bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-xs font-bold">Dimasak</span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-primary transition-colors text-xs font-bold border border-gray-200 px-3 py-1 rounded-lg hover:border-primary">
                        Detail
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-[#F7F5F2] transition-colors group">
                    <td className="p-4 font-medium text-gray-500">#ORD-0090</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark">Meja 2</span>
                        <span className="text-xs text-gray-500">3x Kopi Susu Gula Aren</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-dark">Rp 54.000</td>
                    <td className="p-4">
                      <span className="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-xs font-bold">Selesai</span>
                    </td>
                    <td className="p-4 text-center">
                      <i className="fa-solid fa-check-double text-green-600 text-xs"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 text-center">
              <Link to="/dashboard/orders" className="text-sm text-gray-500 hover:text-primary font-medium transition-colors">
                Lihat semua pesanan hari ini <i className="fa-solid fa-chevron-right text-xs ml-1"></i>
              </Link>
            </div>
          </div>

          {/* Analytics Chart Placeholder */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <h3 className="text-lg font-bold text-dark mb-4">Grafik Penjualan (Minggu Ini)</h3>
            <div className="relative h-48 w-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
              {/* Simple CSS Chart Representation */}
              <div className="flex items-end gap-3 h-32 px-6 w-full justify-between">
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[40%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Mon</span>
                </div>
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[60%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Tue</span>
                </div>
                <div className="w-full bg-primary rounded-t-md hover:bg-primaryLight transition-colors h-[80%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Wed</span>
                </div>
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[50%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Thu</span>
                </div>
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[70%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Fri</span>
                </div>
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[90%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Sat</span>
                </div>
                <div className="w-full bg-secondary rounded-t-md hover:bg-primary transition-colors h-[75%] relative group">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Sun</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Menu (Takes 1 col) */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
            <h3 className="font-bold text-lg mb-4 relative z-10">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <Link to="/dashboard/menu/add" className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                <i className="fa-solid fa-plus-circle text-xl text-secondary"></i>
                <span className="text-xs font-semibold">Tambah Menu</span>
              </Link>
              <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                <i className="fa-solid fa-print text-xl text-secondary"></i>
                <span className="text-xs font-semibold">Cetak QR</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                <i className="fa-solid fa-file-invoice text-xl text-secondary"></i>
                <span className="text-xs font-semibold">Buat Tagihan</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-colors backdrop-blur-sm">
                <i className="fa-solid fa-store-slash text-xl text-secondary"></i>
                <span className="text-xs font-semibold">Tutup Toko</span>
              </button>
            </div>
          </div>

          {/* Top Menu Items */}
          <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-dark">Stok Menipis</h3>
              <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=60" className="w-full h-full object-cover" alt="Nasi Putih" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">Nasi Putih</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-red-500">Sisa 5</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&w=100&q=60" className="w-full h-full object-cover" alt="Es Jeruk" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">Es Jeruk</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <span className="text-xs font-bold text-yellow-600">Sisa 12</span>
              </div>
            </div>
            <Link to="/dashboard/menu" className="block w-full mt-4 py-2 text-center text-xs font-bold text-primary bg-secondary/30 hover:bg-secondary rounded-lg transition-colors">
              Kelola Stok
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Dashboard */}
      <div className="text-center text-xs text-gray-400 pt-8 pb-4">
        TapMenu Dashboard v1.0 &bull; <a href="#" className="hover:text-primary">Bantuan</a> &bull; <a href="#" className="hover:text-primary">Laporkan Masalah</a>
      </div>
    </DashboardLayout>
  )
}
