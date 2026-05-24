'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const BalloonPopGame = dynamic(() => import('./BalloonPopGame'), { ssr: false });
const CatchCakeGame = dynamic(() => import('./CatchCakeGame'), { ssr: false });

const GAMES = [
  {
    id: 'balloons',
    title: 'Balloon Pop',
    emoji: '🎈',
    desc: 'Pop all the balloons to reveal birthday messages!',
  },
  {
    id: 'catch',
    title: 'Catch the Cake',
    emoji: '🎂',
    desc: 'Move your basket to catch falling cakes before time runs out!',
  },
];

/**
 * Game selector and host component for Birthday mini-games.
 * @param {{ theme: object }} props
 */
export default function MiniGamesSection({ theme }) {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className={`text-2xl font-bold text-center ${theme?.heading || 'text-gray-800'}`}>
        🎮 Birthday Mini-Games
      </h3>

      {/* Game selector */}
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <motion.button
            key={g.id}
            onClick={() => setActiveGame(activeGame === g.id ? null : g.id)}
            whileTap={{ scale: 0.96 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all text-center ${
              activeGame === g.id
                ? 'border-pink-400 bg-pink-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50'
            }`}
          >
            <span className="text-4xl">{g.emoji}</span>
            <span className={`font-bold text-sm ${theme?.heading || 'text-gray-800'}`}>
              {g.title}
            </span>
            <span className={`text-xs ${theme?.subtext || 'text-gray-500'}`}>{g.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Active game */}
      <AnimatePresence mode="wait">
        {activeGame && (
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {activeGame === 'balloons' && <BalloonPopGame theme={theme} />}
              {activeGame === 'catch' && <CatchCakeGame theme={theme} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
