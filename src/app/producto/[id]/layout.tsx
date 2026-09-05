import { Metadata } from 'next';
import { getSupabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = getSupabase();
  
  const { data: producto } = await supabase
    .from('productos')
    .select('nombre, descripcion_corta, precio_base, precio_oferta, imagen_url, categoria:categorias(nombre)')
    .eq('id', id)
    .single();

  if (!producto) {
    return {
      title: 'Producto no encontrado | BoxiTec',
    };
  }

  const categoria = Array.isArray(producto.categoria) ? producto.categoria[0] : producto.categoria;
  const precio = producto.precio_oferta || producto.precio_base;
  const titulo = `${producto.nombre} | BoxiTec - ${categoria?.nombre || 'Tecnologia'}`;
  const descripcion = producto.descripcion_corta 
    ? `${producto.descripcion_corta} | Precio: $${precio} MXN | Envio gratis en compras +$1,000`
    : `${producto.nombre} en BoxiTec por $${precio} MXN. Envio gratis en compras mayores a $1,000 MXN.`;

  return {
    title: titulo,
    description: descripcion,
    keywords: [
      producto.nombre,
      categoria?.nombre || 'tecnologia',
      'boxitec',
      'envio gratis',
      'mexico',
      'comprar online',
    ],
    openGraph: {
      title: titulo,
      description: descripcion,
      url: `https://boxi-store.vercel.app/producto/${id}`,
      siteName: 'BoxiTec',
      locale: 'es_MX',
      type: 'website',
      images: producto.imagen_url ? [
        {
          url: producto.imagen_url,
          width: 800,
          height: 800,
          alt: producto.nombre,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descripcion,
      images: producto.imagen_url ? [producto.imagen_url] : [],
    },
    alternates: {
      canonical: `https://boxi-store.vercel.app/producto/${id}`,
    },
  };
}

export default function ProductoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
