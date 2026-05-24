'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTIONS = [
  { type: '❤️', label: 'Loved it' },
  { type: '😂', label: 'Funny' },
  { type: '😭', label: 'Emotional' },
  { type: '🎂', label: 'Amazing' },
];

/**
 * Shows 4 reaction buttons. Persists selection in localStorage to prevent repeat votes.
 * Floating emoji animation fires when user reacts.
 * @param {{ projectId: string, theme: object }} props
 */
export default function ReactionSystem({ projectId, theme }) {
  const [counts, setCounts] = useState({});
  const [myReaction, setMyReaction] = useState(null);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const storageKey = `reaction_${projectId}`;

  // Load counts from API
  const fetchCounts = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/reactions?projectId=${projectId}`);
      const json = await res.json();
      if (res.ok) setCounts(json.counts || {});
    } catch (_) {}
  }, [projectId]);

  useEffect(() => {
    fetchCounts();
    const saved = localStorage.getItem(storageKey);
    if (saved) setMyReaction(saved);
  }, [fetchCounts, storageKey]);

  async function handleReact(type) {
    if (myReaction) return; // already reacted

    setMyReaction(type);
    localStorage.setItem(storageKey, type);

    // Optimistic update
    setCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));

    // Floating emoji burst
    const id = Date.now();
    setFloatingEmojis((prev) => [...prev, { id, emoji: type }]);
    setTimeout(() => setFloatingEmojis((prev) => prev.filter((e) => e.id !== id)), 1200);

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, reactionType: type }),
      });
    } catch (_) {}
  }

  return (
    <div className="relative flex flex-col items-center gap-4 py-4">
      <h3 className={`text-xl font-bold ${theme?.heading || 'text-gray-800'}`}>
        How did this make you feel?
      </h3>

      <div className="flex gap-3 flex-wrap justify-center">
        {REACTIONS.map(({ type, label }) => {
          const isSelected = myReaction === type;
          return (
            <motion.button
              key={type}
              onClick={() => handleReact(type)}
              disabled={!!myReaction}
              whileTap={!myReaction ? { scale: 0.88 } : {}}
              whileHover={!myReaction ? { scale: 1.08 } : {}}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all font-medium text-sm ${
                isSelected
                  ? 'border-pink-400 bg-pink-100 scale-105 shadow-lg'
                  : myReaction
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : `border-pink-200 bg-white hover:border-pink-400 hover:bg-pink-50 cursor-pointer ${
                      theme?.text || 'text-gray-700'
                    }`
              }`}
            >
              <span className="text-2xl">{type}</span>
              <span className="text-xs">{label}</span>
              {(counts[type] || 0) > 0 && (
                <span
                  className={`text-xs font-bold ${
                    isSelected ? 'text-pink-600' : theme?.subtext || 'text-gray-500'
                  }`}
                >
                  {counts[type]}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {myReaction && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${theme?.subtext || 'text-gray-500'}`}
        >
          You reacted with {myReaction} — thanks!
        </motion.p>
      )}

      {/* Floating emoji animation */}
      <AnimatePresence>
        {floatingEmojis.map(({ id, emoji }) => (
          <motion.span
            key={id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -90, scale: 1.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute text-4xl pointer-events-none select-none"
            style={{ bottom: '60%', left: '50%', transform: 'translateX(-50%)' }}
          >
            {emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
