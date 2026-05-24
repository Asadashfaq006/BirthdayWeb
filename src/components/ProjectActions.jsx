'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCodeShare from './QRCodeShare';

/**
 * Action buttons for a dashboard project card.
 * @param {{ slug: string, id: string, onDelete: () => void }} props
 */
export default function ProjectActions({ slug, id, onDelete }) {
  const [showQR, setShowQR] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/birthday/${slug}`
      : `/birthday/${slug}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      if (onDelete) onDelete();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const btnSm =
    'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className={`${btnSm} ${
            copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {copied ? '✅ Copied!' : '🔗 Copy Link'}
        </button>

        <button
          onClick={() => setShowQR((v) => !v)}
          className={`${btnSm} ${
            showQR ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {showQR ? '🔼 Hide QR' : '📱 Show QR'}
        </button>

        <a
          href={`/birthday/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnSm} bg-pink-100 hover:bg-pink-200 text-pink-700`}
        >
          👁 Preview
        </a>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className={`${btnSm} bg-red-50 hover:bg-red-100 text-red-600`}
          >
            🗑 Delete
          </button>
        ) : (
          <div className="flex gap-1 items-center">
            <span className="text-xs text-red-500 font-medium">Are you sure?</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`${btnSm} bg-red-500 text-white hover:bg-red-600 disabled:opacity-60`}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className={`${btnSm} bg-gray-100 text-gray-600`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <QRCodeShare slug={slug} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
