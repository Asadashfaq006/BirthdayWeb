'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MemoriesTimeline({ memories, theme }) {
  if (!memories || memories.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-12">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className={`text-3xl font-extrabold ${theme.heading} mb-1`}>
          📸 Our Memories
        </p>
        <p className={`text-sm ${theme.subtext}`}>
          {memories.length} beautiful moment{memories.length !== 1 ? 's' : ''} we shared
        </p>
      </motion.div>

      {/* Timeline cards */}
      <div className="space-y-6">
        {memories.map((mem, i) => (
          <motion.div
            key={mem.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`relative rounded-3xl overflow-hidden ${theme.memCardBg}`}
          >
            {/* Accent stripe */}
            <div
              className={`h-1.5 bg-gradient-to-r ${theme.memCardAccent} w-full`}
            />

            {/* Image */}
            {mem.image_url && (
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={mem.image_url}
                  alt={mem.title || 'Memory'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Date badge on image */}
                {mem.memory_date && (
                  <span
                    className={`absolute bottom-3 left-4 text-xs font-bold px-3 py-1 rounded-full ${theme.badgeBg} backdrop-blur-sm`}
                  >
                    📅 {mem.memory_date}
                  </span>
                )}
              </div>
            )}

            {/* Text content */}
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {mem.title && (
                    <h3 className={`text-lg font-extrabold ${theme.heading} leading-tight mb-1`}>
                      {mem.title}
                    </h3>
                  )}
                  {!mem.image_url && mem.memory_date && (
                    <p className={`text-xs font-semibold ${theme.subtext} mb-2`}>
                      📅 {mem.memory_date}
                    </p>
                  )}
                  {mem.caption && (
                    <p className={`text-sm leading-relaxed ${theme.text}`}>
                      {mem.caption}
                    </p>
                  )}
                </div>

                {/* Memory number bubble */}
                <div
                  className={`shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${theme.memCardAccent} flex items-center justify-center text-white text-xs font-extrabold shadow-sm`}
                >
                  {i + 1}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
