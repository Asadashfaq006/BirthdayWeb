'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BALLOON_DATA = [
  { id: 1, emoji: '🎈', color: '#FF6B8A', message: 'You are amazing!' },
  { id: 2, emoji: '🎈', color: '#FFB347', message: 'Keep shining bright ✨' },
  { id: 3, emoji: '🎈', color: '#87CEEB', message: 'Dreams do come true! 🌟' },
  { id: 4, emoji: '🎈', color: '#98FB98', message: 'Today is YOUR day! 🎂' },
  { id: 5, emoji: '🎈', color: '#DDA0DD', message: 'You inspire everyone! 💕' },
  { id: 6, emoji: '🎈', color: '#F08080', message: 'The world needs you! 🌍' },
  { id: 7, emoji: '🎈', color: '#40E0D0', message: 'Happy happy birthday! 🥳' },
  { id: 8, emoji: '🎈', color: '#FFD700', message: 'You are pure gold! 👑' },
];

// Deterministic grid positions for 8 balloons (4 columns × 2 rows)
const POSITIONS = [
  { top: '15%', left: '5%' },
  { top: '10%', left: '27%' },
  { top: '18%', left: '50%' },
  { top: '12%', left: '73%' },
  { top: '52%', left: '5%' },
  { top: '48%', left: '27%' },
  { top: '54%', left: '50%' },
  { top: '50%', left: '73%' },
];

/**
 * Pop 8 balloons to reveal birthday messages.
 * Uses deterministic positions (no Math.random in render) for hydration safety.
 */
export default function BalloonPopGame({ theme }) {
  const [popped, setPopped] = useState(new Set());
  const [shownMessage, setShownMessage] = useState(null);
  const messageTimer = useRef(null);

  function popBalloon(id, message) {
    if (popped.has(id)) return;

    // Fire confetti on pop
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.5 },
        colors: theme?.confettiColors || ['#FF6B8A', '#FFD700', '#87CEEB'],
        scalar: 0.9,
      });
    });

    setPopped((prev) => new Set([...prev, id]));
    setShownMessage(message);

    clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setShownMessage(null), 2500);
  }

  const allPopped = popped.size === BALLOON_DATA.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`text-sm ${theme?.subtext || 'text-gray-500'}`}>
        Pop all the balloons to reveal messages! ({popped.size}/{BALLOON_DATA.length})
      </p>

      <div className="relative w-full max-w-sm h-72">
        {BALLOON_DATA.map((b, i) => (
          <AnimatePresence key={b.id}>
            {!popped.has(b.id) ? (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                  transition: {
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    y: { duration: 2.5, repeat: Infinity, delay: i * 0.3 },
                  },
                }}
                exit={{ scale: [1, 1.4, 0], opacity: [1, 1, 0], transition: { duration: 0.3 } }}
                onClick={() => popBalloon(b.id, b.message)}
                style={{
                  position: 'absolute',
                  top: POSITIONS[i].top,
                  left: POSITIONS[i].left,
                  fontSize: '2.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
                aria-label={`Pop balloon ${b.id}`}
              >
                🎈
              </motion.button>
            ) : null}
          </AnimatePresence>
        ))}
      </div>

      {/* Message popup */}
      <AnimatePresence>
        {shownMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className={`px-6 py-3 rounded-2xl text-center font-semibold text-sm shadow-lg ${
              theme?.badgeBg || 'bg-pink-100 text-pink-700 border border-pink-200'
            }`}
          >
            {shownMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      {allPopped && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-3xl">🎊</p>
          <p className={`font-bold ${theme?.heading || 'text-gray-800'}`}>
            You popped them all! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
}
