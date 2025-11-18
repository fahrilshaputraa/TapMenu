import { Plus, UserPlus } from 'lucide-react';

export function StaffPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="text-gray-600">Manage your team members</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          Invite Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm font-medium text-gray-500">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                <UserPlus className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2">No staff members yet</p>
                <button className="mt-2 text-sm font-medium text-primary hover:underline">
                  Invite your first team member
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
