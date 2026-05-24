import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'Dashboard — Birthday Surprises',
  description: 'Manage all your birthday surprise projects.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">🎉 Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              All your birthday surprise projects in one place.
            </p>
          </div>
          <a
            href="/create"
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm hover:from-pink-600 hover:to-rose-500 shadow-md transition-all active:scale-95"
          >
            + New Surprise
          </a>
        </div>

        <DashboardClient />
      </div>
    </main>
  );
}
