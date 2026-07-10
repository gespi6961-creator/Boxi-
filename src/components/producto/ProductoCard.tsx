'use client';

import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { formatPrecio } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductoCardProps {
  producto: {
    id: string;
    nombre: string;
    slug: string;
    descripcion_corta: string | null;
    precio_base: number;
    precio_oferta: number | null;
    imagen_url: string | null;
    categoria?: { nombre: string };
  };
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const tieneDescuento = producto.precio_oferta !== null;
  const descuento = tieneDescuento
    ? Math.round((1 - producto.precio_oferta! / producto.precio_base) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group">
      {/* Imagen */}
      <Link href={`/producto/${producto.id}`} className="block relative aspect-square bg-gray-100">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          {/* Placeholder para imagen */}
          <span className="text-6xl">📦</span>
        </div>
        
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

        {/* Botón agregar al carrito */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-[#FF6B00] text-white py-2 rounded-lg hover:bg-[#CC5500] transition-colors font-medium">
          <ShoppingCart className="w-4 h-4" />
          Agregar
        </button>
      </div>
    </div>
  );
}
