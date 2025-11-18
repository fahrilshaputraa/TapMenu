export function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your restaurant settings</p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Your Restaurant"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Tell customers about your restaurant"
              />
            </div>
          </div>
        </div>

        {/* Tax & Charges */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Tax & Charges</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Rate (%)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Charge (%)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-primary/90">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
