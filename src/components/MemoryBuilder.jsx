'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const createMemory = () => ({
  id: uid(),
  title: '',
  date: '',
  caption: '',
  imageUrl: '',
  imageFileName: '',
  imagePreviewUrl: '',
  isUploadingImage: false,
  imageUploadError: '',
  uploadToken: '',
});

export default function MemoryBuilder({ memories, setMemories }) {
  const [previewErrors, setPreviewErrors] = useState({});
  const objectUrlsRef = useRef(new Set());

  const revokeObjectUrl = (url) => {
    if (typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(url);
    }
  };

  const addMemory = () => setMemories((prev) => [...prev, createMemory()]);

  const removeMemory = (id) =>
    setMemories((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target?.imagePreviewUrl) {
        revokeObjectUrl(target.imagePreviewUrl);
      }
      return prev.filter((m) => m.id !== id);
    });

  const updateMemory = (id, field, value) =>
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );

  const updateMemoryFields = (id, fields) =>
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...fields } : m))
    );

  useEffect(() => {
    const activeBlobUrls = new Set(
      memories
        .map((m) => m.imagePreviewUrl)
        .filter((url) => typeof url === 'string' && url.startsWith('blob:'))
    );

    objectUrlsRef.current.forEach((url) => {
      if (!activeBlobUrls.has(url)) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(url);
      }
    });
  }, [memories]);

  useEffect(() => {
    const objectUrls = objectUrlsRef.current;

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const clearImage = (id) => {
    setPreviewErrors((prev) => ({ ...prev, [id]: '' }));
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        if (m.imagePreviewUrl) {
          revokeObjectUrl(m.imagePreviewUrl);
        }
        return {
          ...m,
          imageUrl: '',
          imageFileName: '',
          imagePreviewUrl: '',
          isUploadingImage: false,
          imageUploadError: '',
          uploadToken: '',
        };
      })
    );
  };

  const handleImageError = (id) => {
    setPreviewErrors((prev) => ({ ...prev, [id]: 'Could not preview selected image.' }));
  };

  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-memory-image', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Image upload failed.');
    }

    return json.url;
  };

  const handleFileChange = async (id, file) => {
    if (!file) {
      clearImage(id);
      return;
    }

    if (!file.type.startsWith('image/')) {
      clearImage(id);
      updateMemoryFields(id, {
        imageUploadError: 'Please choose a valid image file.',
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      clearImage(id);
      updateMemoryFields(id, {
        imageUploadError: 'Image must be 5MB or smaller.',
      });
      return;
    }

    setPreviewErrors((prev) => ({ ...prev, [id]: '' }));
    const uploadToken = uid();
    const previewUrl = URL.createObjectURL(file);
    objectUrlsRef.current.add(previewUrl);

    setMemories((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;

        if (m.imagePreviewUrl) {
          revokeObjectUrl(m.imagePreviewUrl);
        }

        return {
          ...m,
          imageUrl: '',
          imageFileName: file.name,
          imagePreviewUrl: previewUrl,
          isUploadingImage: true,
          imageUploadError: '',
          uploadToken,
        };
      })
    );

    try {
      const uploadedUrl = await uploadImageFile(file);

      setMemories((prev) =>
        prev.map((m) => {
          if (m.id !== id || m.uploadToken !== uploadToken) return m;

          if (m.imagePreviewUrl?.startsWith('blob:')) {
            revokeObjectUrl(m.imagePreviewUrl);
          }

          return {
            ...m,
            imageUrl: uploadedUrl,
            imagePreviewUrl: uploadedUrl,
            isUploadingImage: false,
            imageUploadError: '',
            uploadToken: '',
          };
        })
      );
    } catch (error) {
      setMemories((prev) =>
        prev.map((m) => {
          if (m.id !== id || m.uploadToken !== uploadToken) return m;

          return {
            ...m,
            imageUrl: '',
            isUploadingImage: false,
            imageUploadError: error.message || 'Image upload failed.',
            uploadToken: '',
          };
        })
      );
    }
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

              {/* Image Upload */}
              <div>
                <label className="label">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(mem.id, e.target.files?.[0])}
                  disabled={mem.isUploadingImage}
                  className="input file:mr-3 file:rounded-lg file:border-0 file:bg-pink-100 file:px-3 file:py-1.5 file:text-pink-600 file:font-semibold"
                />
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, GIF (max 5MB)</p>
                {mem.imageFileName && (
                  <div className="mt-1.5 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 truncate">Selected: {mem.imageFileName}</p>
                    <button
                      type="button"
                      onClick={() => clearImage(mem.id)}
                      className="text-xs font-semibold text-pink-500 hover:text-pink-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {mem.isUploadingImage && (
                  <p className="text-xs text-blue-500 mt-1">Uploading image...</p>
                )}
                {mem.imageUploadError && (
                  <p className="text-xs text-red-500 mt-1">{mem.imageUploadError}</p>
                )}
                {mem.imageUrl && !mem.isUploadingImage && !mem.imageUploadError && (
                  <p className="text-xs text-green-600 mt-1">Image uploaded successfully.</p>
                )}
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
            {(mem.imagePreviewUrl || mem.imageUrl) && !previewErrors[mem.id] && (
              <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-32 relative">
                <Image
                  src={mem.imagePreviewUrl || mem.imageUrl}
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

            {previewErrors[mem.id] && (
              <div className="mt-3 rounded-xl border-2 border-dashed border-red-200 bg-red-50 h-20 flex items-center justify-center">
                <p className="text-xs text-red-400">⚠️ {previewErrors[mem.id]}</p>
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
