import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'

export function Settings() {
  // --- STATE ---
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState({
    sound: true,
    popup: true
  })
  const [printer, setPrinter] = useState({
    paperSize: '58mm',
    autoPrint: false
  })
  const [payment, setPayment] = useState({
    cash: true,
    gateway: {
      active: false,
      provider: 'midtrans',
      mode: 'sandbox',
      clientKey: '',
      serverKey: ''
    },
    manual: [
      { id: 1, bank: 'Bank BCA', account: '123-456-7890 a.n Budi Santoso', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' }
    ]
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [pgConfigOpen, setPgConfigOpen] = useState(false)

  // --- EFFECTS ---
  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', systemDark)
    }
  }, [])

  // --- LOGIC ---
  const toggleTheme = (mode) => {
    setTheme(mode)
    localStorage.setItem('theme', mode)
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }, 1000)
  }

  const togglePgConfig = () => {
    setPgConfigOpen(!pgConfigOpen)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F7F5F2] dark:bg-gray-900 transition-colors duration-300">

        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 border-b border-gray-200 flex justify-between items-center shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary text-xl"><i className="fa-solid fa-bars"></i></button>
            <div>
              <h2 className="text-2xl font-bold text-dark tracking-tight">Pengaturan Sistem</h2>
              <p className="text-xs text-gray-500 font-medium">Kelola metode pembayaran dan preferensi sistem</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`group relative px-6 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 overflow-hidden ${saveSuccess ? 'bg-green-600' : 'bg-primary hover:bg-primaryLight hover:shadow-glow'
              } ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSaving ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
              ) : saveSuccess ? (
                <><i className="fa-solid fa-check"></i> Tersimpan</>
              ) : (
                <><i className="fa-solid fa-check"></i> Simpan</>
              )}
            </span>
            {!saveSuccess && !isSaving && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            )}
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scroll">
          <div className="max-w-6xl mx-auto space-y-8 fade-in">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT COLUMN: General Settings */}
              <div className="lg:col-span-1 space-y-8">

                {/* Appearance Card */}
                <section>
                  <div className="section-title">Tampilan & Preferensi</div>
                  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-card">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg dark:bg-purple-900/30 dark:text-purple-400">
                            <i className="fa-solid fa-moon"></i>
                          </div>
                          <div>
                            <h4 className="font-bold text-dark text-sm">Mode Gelap</h4>
                            <p className="text-[10px] text-gray-500">Nyaman untuk mata</p>
                          </div>
                        </div>
                        {/* Theme Toggle UI */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => toggleTheme('light')}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-all ${theme === 'light'
                                ? 'bg-white shadow-sm text-yellow-500'
                                : 'text-gray-400 hover:text-white'
                              }`}
                          >
                            <i className="fa-solid fa-sun"></i>
                          </button>
                          <button
                            onClick={() => toggleTheme('dark')}
                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-all ${theme === 'dark'
                                ? 'bg-gray-600 shadow-sm text-white'
                                : 'text-gray-400 hover:text-gray-600'
                              }`}
                          >
                            <i className="fa-solid fa-moon"></i>
                          </button>
                        </div>
                      </div>

                      <hr className="border-gray-100 dark:border-gray-700 my-4" />

                      <div className="space-y-5">
                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-volume-high text-gray-400 w-5 text-center"></i>
                            <span className="text-sm font-medium text-dark">Suara Notifikasi</span>
                          </div>
                          <div className="relative inline-block w-9 align-middle select-none">
                            <input
                              type="checkbox"
                              checked={notifications.sound}
                              onChange={(e) => setNotifications({ ...notifications, sound: e.target.checked })}
                              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                            />
                            <label
                              onClick={() => setNotifications({ ...notifications, sound: !notifications.sound })}
                              className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${notifications.sound ? 'bg-primary' : 'bg-gray-300'}`}
                            ></label>
                          </div>
                        </div>

                        {/* Popup Toggle */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-window-restore text-gray-400 w-5 text-center"></i>
                            <span className="text-sm font-medium text-dark">Popup Pesanan</span>
                          </div>
                          <div className="relative inline-block w-9 align-middle select-none">
                            <input
                              type="checkbox"
                              checked={notifications.popup}
                              onChange={(e) => setNotifications({ ...notifications, popup: e.target.checked })}
                              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                            />
                            <label
                              onClick={() => setNotifications({ ...notifications, popup: !notifications.popup })}
                              className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${notifications.popup ? 'bg-primary' : 'bg-gray-300'}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Printer Card */}
                <section>
                  <div className="section-title">Perangkat Keras</div>
                  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all hover:shadow-card">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center text-lg dark:bg-gray-800 dark:text-gray-300">
                          <i className="fa-solid fa-print"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-sm">Printer Struk</h4>
                          <p className="text-[10px] text-gray-500">Pengaturan kertas & auto-print</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ukuran Kertas</label>
                          <div className="grid grid-cols-2 gap-3">
                            <label className="cursor-pointer relative">
                              <input
                                type="radio"
                                name="paper-size"
                                className="peer sr-only"
                                checked={printer.paperSize === '58mm'}
                                onChange={() => setPrinter({ ...printer, paperSize: '58mm' })}
                              />
                              <div className="p-2 border border-gray-200 rounded-lg text-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                                <span className="text-xs font-bold">58mm</span>
                              </div>
                            </label>
                            <label className="cursor-pointer relative">
                              <input
                                type="radio"
                                name="paper-size"
                                className="peer sr-only"
                                checked={printer.paperSize === '80mm'}
                                onChange={() => setPrinter({ ...printer, paperSize: '80mm' })}
                              />
                              <div className="p-2 border border-gray-200 rounded-lg text-center hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">
                                <span className="text-xs font-bold">80mm</span>
                              </div>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm font-medium text-dark">Auto Print</span>
                          <div className="relative inline-block w-9 align-middle select-none">
                            <input
                              type="checkbox"
                              checked={printer.autoPrint}
                              onChange={(e) => setPrinter({ ...printer, autoPrint: e.target.checked })}
                              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                            />
                            <label
                              onClick={() => setPrinter({ ...printer, autoPrint: !printer.autoPrint })}
                              className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-300 ${printer.autoPrint ? 'bg-primary' : 'bg-gray-300'}`}
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

              {/* RIGHT COLUMN: Payment Methods */}
              <div className="lg:col-span-2 space-y-6">
                <div className="section-title">Metode Pembayaran</div>

                {/* Cash Card */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform dark:bg-green-900/30 dark:text-green-400">
                      <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-lg">Tunai (Cash)</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Terima pembayaran uang tunai di kasir.</p>
                    </div>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input
                      type="checkbox"
                      checked={payment.cash}
                      onChange={(e) => setPayment({ ...payment, cash: e.target.checked })}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                    />
                    <label
                      onClick={() => setPayment({ ...payment, cash: !payment.cash })}
                      className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${payment.cash ? 'bg-primary' : 'bg-gray-300'}`}
                    ></label>
                  </div>
                </div>

                {/* Payment Gateway Card */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all group">
                  <div
                    className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50/50"
                    onClick={togglePgConfig}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform dark:bg-blue-900/30 dark:text-blue-400">
                        <i className="fa-solid fa-credit-card"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-dark text-lg">Payment Gateway</h4>
                          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Otomatis</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">QRIS, E-Wallet, Virtual Account.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative inline-block w-12 align-middle select-none" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={payment.gateway.active}
                          onChange={(e) => setPayment({ ...payment, gateway: { ...payment.gateway, active: e.target.checked } })}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 left-0 border-gray-300 checked:right-0 checked:border-primary"
                        />
                        <label
                          onClick={() => setPayment({ ...payment, gateway: { ...payment.gateway, active: !payment.gateway.active } })}
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ${payment.gateway.active ? 'bg-primary' : 'bg-gray-300'}`}
                        ></label>
                      </div>
                      <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform ${pgConfigOpen ? 'rotate-180' : ''}`}></i>
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {pgConfigOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:bg-gray-800/30 fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Provider</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['midtrans', 'xendit', 'duitku'].map(provider => (
                              <label key={provider} className="cursor-pointer">
                                <input
                                  type="radio"
                                  name="pg-provider"
                                  className="peer sr-only"
                                  checked={payment.gateway.provider === provider}
                                  onChange={() => setPayment({ ...payment, gateway: { ...payment.gateway, provider } })}
                                />
                                <div className="border border-gray-200 bg-white rounded-xl p-3 flex items-center justify-center hover:border-primary peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all capitalize">
                                  <span className="font-bold text-dark text-sm">{provider}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mode Lingkungan</label>
                          <select
                            value={payment.gateway.mode}
                            onChange={(e) => setPayment({ ...payment, gateway: { ...payment.gateway, mode: e.target.value } })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                          >
                            <option value="sandbox">Sandbox (Testing)</option>
                            <option value="production">Production (Live)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Client Key</label>
                          <input
                            type="text"
                            value={payment.gateway.clientKey}
                            onChange={(e) => setPayment({ ...payment, gateway: { ...payment.gateway, clientKey: e.target.value } })}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                            placeholder="SB-Mid-client-..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Server Key</label>
                          <div className="relative">
                            <input
                              type="password"
                              value={payment.gateway.serverKey}
                              onChange={(e) => setPayment({ ...payment, gateway: { ...payment.gateway, serverKey: e.target.value } })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary dark:bg-gray-800 dark:border-gray-700"
                              placeholder="SB-Mid-server-..."
                            />
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark">
                              <i className="fa-regular fa-eye"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Transfer Card */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl shadow-sm dark:bg-orange-900/30 dark:text-orange-400">
                        <i className="fa-solid fa-building-columns"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-dark text-lg">Transfer Bank Manual</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Pelanggan kirim bukti transfer manual.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors border border-primary/20">
                      + Tambah
                    </button>
                  </div>

                  <div className="space-y-3">
                    {payment.manual.map(bank => (
                      <div key={bank.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/30 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 p-1">
                            <img src={bank.icon} className="w-full h-auto object-contain" alt={bank.bank} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-dark">{bank.bank}</p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{bank.account}</p>
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                    <i className="fa-solid fa-trash-can"></i> Reset Pengaturan Pabrik
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
