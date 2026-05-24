import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import BirthdayPage from '@/components/birthday/BirthdayPage';

/**
 * Server-side Supabase client for data fetching.
 * Uses service role key (server-only) to bypass RLS.
 */
function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createClient(url, key);
}

async function getBirthdayData(slug) {
  const supabase = getServerClient();

  // Fetch project
  const { data: project, error: projectError } = await supabase
    .from('birthday_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (projectError || !project) return null;

  // Fetch questions with their options (nested via foreign key relationship)
  const { data: questionsRaw } = await supabase
    .from('questions')
    .select('*, options(*)')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true });

  // Sort options within each question by created_at
  const questions = (questionsRaw || []).map((q) => ({
    ...q,
    options: (q.options || []).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    ),
  }));

  // Fetch memories
  const { data: memories } = await supabase
    .from('memories')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: true });

  return {
    project,
    questions,
    memories: memories || [],
  };
}

export async function generateMetadata({ params }) {
  const data = await getBirthdayData(params.slug);
  if (!data) {
    return { title: 'Surprise Not Found' };
  }
  return {
    title: `Happy Birthday, ${data.project.birthday_person_name}! 🎂`,
    description: `A special birthday surprise created just for ${data.project.birthday_person_name}`,
  };
}

export default async function BirthdaySlugPage({ params }) {
  const data = await getBirthdayData(params.slug);

  if (!data) {
    notFound();
  }

  return (
    <BirthdayPage
      project={data.project}
      questions={data.questions}
      memories={data.memories}
    />
  );
}
