-- ============================================================
-- Birthday Surprise Website — Supabase Schema
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- ── birthday_projects ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS birthday_projects (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT        NOT NULL UNIQUE,
  birthday_person_name TEXT   NOT NULL,
  birthday_date   DATE        NOT NULL,
  welcome_message TEXT,
  final_message   TEXT,
  music_url       TEXT,
  theme           TEXT        DEFAULT 'cute'
                              CHECK (theme IN ('cute', 'romantic', 'neon', 'galaxy', 'cartoon')),
  unlock_question TEXT,
  unlock_answer   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── questions ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id           UUID        NOT NULL
                                   REFERENCES birthday_projects (id) ON DELETE CASCADE,
  question_text        TEXT        NOT NULL,
  correct_option_index INTEGER,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── options ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS options (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID        NOT NULL
                          REFERENCES questions (id) ON DELETE CASCADE,
  option_text TEXT        NOT NULL,
  is_correct  BOOLEAN     DEFAULT FALSE,
  is_moving   BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── memories ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memories (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id  UUID        NOT NULL
                          REFERENCES birthday_projects (id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  memory_date TEXT,
  caption     TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes for faster lookups
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug       ON birthday_projects (slug);
CREATE INDEX IF NOT EXISTS idx_questions_project   ON questions (project_id);
CREATE INDEX IF NOT EXISTS idx_options_question    ON options (question_id);
CREATE INDEX IF NOT EXISTS idx_memories_project    ON memories (project_id);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE birthday_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE options           ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories          ENABLE ROW LEVEL SECURITY;

-- ── birthday_projects policies ───────────────────────────────────────────────
-- Public can insert new projects (creator flow)
CREATE POLICY "public_insert_birthday_projects"
  ON birthday_projects FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public can read projects by slug (viewer flow — Module 2)
CREATE POLICY "public_read_birthday_projects"
  ON birthday_projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── questions policies ───────────────────────────────────────────────────────
CREATE POLICY "public_insert_questions"
  ON questions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_read_questions"
  ON questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── options policies ─────────────────────────────────────────────────────────
CREATE POLICY "public_insert_options"
  ON options FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_read_options"
  ON options FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── memories policies ────────────────────────────────────────────────────────
CREATE POLICY "public_insert_memories"
  ON memories FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "public_read_memories"
  ON memories FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- Done!
-- After running this:
-- 1. Copy your Supabase Project URL and keys into .env.local
-- 2. Run `npm run dev` to start the development server
-- ============================================================
