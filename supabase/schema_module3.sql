-- ============================================================
-- Birthday Surprise Website — Module 3 Schema Additions
-- Run this in Supabase SQL Editor AFTER schema.sql (Module 1)
-- ============================================================

-- ── guestbook ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guestbook (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL
                          REFERENCES birthday_projects (id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  emoji       TEXT        DEFAULT '❤️',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── reactions ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id    UUID        NOT NULL
                            REFERENCES birthday_projects (id) ON DELETE CASCADE,
  reaction_type TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_guestbook_project  ON guestbook  (project_id);
CREATE INDEX IF NOT EXISTS idx_reactions_project  ON reactions  (project_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type     ON reactions  (project_id, reaction_type);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- guestbook policies
CREATE POLICY "public_insert_guestbook"
  ON guestbook FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_read_guestbook"
  ON guestbook FOR SELECT TO anon, authenticated
  USING (true);

-- reactions policies
CREATE POLICY "public_insert_reactions"
  ON reactions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_read_reactions"
  ON reactions FOR SELECT TO anon, authenticated
  USING (true);

-- ── Done! ────────────────────────────────────────────────────────────────────
