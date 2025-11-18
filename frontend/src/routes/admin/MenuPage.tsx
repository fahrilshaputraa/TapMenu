import { Plus } from 'lucide-react';

export function MenuPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-600">Manage your categories and products</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
            All
          </button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50">
            + Add Category
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No products yet</p>
          <button className="mt-2 text-sm font-medium text-primary hover:underline">
            Add your first product
          </button>
        </div>
      </div>
    </div>
  );
}
