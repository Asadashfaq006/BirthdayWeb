'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Deterministic positions using golden-ratio distribution — no Math.random at render time
// so SSR and client are in sync.
function buildElements(emojis, count = 14) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: ((i * 137.508) % 100).toFixed(2),   // golden-ratio spread across x
    top: ((i * 61.803) % 90 + 5).toFixed(2),  // spread across y (5–95%)
    size: 1 + (i % 4) * 0.35,                  // 1–2.05 rem
    duration: 3 + (i % 5),                     // 3–7 s
    delay: -(i * 0.6),                          // stagger start
    yRange: -20 - (i % 3) * 10,               // -20 to -40 px float
    opacity: 0.12 + (i % 5) * 0.06,           // 0.12–0.36
  }));
}

export default function FloatingEffects({ emojis = [], dark = false }) {
  const elements = useMemo(
    () => buildElements(emojis.length > 0 ? emojis : ['✨']),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [emojis.join(',')]
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {elements.map((el) => (
        <motion.div
          key={el.id}
          style={{
            position: 'absolute',
            left: `${el.left}%`,
            top: `${el.top}%`,
            fontSize: `${el.size}rem`,
            opacity: dark ? el.opacity * 1.6 : el.opacity,
            userSelect: 'none',
          }}
          animate={{
            y: [0, el.yRange, 0],
            rotate: [-8, 8, -8],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}
    </div>
  );
}
