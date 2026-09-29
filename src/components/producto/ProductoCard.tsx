'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { formatPrecio } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useCarrito } from '@/hooks/useCarrito';
import { useFavoritos } from '@/hooks/useFavoritos';
import { useState } from 'react';

interface ProductoCardProps {
  producto: {
    id: string;
    nombre: string;
    slug?: string;
    descripcion_corta: string | null;
    precio_base: number;
    precio_oferta: number | null;
    imagen_url: string | null;
    categoria?: { nombre: string };
  };
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const { agregar } = useCarrito();
  const { toggleFavorito, esFavorito } = useFavoritos();
  const [agregado, setAgregado] = useState(false);
  const favorito = esFavorito(producto.id);

  const tieneDescuento = producto.precio_oferta !== null;
  const descuento = tieneDescuento
    ? Math.round((1 - producto.precio_oferta! / producto.precio_base) * 100)
    : 0;

  const handleAgregar = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const productoCompleto = {
      id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug || producto.nombre.toLowerCase().replace(/\s+/g, '-'),
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
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group relative">
      {/* Boton favorito */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorito(producto.id); }}
        aria-label={favorito ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
        className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-colors"
      >
        <Heart className={`w-4 h-4 ${favorito ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
      </button>

      {/* Imagen optimizada con next/image */}
      <Link href={`/producto/${producto.id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            quality={85}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2YzZjRmNiIvPgo8L3N2Zz4="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {tieneDescuento && (
            <Badge variant="danger" size="md">
              -{descuento}%
            </Badge>
          )}
          {producto.categoria && (
            <Badge variant="info" size="sm">
              {producto.categoria.nombre}
            </Badge>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Eye className="w-6 h-6 text-[#1A1A1A]" />
            </div>
          </div>
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4">
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-semibold text-[#1A1A1A] hover:text-[#FF6B00] transition-colors line-clamp-2">
            {producto.nombre}
          </h3>
        </Link>
        
        {producto.descripcion_corta && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {producto.descripcion_corta}
          </p>
        )}

        {/* Precio */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {tieneDescuento ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#FF6B00]">
                  {formatPrecio(producto.precio_oferta!)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrecio(producto.precio_base)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#1A1A1A]">
                {formatPrecio(producto.precio_base)}
              </span>
            )}
          </div>
        </div>

        {/* Boton agregar al carrito */}
        <button
          onClick={handleAgregar}
          className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors font-medium ${
            agregado
              ? 'bg-green-500 text-white'
              : 'bg-[#FF6B00] text-white hover:bg-[#CC5500]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {agregado ? '¡Agregado!' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
