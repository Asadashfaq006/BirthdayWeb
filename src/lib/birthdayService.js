/**
 * Server-side Supabase helper functions for birthday projects.
 * Import ONLY in API routes and server components — never in client components.
 */
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase environment variables are not configured. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
  }

  return createClient(url, key);
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjectBySlug(slug) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('birthday_projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function getAllProjects() {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('birthday_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateProject(id, updates) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('birthday_projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const sb = getAdminClient();
  const { error } = await sb.from('birthday_projects').delete().eq('id', id);
  if (error) throw error;
}

// ── Guestbook ────────────────────────────────────────────────────────────────

export async function createGuestBookMessage({ project_id, name, message, emoji }) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('guestbook')
    .insert({ project_id, name, message, emoji })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getGuestBookMessages(project_id) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('guestbook')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Reactions ────────────────────────────────────────────────────────────────

export async function addReaction({ project_id, reaction_type }) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('reactions')
    .insert({ project_id, reaction_type })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getReactionCounts(project_id) {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('reactions')
    .select('reaction_type')
    .eq('project_id', project_id);
  if (error) throw error;

  const counts = {};
  (data || []).forEach((r) => {
    counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
  });
  return counts;
}
