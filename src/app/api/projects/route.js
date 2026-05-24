import { NextResponse } from 'next/server';
import { getAllProjects, deleteProject } from '@/lib/birthdayService';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('[API] Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Projects DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
