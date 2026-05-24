'use client';
import { motion } from 'framer-motion';
import ProjectActions from './ProjectActions';
import THEMES from '@/lib/themeConfig';

/**
 * Single project card in the dashboard.
 * @param {{ project: object, onDelete: () => void }} props
 */
export default function DashboardProjectCard({ project, onDelete }) {
  const theme = THEMES[project.theme] || THEMES.cute;

  const cardBg = theme.dark
    ? 'bg-gray-900 border border-gray-700'
    : 'bg-white border border-gray-100';
  const headingColor = theme.dark ? 'text-white' : 'text-gray-900';
  const subtextColor = theme.dark ? 'text-gray-400' : 'text-gray-500';

  const date = project.birthday_date
    ? new Date(project.birthday_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl shadow-md overflow-hidden ${cardBg}`}
    >
      {/* Colored header strip */}
      <div className={`h-2 bg-gradient-to-r ${theme.cardHeaderGrad}`} />

      <div className="p-5 flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`text-lg font-extrabold leading-tight ${headingColor}`}>
              {project.name}
            </h3>
            {date && <p className={`text-xs mt-0.5 ${subtextColor}`}>🎂 {date}</p>}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-xl font-medium ${theme.badgeBg}`}
          >
            {theme.label || project.theme}
          </span>
        </div>

        {/* Slug */}
        <p className={`text-xs font-mono ${subtextColor}`}>/{project.slug}</p>

        <ProjectActions slug={project.slug} id={project.id} onDelete={onDelete} />
      </div>
    </motion.div>
  );
}
