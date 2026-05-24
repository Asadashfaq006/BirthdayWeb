import { NextResponse } from 'next/server';
import {
  createGuestBookMessage,
  getGuestBookMessages,
} from '@/lib/birthdayService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const messages = await getGuestBookMessages(projectId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('[API] Guestbook GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectId, name, message, emoji } = body;

    if (!projectId || !name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'projectId, name, and message are required' },
        { status: 400 }
      );
    }

    // Input length limits
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedMessage = message.trim().slice(0, 500);
    const sanitizedEmoji = (emoji || '❤️').slice(0, 10);

    const entry = await createGuestBookMessage({
      project_id: projectId,
      name: sanitizedName,
      message: sanitizedMessage,
      emoji: sanitizedEmoji,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('[API] Guestbook POST error:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
