import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const BUCKET_NAME = process.env.SUPABASE_MEMORY_IMAGES_BUCKET || 'memory-images';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

async function ensureBucketIsPublic(supabase) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw listError;
  }

  const existingBucket = (buckets || []).find((bucket) => bucket.name === BUCKET_NAME);

  if (!existingBucket) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    });

    if (createError) {
      throw createError;
    }

    return;
  }

  if (!existingBucket.public) {
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_IMAGE_SIZE_BYTES,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    });

    if (updateError) {
      throw updateError;
    }
  }
}

function sanitizeFileName(fileName) {
  const lower = fileName.toLowerCase();
  return lower.replace(/[^a-z0-9._-]/g, '-');
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Image is too large. Max size is 5MB.' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getAdminClient();
    await ensureBucketIsPublic(supabaseAdmin);

    const safeName = sanitizeFileName(file.name || 'memory-image');
    const filePath = `${new Date().toISOString().slice(0, 10)}/${nanoid(10)}-${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('[API] Memory image upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image. Please try again.' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      return NextResponse.json(
        { error: 'Image uploaded but URL generation failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error('[API] Unexpected upload-memory-image error:', error);
    return NextResponse.json(
      { error: 'Unexpected upload error. Please try again.' },
      { status: 500 }
    );
  }
}
