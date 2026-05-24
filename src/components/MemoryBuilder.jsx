'use client';

import { useState } from 'react';
import Image from 'next/image';

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const createMemory = () => ({
  id: uid(),
  title: '',
  date: '',
  caption: '',
  imageUrl: '',
});

export default function MemoryBuilder({ memories, setMemories }) {
  const [previewErrors, setPreviewErrors] = useState({});

  const addMemory = () => setMemories((prev) => [...prev, createMemory()]);

  const removeMemory = (id) =>
    setMemories((prev) => prev.filter((m) => m.id !== id));

  const updateMemory = (id, field, value) =>
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );

  const handleImageError = (id) => {
    setPreviewErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageChange = (id, value) => {
    setPreviewErrors((prev) => ({ ...prev, [id]: false }));
    updateMemory(id, 'imageUrl', value);
  };

  return (
    <div className="space-y-4">
      {memories.length === 0 && (
        <div className="bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl py-8 text-center">
          <div className="text-3xl mb-2">📸</div>
          <p className="text-pink-500 text-sm font-medium">No memories added yet</p>
          <p className="text-pink-400 text-xs mt-1">
            Click &quot;Add Memory&quot; below to add your first one
          </p>
        </div>
      )}

      {memories.map((mem, index) => (
        <div
          key={mem.id}
          className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden"
        >
          {/* Memory header */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm flex items-center gap-2">
              <span>📷</span> Memory {index + 1}
              {mem.title && (
                <span className="text-white/70 font-normal truncate max-w-[120px]">
                  — {mem.title}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => removeMemory(mem.id)}
              className="text-white/70 hover:text-white text-xs font-medium transition-colors hover:bg-white/20 px-2 py-1 rounded-lg"
            >
              ✕ Remove
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="label">
                  Memory Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={mem.title}
                  onChange={(e) => updateMemory(mem.id, 'title', e.target.value)}
                  placeholder="e.g. Our first trip to the beach"
                  className="input"
                />
              </div>

              {/* Date */}
              <div>
                <label className="label">Year / Date</label>
                <input
                  type="text"
                  value={mem.date}
                  onChange={(e) => updateMemory(mem.id, 'date', e.target.value)}
                  placeholder="e.g. 2022 or Jan 2022"
                  className="input"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="label">Image URL</label>
                <input
                  type="url"
                  value={mem.imageUrl}
                  onChange={(e) => handleImageChange(mem.id, e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="input"
                />
              </div>

              {/* Caption */}
              <div className="sm:col-span-2">
                <label className="label">Caption</label>
                <textarea
                  value={mem.caption}
                  onChange={(e) => updateMemory(mem.id, 'caption', e.target.value)}
                  placeholder="Describe this memory in a few words..."
                  rows={2}
                  className="input resize-none"
                />
              </div>
            </div>

            {/* Image preview */}
            {mem.imageUrl && !previewErrors[mem.id] && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-32 relative">
                <Image
                  src={mem.imageUrl}
                  alt={mem.title || 'Memory image preview'}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(mem.id)}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/40 px-2 py-0.5 rounded-full">
                  Preview
                </span>
              </div>
            )}

            {mem.imageUrl && previewErrors[mem.id] && (
              <div className="mt-3 rounded-xl border-2 border-dashed border-red-200 bg-red-50 h-20 flex items-center justify-center">
                <p className="text-xs text-red-400">
                  ⚠️ Could not load image — check the URL
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add memory button */}
      <button
        type="button"
        onClick={addMemory}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-pink-300 text-pink-500 hover:border-pink-500 hover:bg-pink-50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-xl leading-none">+</span>
        Add Memory
      </button>
    </div>
  );
}
