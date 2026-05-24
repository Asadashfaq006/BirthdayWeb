import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

/**
 * Server-side Supabase admin client.
 * Uses service role key to bypass RLS for trusted server-side writes.
 * Falls back to anon key if service role key is not set.
 */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
  }

  return createClient(url, key);
}

/**
 * POST /api/create-birthday
 * Body: { formData, questions, memories }
 * Returns: { slug } on success
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, questions, memories } = body;

    // ── Server-side validation ──────────────────────────────────────────────
    if (!formData?.birthdayPersonName?.trim()) {
      return NextResponse.json(
        { error: 'Birthday person\'s name is required.' },
        { status: 400 }
      );
    }

    if (!formData?.birthdayDate) {
      return NextResponse.json(
        { error: 'Birthday date is required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'At least one question is required.' },
        { status: 400 }
      );
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return NextResponse.json(
          { error: `Question ${i + 1} must have at least 2 options.` },
          { status: 400 }
        );
      }
      if (!q.options.some((o) => o.isCorrect)) {
        return NextResponse.json(
          { error: `Question ${i + 1} must have exactly one correct option.` },
          { status: 400 }
        );
      }
    }

    const supabaseAdmin = getAdminClient();

    // ── Generate unique slug ────────────────────────────────────────────────
    const slug = nanoid(8);

    // ── Insert birthday project ─────────────────────────────────────────────
    const { data: project, error: projectError } = await supabaseAdmin
      .from('birthday_projects')
      .insert({
        slug,
        birthday_person_name: formData.birthdayPersonName.trim(),
        birthday_date: formData.birthdayDate,
        welcome_message: formData.welcomeMessage?.trim() || null,
        final_message: formData.finalMessage?.trim() || null,
        music_url: formData.musicUrl?.trim() || null,
        theme: formData.theme || 'cute',
        unlock_question: formData.unlockQuestion?.trim() || null,
        unlock_answer: formData.unlockAnswer?.trim() || null,
      })
      .select()
      .single();

    if (projectError) {
      console.error('[API] Project insert error:', projectError);
      return NextResponse.json(
        { error: `Failed to save project: ${projectError.message}` },
        { status: 500 }
      );
    }

    // ── Insert questions + options ──────────────────────────────────────────
    for (const question of questions) {
      const correctIndex = question.options.findIndex((o) => o.isCorrect);

      const { data: questionData, error: questionError } = await supabaseAdmin
        .from('questions')
        .insert({
          project_id: project.id,
          question_text: question.questionText.trim(),
          correct_option_index: correctIndex,
        })
        .select()
        .single();

      if (questionError) {
        console.error('[API] Question insert error:', questionError);
        continue;
      }

      const optionsPayload = question.options.map((opt) => ({
        question_id: questionData.id,
        option_text: opt.text.trim(),
        is_correct: Boolean(opt.isCorrect),
        is_moving: Boolean(opt.isMoving),
      }));

      const { error: optionsError } = await supabaseAdmin
        .from('options')
        .insert(optionsPayload);

      if (optionsError) {
        console.error('[API] Options insert error:', optionsError);
      }
    }

    // ── Insert memories ─────────────────────────────────────────────────────
    if (Array.isArray(memories) && memories.length > 0) {
      const memoriesPayload = memories.map((mem) => ({
        project_id: project.id,
        title: mem.title?.trim() || 'Memory',
        memory_date: mem.date?.trim() || null,
        caption: mem.caption?.trim() || null,
        image_url: mem.imageUrl?.trim() || null,
      }));

      const { error: memoriesError } = await supabaseAdmin
        .from('memories')
        .insert(memoriesPayload);

      if (memoriesError) {
        console.error('[API] Memories insert error:', memoriesError);
        // Non-fatal — project was created successfully
      }
    }

    return NextResponse.json({ slug, success: true }, { status: 201 });
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
