import { supabase } from './supabase';

const BUCKET_NAME = 'productos';

// Verificar si el bucket existe, si no crearlo
export async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some(b => b.name === BUCKET_NAME);
  
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }
  return true;
}

// Subir imagen de producto
export async function subirImagenProducto(
  archivo: File,
  productoId: string,
  index: number = 0
): Promise<string | null> {
  try {
    await ensureBucketExists();
    
    const extension = archivo.name.split('.').pop() || 'jpg';
    const ruta = `${productoId}/imagen_${index}.${extension}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(ruta, archivo, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading:', error);
      return null;
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(ruta);

    return data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}

// Eliminar imagen de producto
export async function eliminarImagenProducto(ruta: string): Promise<boolean> {
  try {
    // Extraer la ruta relativa del URL completo
    const urlParts = ruta.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;
    
    const rutaRelativa = urlParts[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([rutaRelativa]);

    return !error;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

// Obtener URL pública de imagen
export function getImagenPublicUrl(ruta: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(ruta);
  
  return data.publicUrl;
}
