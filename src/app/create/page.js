import CreateSurpriseForm from '@/components/CreateSurpriseForm';

export const metadata = {
  title: 'Create Birthday Surprise',
  description: 'Fill out the form to create a magical interactive birthday surprise',
};

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 pb-16">
      {/* Top bar */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
            <span className="text-xl">🎂</span>
            <span className="font-bold text-sm hidden sm:block">Birthday Surprise Creator</span>
          </a>
          <p className="text-xs text-gray-400">Fill out the form below to get your shareable link</p>
        </div>
      </div>

      <CreateSurpriseForm />
    </main>
  );
}
