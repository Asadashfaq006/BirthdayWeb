import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      emoji: '🧩',
      title: 'Fun Quizzes',
      desc: 'Create interactive quiz questions with moving wrong-answer buttons',
    },
    {
      emoji: '📸',
      title: 'Memory Gallery',
      desc: 'Collect and display precious shared memories with captions',
    },
    {
      emoji: '🎨',
      title: '5 Beautiful Themes',
      desc: 'Cute, Romantic, Neon, Galaxy, and Cartoon themes to choose from',
    },
    {
      emoji: '🔒',
      title: 'Password Protected',
      desc: 'Add a secret question so only the right person can unlock it',
    },
    {
      emoji: '🎵',
      title: 'Background Music',
      desc: 'Add a music URL to make the experience even more special',
    },
    {
      emoji: '🔗',
      title: 'Shareable Link',
      desc: 'Share a unique link for the birthday person to experience',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        <div className="text-8xl mb-6 animate-float">🎂</div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
          Birthday Surprise
          <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Creator
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-xl mb-10">
          Build magical, interactive birthday experiences your loved ones will never forget.
          Quizzes, memories, custom messages — all in one beautiful link.
        </p>

        <Link
          href="/create"
          className="btn-primary text-lg px-10 py-4 rounded-2xl shadow-xl"
        >
          ✨ Create a Birthday Surprise
        </Link>

        <p className="text-gray-400 text-sm mt-4">Free • No sign-up required • Share instantly</p>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
          Everything you need to create the perfect surprise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-4xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pb-16 px-4">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl max-w-xl mx-auto p-8 text-white shadow-xl">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Ready to make someone&apos;s day?</h3>
          <p className="text-white/80 mb-6 text-sm">
            Takes only a few minutes. The surprise lasts forever.
          </p>
          <Link
            href="/create"
            className="inline-block bg-white text-purple-600 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors shadow-md"
          >
            Start Creating →
          </Link>
        </div>
      </div>
    </main>
  );
}
