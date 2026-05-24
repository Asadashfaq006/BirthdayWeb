import { NextResponse } from 'next/server';
import { addReaction, getReactionCounts } from '@/lib/birthdayService';

const VALID_REACTIONS = ['❤️', '😂', '😭', '🎂'];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const counts = await getReactionCounts(projectId);
    return NextResponse.json({ counts });
  } catch (error) {
    console.error('[API] Reactions GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectId, reactionType } = body;

    if (!projectId || !reactionType) {
      return NextResponse.json(
        { error: 'projectId and reactionType are required' },
        { status: 400 }
      );
    }

    // Only allow whitelisted reaction types
    if (!VALID_REACTIONS.includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const entry = await addReaction({
      project_id: projectId,
      reaction_type: reactionType,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('[API] Reactions POST error:', error);
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 });
  }
}
