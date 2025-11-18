import { Plus, QrCode } from 'lucide-react';

export function TablesPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="text-gray-600">Manage tables and QR codes</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Table
        </button>
      </div>

      {/* Table Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No tables yet</p>
          <button className="mt-2 text-sm font-medium text-primary hover:underline">
            Add your first table
          </button>
        </div>
      </div>
    </div>
  );
}
