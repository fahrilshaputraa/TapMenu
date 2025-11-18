import { useParams } from 'react-router-dom';
import { Clock, CheckCircle2, ChefHat, Bell } from 'lucide-react';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'ready', label: 'Ready', icon: Bell },
];

export function OrderTrackPage() {
  const { uuid } = useParams();

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-900">Order Status</h1>
        <p className="text-sm text-gray-500">Order #{uuid?.slice(0, 8)}</p>
      </div>

      {/* Status Timeline */}
      <div className="mb-8">
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs text-gray-500">{step.label}</span>
              {index < statusSteps.length - 1 && (
                <div className="absolute left-0 top-5 -z-10 h-0.5 w-full bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 font-medium">Order Items</h2>
        <div className="text-center text-gray-500">
          <p>Loading order details...</p>
        </div>
      </div>
    </div>
  );
}
