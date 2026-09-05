import { getSupabaseAdmin } from '@/lib/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const BUCKET_NAME = 'productos';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function ensureBucketExists() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);
  
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }
  return true;
}

async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  try {
    const cookieStore = request.cookies;
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const ADMIN_EMAILS = ['gespi6961@gmail.com'];
    return !!user && ADMIN_EMAILS.includes(user.email || '');
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    // Verificar autenticación de admin
    const isAuthenticated = await verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productoId = formData.get('productoId') as string;
    const index = formData.get('index') as string || '0';

    if (!file || !productoId) {
      return NextResponse.json({ error: 'Missing file or productoId' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Use: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Archivo demasiado grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Sanitizar productoId para prevenir path traversal
    const sanitizedId = productoId.replace(/[^a-zA-Z0-9-_]/g, '');
    if (!sanitizedId) {
      return NextResponse.json({ error: 'Invalid productoId' }, { status: 400 });
    }

    await ensureBucketExists();

    const extension = file.name.split('.').pop() || 'jpg';
    const ruta = `${sanitizedId}/imagen_${index}.${extension}`;

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

    const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(ruta);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
