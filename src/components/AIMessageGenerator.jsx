'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const TONES = [
  { value: 'funny', label: '😂 Funny', desc: 'Light-hearted jokes' },
  { value: 'emotional', label: '😢 Emotional', desc: 'Heartfelt and sincere' },
  { value: 'romantic', label: '❤️ Romantic', desc: 'Sweet and loving' },
  { value: 'friendly', label: '🎉 Friendly', desc: 'Warm and celebratory' },
];

/**
 * AI-powered birthday message generator with tone selector and copy functionality.
 * Falls back to pre-written messages when no OpenAI API key is configured.
 */
export default function AIMessageGenerator() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('friendly');
  const [message, setMessage] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the birthday person\'s name.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/generate-birthday-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship: relationship.trim(),
          keywords: keywords.trim(),
          tone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      setMessage(json.message);
      setIsFallback(json.isFallback);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy this message:', message);
    }
  }

  const inputCls =
    'w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all border-2 border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-gray-800 placeholder-gray-400';

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 p-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-1">
          ✨ AI Birthday Message
        </h2>
        <p className="text-gray-500 text-sm">
          Generate a personalized birthday message in seconds.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Birthday Person's Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className={inputCls}
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Your Relationship (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. best friend, sister, colleague"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            maxLength={80}
            className={inputCls}
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Special memories / keywords (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. beach trips, coffee, laughter"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={200}
            className={inputCls}
          />
        </div>

        {/* Tone selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2">Tone</label>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`text-left px-3 py-2.5 rounded-2xl border-2 text-sm transition-all ${
                  tone === t.value
                    ? 'border-purple-500 bg-purple-50 font-semibold'
                    : 'border-gray-200 hover:border-purple-300 bg-white'
                }`}
              >
                <div className="font-medium">{t.label}</div>
                <div className="text-xs text-gray-400">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className="py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 disabled:opacity-60 transition-all"
        >
          {loading ? '✨ Generating…' : '✨ Generate Message'}
        </motion.button>
      </form>

      {/* Result */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-5 flex flex-col gap-3"
        >
          {isFallback && (
            <p className="text-xs text-purple-400 font-medium">
              ✦ Using a pre-written message (no AI key configured)
            </p>
          )}
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          <button
            onClick={handleCopy}
            className={`self-end px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {copied ? '✅ Copied!' : '📋 Copy Message'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
