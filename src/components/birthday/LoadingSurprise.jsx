'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  { text: 'Loading surprise...', emoji: '🎁' },
  { text: 'Finding birthday magic...', emoji: '✨' },
  { text: 'Preparing happiness...', emoji: '🎉' },
  { text: 'Getting the confetti ready...', emoji: '🎊' },
  { text: 'Almost there...', emoji: '🌟' },
];

export default function LoadingSurprise() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setMsgIndex((prev) => (prev + 1) % MESSAGES.length),
      1800
    );
    return () => clearInterval(id);
  }, []);

  const current = MESSAGES[msgIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex flex-col items-center justify-center">
      {/* Pulsing circle */}
      <div className="relative mb-8">
        <motion.div
          className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-2xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-5xl">{current.emoji}</span>
        </motion.div>

        {/* Orbit ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-purple-300/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ scale: 1.3 }}
        />
      </div>

      {/* Rotating message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-bold text-purple-700 text-center"
        >
          {current.text}
        </motion.p>
      </AnimatePresence>

      {/* Dots loader */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-purple-400"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
