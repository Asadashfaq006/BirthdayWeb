'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FUNNY_WRONG = [
  "Hmm... that's not it! 🤔 Try again!",
  "Nope! The secret stays secret! 🙈",
  "Almost! (Just kidding, not even close 😂)",
  "Wrong password! Nice try though! 🕵️",
  "Incorrect! Are you really who I think you are? 😏",
  "Oops! Think harder! 💭",
];

export default function UnlockScreen({ project, theme, onUnlocked }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsChecking(true);

    const correct = project.unlock_answer?.trim().toLowerCase();
    const given = answer.trim().toLowerCase();

    setTimeout(() => {
      setIsChecking(false);
      if (given === correct) {
        onUnlocked();
      } else {
        const msg = FUNNY_WRONG[Math.floor(Math.random() * FUNNY_WRONG.length)];
        setError(msg);
        setShakeKey((k) => k + 1);
        setAnswer('');
      }
    }, 600);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${theme.unlockBg}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className={`w-full max-w-md ${theme.card} overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${theme.cardHeaderGrad} px-8 py-8 text-center relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10 text-8xl flex items-center justify-center select-none pointer-events-none">
            {theme.lockEmoji}
          </div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-3 relative z-10"
          >
            {theme.lockEmoji}
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white mb-1 relative z-10">
            Unlock Your Surprise
          </h1>
          <p className="text-white/75 text-sm relative z-10">
            Answer the secret question to proceed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Question */}
          <div className={`rounded-2xl px-5 py-4 ${theme.badgeBg} text-center`}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-60 mb-1">
              Secret Question
            </p>
            <p className={`text-base font-bold ${theme.heading}`}>
              {project.unlock_question}
            </p>
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="unlock-answer"
              className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${theme.subtext}`}
            >
              Your Answer
            </label>
            <motion.input
              key={shakeKey}
              id="unlock-answer"
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (error) setError('');
              }}
              placeholder="Type your answer here..."
              autoComplete="off"
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-200 ${theme.inputCls}`}
              animate={
                shakeKey > 0
                  ? {
                      x: [0, -10, 10, -8, 8, -5, 5, 0],
                      transition: { duration: 0.5 },
                    }
                  : {}
              }
            />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${theme.feedbackWrongBg}`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={!answer.trim() || isChecking}
            className={`w-full py-3.5 text-base ${theme.btnPrimary} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {isChecking ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Checking...
              </span>
            ) : (
              '🔓 Unlock Surprise'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
