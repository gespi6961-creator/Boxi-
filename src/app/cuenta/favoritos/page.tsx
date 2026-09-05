'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useFavoritos } from '@/hooks/useFavoritos';
import { useCarrito } from '@/hooks/useCarrito';
import { getSupabase } from '@/lib/supabase';
import { formatPrecio } from '@/lib/utils';

export default function FavoritosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { favoritos, toggleFavorito } = useFavoritos();
  const { agregar } = useCarrito();
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function cargarFavoritos() {
      if (favoritos.length === 0) {
        setProductos([]);
        setCargando(false);
        return;
      }
      const supabase = getSupabase();

      const { data } = await supabase
        .from('productos')
        .select('id, nombre, slug, precio_base, precio_oferta, imagen_url, descripcion_corta')
        .in('id', favoritos);

      setProductos(data || []);
      setCargando(false);
    }

    cargarFavoritos();
  }, [favoritos]);

  const handleAgregarCarrito = (producto: any) => {
    const productoCompleto = {
      id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug,
      descripcion: null,
      descripcion_corta: producto.descripcion_corta,
      precio_base: producto.precio_base,
      precio_oferta: producto.precio_oferta,
      imagen_url: producto.imagen_url,
      imagenes: producto.imagen_url ? [producto.imagen_url] : [],
      categoria_id: '',
      caracteristicas: [],
      activo: true,
      destacado: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    agregar(productoCompleto, null, 1);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/cuenta" className="inline-flex items-center text-[#C85A00] hover:text-[#A04800] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a Mi Cuenta
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Mis Favoritos</h1>

      {cargando ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : productos.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">No tienes favoritos aún</h2>
          <p className="text-gray-500 mb-6">Marca productos con el corazón para verlos aquí</p>
          <Link href="/catalogo" className="inline-block bg-[#C85A00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A04800] transition-colors">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((producto) => {
            const precio = producto.precio_oferta ?? producto.precio_base;
            return (
              <div key={producto.id} className="bg-white border rounded-xl overflow-hidden">
                <Link href={`/producto/${producto.id}`} className="block relative aspect-square bg-gray-100">
                  {producto.imagen_url ? (
                    <Image
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      quality={75}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-5xl">📦</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/producto/${producto.id}`}>
                    <h3 className="font-semibold text-[#1A1A1A] hover:text-[#C85A00] transition-colors line-clamp-2">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-[#C85A00] mt-2">{formatPrecio(precio)}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAgregarCarrito(producto)}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#C85A00] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#A04800] transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </button>
                    <button
                      onClick={() => toggleFavorito(producto.id)}
                      aria-label="Eliminar de favoritos"
                      className="flex items-center justify-center bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
