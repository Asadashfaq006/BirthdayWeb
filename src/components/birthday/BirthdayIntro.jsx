'use client';

import { motion } from 'framer-motion';

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

export default function BirthdayIntro({ project, theme, onStart }) {
  const formattedDate = formatDate(project.birthday_date);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
      <div className="w-full max-w-lg text-center">
        {/* Animated cake */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 14, delay: 0.1 }}
          className="text-8xl mb-6 inline-block"
        >
          {theme.cakeEmoji}
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${theme.subtext}`}>
            A surprise for
          </p>
          <h1
            className={`text-5xl sm:text-6xl ${theme.heading} leading-tight`}
          >
            {project.birthday_person_name}
          </h1>
          <p className={`text-2xl font-bold ${theme.subtext} mt-1`}>🎉</p>
        </motion.div>

        {/* Date badge */}
        {formattedDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className={`inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold ${theme.badgeBg}`}
          >
            🎂 {formattedDate}
          </motion.div>
        )}

        {/* Welcome message card */}
        {project.welcome_message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className={`mt-6 ${theme.card} p-6 text-left relative overflow-hidden`}
          >
            {/* Decorative corner */}
            <div
              className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${theme.cardHeaderGrad} opacity-10 rounded-bl-3xl`}
            />
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${theme.subtext}`}>
              A message for you ✉️
            </p>
            <p className={`text-base leading-relaxed ${theme.text}`}>
              {project.welcome_message}
            </p>
          </motion.div>
        )}

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStart}
          className={`mt-8 px-10 py-4 text-lg ${theme.btnPrimary} shadow-xl`}
        >
          🎉 Start the Surprise!
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className={`mt-4 text-xs ${theme.subtext} opacity-70`}
        >
          {project.music_url
            ? 'Music will start playing when you click above 🎵'
            : 'Get ready for something special ✨'}
        </motion.p>
      </div>
    </div>
  );
}
