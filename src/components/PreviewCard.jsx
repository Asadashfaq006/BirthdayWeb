'use client';

const THEME_CONFIG = {
  cute: {
    gradient: 'from-pink-400 to-rose-300',
    emoji: '🌸',
    headerText: 'text-white',
    bg: 'bg-white',
    statBg: 'bg-pink-50',
    statText: 'text-pink-600',
    statLabel: 'text-pink-400',
    welcomeBg: 'bg-gray-50',
    welcomeText: 'text-gray-700',
    welcomeLabel: 'text-gray-400',
    lockBg: 'bg-amber-50',
    lockText: 'text-amber-700',
    lockLabel: 'text-amber-600',
    badgeBg: 'from-pink-400 to-rose-300',
    dark: false,
  },
  romantic: {
    gradient: 'from-red-500 to-pink-400',
    emoji: '❤️',
    headerText: 'text-white',
    bg: 'bg-white',
    statBg: 'bg-red-50',
    statText: 'text-red-600',
    statLabel: 'text-red-400',
    welcomeBg: 'bg-gray-50',
    welcomeText: 'text-gray-700',
    welcomeLabel: 'text-gray-400',
    lockBg: 'bg-amber-50',
    lockText: 'text-amber-700',
    lockLabel: 'text-amber-600',
    badgeBg: 'from-red-500 to-pink-400',
    dark: false,
  },
  neon: {
    gradient: 'from-cyan-500 to-purple-500',
    emoji: '⚡',
    headerText: 'text-white',
    bg: 'bg-gray-900',
    statBg: 'bg-cyan-900/40',
    statText: 'text-cyan-300',
    statLabel: 'text-cyan-500',
    welcomeBg: 'bg-gray-800',
    welcomeText: 'text-gray-200',
    welcomeLabel: 'text-gray-500',
    lockBg: 'bg-yellow-900/30',
    lockText: 'text-yellow-300',
    lockLabel: 'text-yellow-400',
    badgeBg: 'from-cyan-500 to-purple-500',
    dark: true,
  },
  galaxy: {
    gradient: 'from-indigo-900 to-purple-900',
    emoji: '🌌',
    headerText: 'text-white',
    bg: 'bg-indigo-950',
    statBg: 'bg-indigo-800/50',
    statText: 'text-indigo-200',
    statLabel: 'text-indigo-400',
    welcomeBg: 'bg-indigo-900/50',
    welcomeText: 'text-indigo-100',
    welcomeLabel: 'text-indigo-400',
    lockBg: 'bg-purple-900/40',
    lockText: 'text-purple-200',
    lockLabel: 'text-purple-400',
    badgeBg: 'from-indigo-600 to-purple-600',
    dark: true,
  },
  cartoon: {
    gradient: 'from-yellow-400 to-orange-400',
    emoji: '🎨',
    headerText: 'text-white',
    bg: 'bg-white',
    statBg: 'bg-orange-50',
    statText: 'text-orange-600',
    statLabel: 'text-orange-400',
    welcomeBg: 'bg-gray-50',
    welcomeText: 'text-gray-700',
    welcomeLabel: 'text-gray-400',
    lockBg: 'bg-yellow-50',
    lockText: 'text-yellow-700',
    lockLabel: 'text-yellow-600',
    badgeBg: 'from-yellow-400 to-orange-400',
    dark: false,
  },
};

export default function PreviewCard({ formData, questions, memories }) {
  const theme = THEME_CONFIG[formData.theme] || THEME_CONFIG.cute;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="sticky top-20 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👁️</span>
        <h3 className="text-base font-bold text-gray-700">Live Preview</h3>
        <span className="ml-auto text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
          updates as you type
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200/50">
        {/* Theme header */}
        <div className={`bg-gradient-to-r ${theme.gradient} px-6 py-6 text-center relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />

          <div className="text-4xl mb-2 relative z-10">{theme.emoji}</div>
          <h2 className={`text-xl font-extrabold ${theme.headerText} drop-shadow relative z-10`}>
            {formData.birthdayPersonName || 'Birthday Person'}
            <span className="block text-base font-normal opacity-90 mt-0.5">
              &apos;s Birthday Surprise 🎉
            </span>
          </h2>

          {formData.birthdayDate && (
            <p className="text-white/80 text-xs mt-2 relative z-10">
              🎂 {formatDate(formData.birthdayDate)}
            </p>
          )}
        </div>

        {/* Body */}
        <div className={`p-4 space-y-3 ${theme.bg}`}>
          {/* Welcome message */}
          {formData.welcomeMessage ? (
            <div className={`rounded-xl p-3 ${theme.welcomeBg}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme.welcomeLabel}`}>
                Welcome Message
              </p>
              <p className={`text-sm leading-relaxed line-clamp-4 ${theme.welcomeText}`}>
                {formData.welcomeMessage}
              </p>
            </div>
          ) : (
            <div className={`rounded-xl p-3 ${theme.welcomeBg} border-2 border-dashed ${theme.dark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs text-center ${theme.welcomeLabel}`}>
                Welcome message will appear here
              </p>
            </div>
          )}

          {/* Theme badge */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${theme.badgeBg} shadow-sm`}
            >
              {theme.emoji} {formData.theme} theme
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`rounded-xl p-3 text-center ${theme.statBg}`}>
              <div className={`text-3xl font-extrabold ${theme.statText}`}>
                {questions.length}
              </div>
              <div className={`text-xs font-medium ${theme.statLabel}`}>
                {questions.length === 1 ? 'Question' : 'Questions'}
              </div>
            </div>
            <div className={`rounded-xl p-3 text-center ${theme.statBg}`}>
              <div className={`text-3xl font-extrabold ${theme.statText}`}>
                {memories.length}
              </div>
              <div className={`text-xs font-medium ${theme.statLabel}`}>
                {memories.length === 1 ? 'Memory' : 'Memories'}
              </div>
            </div>
          </div>

          {/* Lock indicator */}
          {formData.unlockQuestion && (
            <div className={`rounded-xl p-3 ${theme.lockBg}`}>
              <p className={`text-xs font-semibold ${theme.lockLabel} flex items-center gap-1`}>
                🔒 Password Protected
              </p>
              <p className={`text-xs mt-1 truncate ${theme.lockText}`}>
                {formData.unlockQuestion}
              </p>
            </div>
          )}

          {/* Music indicator */}
          {formData.musicUrl && (
            <div className={`rounded-xl p-2.5 flex items-center gap-2 ${theme.welcomeBg}`}>
              <span className="text-base">🎵</span>
              <p className={`text-xs truncate flex-1 ${theme.welcomeText}`}>
                Background music added
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
