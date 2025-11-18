import { QrCode } from 'lucide-react';

export function ScanPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-4">
      <div className="text-center">
        <QrCode className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Welcome to TapMenu
        </h1>
        <p className="mt-2 text-gray-600">
          Scan the QR code on your table to view the menu and order
        </p>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8">
          <div className="text-center text-gray-500">
            <p>QR Scanner will appear here</p>
            <p className="mt-1 text-sm">
              Allow camera access to scan QR codes
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Or enter restaurant slug manually
        </p>

        <div className="mt-2 flex gap-2">
          <input
            type="text"
            placeholder="restaurant-slug"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2"
          />
          <button className="rounded-lg bg-primary px-4 py-2 font-medium text-white">
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
