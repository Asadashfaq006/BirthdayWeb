import { NextResponse } from 'next/server';

/** Fallback messages when no OpenAI API key is configured */
const FALLBACK = {
  funny: (name) =>
    `Happy Birthday ${name}! You're not getting older — you're just becoming a vintage edition. Like fine cheese, you smell stronger every year. 😂 Here's to another lap around the sun full of chaos, laughter, and questionable decisions. Cheers! 🎉`,
  emotional: (name) =>
    `Dear ${name},\n\nOn this special day I want you to know how deeply you are loved. You have filled so many lives with warmth, laughter, and kindness that words can barely capture it. Every year you grow more wonderful, and every year the world is a better place because you're in it.\n\nHappy Birthday — you deserve every joy that this day and year bring. 💕`,
  romantic: (name) =>
    `${name}, every single day with you feels like a gift I never deserve but am so grateful for. On your birthday I want to remind you that you are extraordinary — not just to me, but to everyone lucky enough to know you. You make ordinary moments magical and difficult days bearable.\n\nHappy Birthday, my love. Here's to forever. ❤️`,
  friendly: (name) =>
    `HAPPY BIRTHDAY ${name}!! 🎉🎂🥳\n\nAnother year older, another year more amazing! You deserve ALL the cake today and zero responsibilities. Thank you for being the kind of friend that makes every moment better just by being there. Here's to the best year yet — let's celebrate! 🎊✨`,
};

export async function POST(request) {
  let parsedBody = {};
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const { name, relationship, tone, keywords } = parsedBody;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const validTones = ['funny', 'emotional', 'romantic', 'friendly'];
    const selectedTone = validTones.includes(tone) ? tone : 'friendly';

    const apiKey = process.env.OPENAI_API_KEY; // server-side only — never exposed to client

    if (!apiKey) {
      // Return pre-written fallback message
      return NextResponse.json({
        message: FALLBACK[selectedTone](name.trim()),
        isFallback: true,
      });
    }

    // ── OpenAI generation ──────────────────────────────────────────────────
    const systemPrompt =
      'You are a creative birthday message writer. Write heartfelt, personalized birthday messages. Be concise — 80–140 words. Return only the message, no title, no label.';

    const userPrompt = [
      `Write a ${selectedTone} birthday message for ${name.trim()}.`,
      relationship ? `The sender is their ${relationship}.` : '',
      keywords ? `Include references to: ${keywords}.` : '',
      `Tone: ${selectedTone}. Be specific and personal, not generic.`,
    ]
      .filter(Boolean)
      .join(' ');

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 250,
        temperature: 0.85,
      }),
    });

    if (!openaiRes.ok) {
      throw new Error(`OpenAI ${openaiRes.status}`);
    }

    const data = await openaiRes.json();
    const message = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ message, isFallback: false });
  } catch (error) {
    console.error('[API] generate-birthday-message error:', error);
    // Fall back gracefully on any error
    const name = parsedBody?.name?.trim() || 'you';
    const tone = parsedBody?.tone || 'friendly';
    const validTones = ['funny', 'emotional', 'romantic', 'friendly'];
    const selectedTone = validTones.includes(tone) ? tone : 'friendly';

    return NextResponse.json({
      message: FALLBACK[selectedTone](name),
      isFallback: true,
    });
  }
}
