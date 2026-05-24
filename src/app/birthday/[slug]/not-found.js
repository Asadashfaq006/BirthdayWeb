'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white/90 rounded-3xl shadow-2xl border border-pink-100 max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-8 text-center">
          <motion.div
            animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-7xl mb-3"
          >
            🔍
          </motion.div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Surprise Not Found
          </h1>
          <p className="text-white/75 text-sm">
            We couldn&apos;t find this birthday surprise
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7 text-center space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            The link you followed might be{' '}
            <strong>incorrect or expired</strong>. Double-check the link and try
            again, or ask whoever sent it to you for the correct one.
          </p>

          <div className="bg-purple-50 rounded-2xl p-4 text-sm text-purple-700">
            <p className="font-semibold mb-1">💡 Possible reasons:</p>
            <ul className="text-left space-y-1 text-xs text-purple-600 list-disc list-inside">
              <li>The link was typed incorrectly</li>
              <li>The surprise has not been created yet</li>
              <li>The URL was incomplete when shared</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md"
          >
            🎂 Create a New Surprise
          </Link>

          <p className="text-xs text-gray-400 mt-2">
            Want to make your own? Click the button above!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
