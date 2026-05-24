'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MusicPlayer({ url, shouldPlay, theme }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Start / stop based on shouldPlay + muted state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.5;

    if (shouldPlay && !isMuted) {
      audio.play().catch(() => setHasError(true));
    } else {
      audio.pause();
    }
  }, [shouldPlay, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  if (hasError) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={url}
        preload="none"
        onError={() => setHasError(true)}
      />

      {/* Floating mute/unmute button */}
      {shouldPlay && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted((prev) => !prev)}
          title={isMuted ? 'Unmute music' : 'Mute music'}
          className={`fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-xl ${theme.musicBtnBg}`}
        >
          {isMuted ? '🔇' : '🎵'}
        </motion.button>
      )}
    </>
  );
}
