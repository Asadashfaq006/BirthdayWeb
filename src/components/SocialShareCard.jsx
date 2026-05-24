'use client';
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Social share card with copy-link, WhatsApp, and Twitter sharing.
 * @param {{ slug: string, birthdayPersonName: string, theme: object }} props
 */
export default function SocialShareCard({ slug, birthdayPersonName, theme }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/birthday/${slug}`
      : `https://yourdomain.com/birthday/${slug}`;

  const shareText = encodeURIComponent(
    `🎂 Surprise birthday experience for ${birthdayPersonName || 'someone special'}! Open to find out 👉`
  );
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: show URL in prompt
      window.prompt('Copy this link:', url);
    }
  }, [url]);

  const btnBase =
    'flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl font-semibold text-sm transition-all active:scale-95';

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <h3 className={`text-xl font-bold ${theme?.heading || 'text-gray-800'}`}>
        📤 Share the Surprise!
      </h3>

      <p className={`text-sm text-center ${theme?.subtext || 'text-gray-500'}`}>
        Share this birthday experience with friends and family.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {/* Copy Link */}
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.94 }}
          className={`${btnBase} ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white border-2 border-gray-200 hover:border-pink-400 text-gray-800 hover:bg-pink-50'
          }`}
        >
          {copied ? '✅ Copied!' : '🔗 Copy Link'}
        </motion.button>

        {/* WhatsApp */}
        <motion.a
          href={`https://wa.me/?text=${shareText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.94 }}
          className={`${btnBase} bg-[#25D366] text-white hover:bg-[#1da851]`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </motion.a>

        {/* Twitter / X */}
        <motion.a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.94 }}
          className={`${btnBase} bg-black text-white hover:bg-gray-800`}
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.737-8.853L1.257 2.25H8.08l4.261 5.633 5.902-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Tweet
        </motion.a>
      </div>
    </div>
  );
}
