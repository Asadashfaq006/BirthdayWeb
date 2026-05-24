'use client';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * Renders a QR code for the birthday surprise URL and lets the user download it as PNG.
 * @param {{ slug: string }} props
 */
export default function QRCodeShare({ slug }) {
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/birthday/${slug}`
      : `https://yourdomain.com/birthday/${slug}`;

  function handleDownload() {
    const canvas = document.getElementById('qr-code-canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `birthday-qr-${slug}.png`;
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <QRCodeCanvas
        id="qr-code-canvas"
        value={url}
        size={200}
        bgColor="#ffffff"
        fgColor="#1e1b4b"
        level="H"
        includeMargin={true}
      />
      <p className="text-xs text-gray-500 text-center break-all max-w-[220px]">{url}</p>
      <button
        onClick={handleDownload}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
      >
        ⬇ Download QR Code
      </button>
    </div>
  );
}
