'use client';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Renders a list of guestbook messages.
 * @param {{ messages: Array<{id:string,name:string,message:string,emoji:string,created_at:string}>, theme: object }} props
 */
export default function GuestBookList({ messages, theme }) {
  if (!messages || messages.length === 0) {
    return (
      <p className={`text-center text-sm ${theme?.subtext || 'text-gray-500'} py-4`}>
        No messages yet — be the first to sign!
      </p>
    );
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`rounded-2xl p-4 ${
              theme?.memCardBg || 'bg-white border border-pink-100 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{msg.emoji}</span>
              <span className={`font-bold text-sm ${theme?.heading || 'text-gray-800'}`}>
                {msg.name}
              </span>
              <span className={`text-xs ml-auto ${theme?.subtext || 'text-gray-400'}`}>
                {timeAgo(msg.created_at)}
              </span>
            </div>
            <p className={`text-sm ${theme?.text || 'text-gray-700'}`}>{msg.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
