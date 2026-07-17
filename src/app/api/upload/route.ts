import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = 'productos';

async function ensureBucketExists() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);
  
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productoId = formData.get('productoId') as string;
    const index = formData.get('index') as string || '0';

    if (!file || !productoId) {
      return NextResponse.json({ error: 'Missing file or productoId' }, { status: 400 });
    }

    // Ensure bucket exists
    await ensureBucketExists();

    // Upload file
    const extension = file.name.split('.').pop() || 'jpg';
    const ruta = `${productoId}/imagen_${index}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(ruta, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(ruta);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
