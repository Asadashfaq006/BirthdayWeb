'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GIFT_MESSAGES = [
  '🎁 You are irreplaceable!',
  '✨ May all your dreams come true!',
  '💖 You light up every room you enter!',
  '🌟 The world is better with you in it!',
  '🎉 Keep shining, birthday star!',
];

/**
 * An animated gift box that shakes on hover and opens on click, revealing a surprise message.
 * @param {{ theme: object }} props
 */
export default function GiftBoxSurprise({ theme }) {
  const [opened, setOpened] = useState(false);
  const [message] = useState(
    () => GIFT_MESSAGES[Math.floor(Math.random() * GIFT_MESSAGES.length)]
  );

  async function handleOpen() {
    if (opened) return;
    setOpened(true);
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: theme?.confettiColors || ['#FF69B4', '#FFD700', '#7DF9FF'],
      });
    } catch (_) {}
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h3 className={`text-2xl font-bold ${theme?.heading || 'text-gray-800'}`}>
        🎁 A Special Gift For You!
      </h3>

      {!opened ? (
        <motion.button
          onClick={handleOpen}
          whileHover={{ rotate: [0, -8, 8, -8, 8, 0], transition: { duration: 0.5 } }}
          whileTap={{ scale: 0.92 }}
          className="text-7xl cursor-pointer select-none focus:outline-none"
          aria-label="Open gift box"
        >
          🎁
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            key="gift-open"
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-7xl">🎊</span>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-xl font-bold text-center px-6 ${theme?.heading || 'text-gray-800'}`}
            >
              {message}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      )}

      {!opened && (
        <p className={`text-sm ${theme?.subtext || 'text-gray-500'}`}>
          Click the gift to open it!
        </p>
      )}
    </div>
  );
}
