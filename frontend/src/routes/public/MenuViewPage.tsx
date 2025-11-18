import { useParams } from 'react-router-dom';

export function MenuViewPage() {
  const { restaurantSlug } = useParams();

  return (
    <div className="p-4">
      {/* Restaurant Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Restaurant Menu</h1>
        <p className="text-sm text-gray-500">Slug: {restaurantSlug}</p>
      </div>

      {/* Categories */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
          All
        </button>
        <button className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
          Food
        </button>
        <button className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
          Drinks
        </button>
      </div>

      {/* Products */}
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </div>
    </div>
  );
}
