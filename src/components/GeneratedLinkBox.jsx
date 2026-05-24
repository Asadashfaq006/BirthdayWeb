'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const QRCodeShare = dynamic(() => import('./QRCodeShare'), { ssr: false });

export default function GeneratedLinkBox({ slug, onClose }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${baseUrl}/birthday/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Birthday surprise created"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-8 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 text-9xl">
            🎊
          </div>
          <div className="text-5xl mb-3 relative z-10 animate-float">🎉</div>
          <h2 className="text-2xl font-extrabold text-white mb-1 relative z-10">
            Surprise Created!
          </h2>
          <p className="text-white/80 text-sm relative z-10">
            Your birthday surprise is ready to be shared
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Shareable Link
            </p>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-200 rounded-2xl p-4">
              <p className="text-sm font-mono text-purple-700 break-all leading-relaxed select-all">
                {link}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                copied
                  ? 'bg-green-500 text-white shadow-green-200'
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {copied ? (
                <>
                  <span className="text-base">✓</span> Copied!
                </>
              ) : (
                <>
                  <span className="text-base">📋</span> Copy Link
                </>
              )}
            </button>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-base">🔗</span> Preview
            </a>

            <button
              onClick={() => setShowQR((v) => !v)}
              className={`py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                showQR
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
              aria-expanded={showQR}
              aria-label="Toggle QR code"
            >
              📱
            </button>
          </div>

          {/* QR Code panel */}
          {showQR && (
            <div className="border border-indigo-100 rounded-2xl bg-indigo-50 overflow-hidden">
              <QRCodeShare slug={slug} />
            </div>
          )}

          {/* Info note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
            <strong>💡 Tip:</strong> Share this link with the birthday person. They will need to
            answer your unlock question (if set) to access the surprise.
          </div>

          {/* Create another */}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                window.location.reload();
              }
            }}
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            + Create another surprise
          </button>
        </div>
      </div>
    </div>
  );
}
