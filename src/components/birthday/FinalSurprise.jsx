'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import MemoriesTimeline from './MemoriesTimeline';
import GiftBoxSurprise from './GiftBoxSurprise';
import ReactionSystem from './ReactionSystem';
import GuestBook from './GuestBook';
import dynamic from 'next/dynamic';

const MiniGamesSection = dynamic(() => import('@/components/MiniGamesSection'), { ssr: false });
const SocialShareCard = dynamic(() => import('@/components/SocialShareCard'), { ssr: false });

async function fireCelebrationConfetti(colors) {
  try {
    const confetti = (await import('canvas-confetti')).default;

    // Centre burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors,
      zIndex: 9999,
    });

    // Left cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        zIndex: 9999,
      });
    }, 250);

    // Right cannon
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        zIndex: 9999,
      });
    }, 500);

    // Overhead shower
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.2 },
        colors,
        zIndex: 9999,
      });
    }, 900);
  } catch {
    // canvas-confetti not available
  }
}

export default function FinalSurprise({ project, memories, theme }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fireCelebrationConfetti(theme.confettiColors);
    }, 400);
    return () => clearTimeout(timer);
  }, [theme.confettiColors]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-16 pb-20 relative z-10">
      {/* Animated cake */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: [0, -8, 8, -5, 5, 0] }}
        transition={{ type: 'spring', stiffness: 130, damping: 14 }}
        className="text-9xl mb-4 inline-block"
      >
        {theme.cakeEmoji}
      </motion.div>

      {/* Happy Birthday heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mb-2"
      >
        <p className={`text-sm font-bold uppercase tracking-widest ${theme.subtext} mb-1`}>
          🎊 Today we celebrate
        </p>
        <h1 className={`text-4xl sm:text-5xl ${theme.heading} leading-tight`}>
          Happy Birthday,
        </h1>
        <h2 className={`text-5xl sm:text-6xl ${theme.heading} mt-1`}>
          {project.birthday_person_name}! 🎉
        </h2>
      </motion.div>

      {/* Emoji row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3 text-3xl my-6"
      >
        {['🎂', '🎁', '🎈', '🌟', '🥳', '🎊', '✨'].map((emoji, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>

      {/* Final message card */}
      {project.final_message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`w-full max-w-lg ${theme.card} p-7 text-center mb-8 relative overflow-hidden`}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.memCardAccent}`}
          />
          <p className={`text-xs font-bold uppercase tracking-widest ${theme.subtext} mb-3`}>
            A final message just for you 💌
          </p>
          <p className={`text-base leading-relaxed ${theme.text}`}>
            {project.final_message}
          </p>
        </motion.div>
      )}

      {/* Memories */}
      {memories && memories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="w-full"
        >
          <MemoriesTimeline memories={memories} theme={theme} />
        </motion.div>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className={`text-center text-sm ${theme.subtext} mt-4 pb-4`}
      >
        Made with 💕 just for you
      </motion.p>

      {/* ── Module 3 Advanced Features ─────────────────────────────────── */}

      {/* Gift Box */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className={`w-full max-w-lg ${theme.card} p-6 mt-6`}
      >
        <GiftBoxSurprise theme={theme} />
      </motion.div>

      {/* Divider */}
      <div className="w-full max-w-lg my-4 border-t border-dashed opacity-30" />

      {/* Mini Games */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className={`w-full max-w-lg ${theme.card} p-6`}
      >
        <MiniGamesSection theme={theme} />
      </motion.div>

      {/* Divider */}
      <div className="w-full max-w-lg my-4 border-t border-dashed opacity-30" />

      {/* Social Share */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 0.5 }}
        className={`w-full max-w-lg ${theme.card} p-6`}
      >
        <SocialShareCard
          slug={project.slug}
          birthdayPersonName={project.birthday_person_name}
          theme={theme}
        />
      </motion.div>

      {/* Divider */}
      <div className="w-full max-w-lg my-4 border-t border-dashed opacity-30" />

      {/* Reaction System */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className={`w-full max-w-lg ${theme.card} p-6`}
      >
        <ReactionSystem projectId={project.id} theme={theme} />
      </motion.div>

      {/* Divider */}
      <div className="w-full max-w-lg my-4 border-t border-dashed opacity-30" />

      {/* Guestbook */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        className={`w-full max-w-lg ${theme.card} p-6 mb-10`}
      >
        <GuestBook projectId={project.id} theme={theme} />
      </motion.div>
    </div>
  );
}
