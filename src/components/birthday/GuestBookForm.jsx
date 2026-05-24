'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EMOJI_OPTIONS = ['❤️', '🎂', '🎉', '😍', '🥳', '✨', '💐', '🌟', '🫶', '🙌'];

/**
 * Form for submitting a guestbook entry.
 * @param {{ projectId: string, theme: object, onSuccess: (entry: object) => void }} props
 */
export default function GuestBookForm({ projectId, theme, onSuccess }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('❤️');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Name and message are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, name: name.trim(), message: message.trim(), emoji }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit');
      setName('');
      setMessage('');
      setEmoji('❤️');
      if (onSuccess) onSuccess(json.entry);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputBase = `w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
    theme?.inputCls ||
    'border-2 border-gray-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-white text-gray-800 placeholder-gray-400'
  }`;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        className={inputBase}
        disabled={loading}
      />
      <textarea
        placeholder="Leave a birthday message…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={500}
        rows={3}
        className={`${inputBase} resize-none`}
        disabled={loading}
      />

      {/* Emoji picker */}
      <div className="flex flex-wrap gap-2">
        {EMOJI_OPTIONS.map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => setEmoji(em)}
            className={`text-xl p-1.5 rounded-xl border-2 transition-all ${
              emoji === em
                ? 'border-pink-400 bg-pink-50 scale-110'
                : 'border-transparent hover:border-pink-200'
            }`}
          >
            {em}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`py-2.5 px-6 rounded-2xl font-bold text-sm transition-all disabled:opacity-60 ${
          theme?.btnPrimary ||
          'bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:from-pink-600 hover:to-rose-500'
        }`}
      >
        {loading ? 'Sending…' : `${emoji} Sign the Guestbook`}
      </button>
    </motion.form>
  );
}
