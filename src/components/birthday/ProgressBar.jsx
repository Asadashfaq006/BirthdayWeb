'use client';

import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, theme }) {
  const pct = total > 0 ? Math.round(((current) / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${theme.subtext}`}>
          Question {current} of {total}
        </span>
        <span className={`text-xs font-semibold ${theme.subtext}`}>{pct}%</span>
      </div>

      <div className={`w-full h-3 ${theme.progressBg} overflow-hidden`}>
        <motion.div
          className={`h-full ${theme.progressFill}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5 mt-2 justify-center">
        {Array.from({ length: total }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i + 1 === current ? 1.3 : 1,
              opacity: i + 1 <= current ? 1 : 0.35,
            }}
            transition={{ duration: 0.3 }}
            className={`w-2 h-2 rounded-full ${theme.progressFill} inline-block`}
          />
        ))}
      </div>
    </div>
  );
}
