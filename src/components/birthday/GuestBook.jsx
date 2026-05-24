'use client';
import { useState, useEffect, useCallback } from 'react';
import GuestBookForm from './GuestBookForm';
import GuestBookList from './GuestBookList';

/**
 * Full guestbook section: fetches messages, shows form + list.
 * @param {{ projectId: string, theme: object }} props
 */
export default function GuestBook({ projectId, theme }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/guestbook?projectId=${projectId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessages(json.messages || []);
    } catch {
      setError('Could not load messages.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function handleNewEntry(entry) {
    // Optimistic update — prepend to list
    setMessages((prev) => [entry, ...prev]);
  }

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <h3 className={`text-2xl font-bold text-center ${theme?.heading || 'text-gray-800'}`}>
        📝 Birthday Guestbook
      </h3>

      <GuestBookForm projectId={projectId} theme={theme} onSuccess={handleNewEntry} />

      <div className="mt-2">
        {loading ? (
          <p className={`text-center text-sm ${theme?.subtext || 'text-gray-400'}`}>
            Loading messages…
          </p>
        ) : error ? (
          <p className="text-center text-sm text-red-400">{error}</p>
        ) : (
          <GuestBookList messages={messages} theme={theme} />
        )}
      </div>
    </section>
  );
}
