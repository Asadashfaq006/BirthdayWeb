'use client';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardProjectCard from './DashboardProjectCard';

/**
 * Client component for the admin dashboard.
 * Fetches all projects from /api/projects and renders them in a responsive grid.
 */
export default function DashboardClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setProjects(json.projects || []);
    } catch (err) {
      setError(err.message || 'Could not load projects.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function handleDelete(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <span className="text-4xl animate-bounce">🎂</span>
          <p className="text-sm">Loading your surprises…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 font-medium">{error}</p>
        <button
          onClick={() => { setError(''); setLoading(true); fetchProjects(); }}
          className="mt-4 px-4 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <span className="text-5xl">🎁</span>
        <p className="text-gray-500 text-sm">No birthday surprises yet.</p>
        <a
          href="/create"
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm hover:from-pink-600 hover:to-rose-500"
        >
          + Create your first surprise
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-6">
        {projects.length} surprise{projects.length !== 1 ? 's' : ''} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {projects.map((p) => (
            <DashboardProjectCard
              key={p.id}
              project={p}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
