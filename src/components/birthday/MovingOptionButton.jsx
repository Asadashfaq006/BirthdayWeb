'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const BTN_W = 220; // approximate button width in px
const BTN_H = 56;  // approximate button height in px

function randomPos() {
  const maxX = window.innerWidth - BTN_W - 16;
  const maxY = window.innerHeight - BTN_H - 16;
  return {
    x: Math.max(8, Math.random() * maxX),
    y: Math.max(8, Math.random() * maxY),
    rotate: (Math.random() - 0.5) * 20,
  };
}

export default function MovingOptionButton({ option, onDodgeClick, theme, disabled }) {
  const [pos, setPos] = useState(null); // null = in-flow, object = fixed on screen

  const dodge = () => {
    setPos(randomPos());
  };

  const handleInteraction = () => {
    if (disabled) return;
    dodge();
    if (onDodgeClick) onDodgeClick();
  };

  // While still in its grid cell (not yet moved), render a same-size placeholder
  // plus the floating button via a portal-like fixed position
  if (pos) {
    return (
      <>
        {/* Invisible placeholder to keep grid layout stable */}
        <div className="w-full min-h-[56px] opacity-0 pointer-events-none" aria-hidden="true" />

        {/* Button floating freely over the whole page */}
        <motion.button
          type="button"
          initial={false}
          animate={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          onHoverStart={!disabled ? dodge : undefined}
          onTouchStart={!disabled ? handleInteraction : undefined}
          onClick={!disabled ? handleInteraction : undefined}
          disabled={disabled}
          className={`fixed top-0 left-0 py-3.5 px-6 text-base font-semibold ${theme.btnOption} select-none flex items-center gap-2`}
          style={{ width: BTN_W, zIndex: 9999, originX: 0.5, originY: 0.5 }}
        >
          <span>{option.option_text}</span>
          <span className="text-sm opacity-60" aria-hidden="true">🏃</span>
        </motion.button>
      </>
    );
  }

  return (
    <motion.button
      type="button"
      onHoverStart={!disabled ? dodge : undefined}
      onTouchStart={!disabled ? handleInteraction : undefined}
      onClick={!disabled ? handleInteraction : undefined}
      disabled={disabled}
      className={`w-full py-3.5 px-6 text-base font-semibold ${theme.btnOption} transition-colors duration-200 select-none flex items-center gap-2 min-h-[56px]`}
    >
      <span>{option.option_text}</span>
      <span className="text-sm opacity-60" aria-hidden="true">🏃</span>
    </motion.button>
  );
}
