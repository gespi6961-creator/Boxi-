'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrecio } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcion_corta: string;
  precio_base: number;
  precio_oferta: number | null;
  imagen_url: string;
  imagenes: string[];
  caracteristicas: string[];
  destacado: boolean;
  categoria: { nombre: string; slug: string };
  variantes: {
    id: string;
    nombre: string;
    precio: number | null;
    stock: number;
  }[];
}

export default function ProductoDetallePage() {
  const params = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenActual, setImagenActual] = useState(0);
  const [agregando, setAgregando] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProducto() {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categoria:categorias(nombre, slug), variantes(id, nombre, precio, stock)')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error:', error);
      } else {
        setProducto(data);
        if (data.variantes?.length > 0) {
          setVarianteSeleccionada(data.variantes[0].id);
        }
      }
      setCargando(false);
    }
    cargarProducto();
  }, [params.id]);

  const handleAgregarCarrito = async () => {
    setAgregando(true);
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setAgregando(false);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Producto no encontrado</h1>
        <Link href="/catalogo" className="text-[#FF6B00] hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const varianteActual = producto.variantes?.find(v => v.id === varianteSeleccionada);
  const precioActual = varianteActual?.precio ?? producto.precio_oferta ?? producto.precio_base;
  const stock = varianteActual?.stock ?? 0;
  const tieneDescuento = producto.precio_oferta !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-[#FF6B00]">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-[#FF6B00]">Catálogo</Link>
        <span>/</span>
        <Link href={`/catalogo/${producto.categoria?.slug}`} className="hover:text-[#FF6B00]">
          {producto.categoria?.nombre}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A]">{producto.nombre}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Galería de imágenes */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-8xl">📦</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setImagenActual(i)}
                className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 transition-colors ${
                  imagenActual === i ? 'border-[#FF6B00]' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">📦</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info del producto */}
        <div>
          <Badge variant="info" size="md">{producto.categoria?.nombre}</Badge>
          
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-4">{producto.nombre}</h1>
          
          {producto.descripcion_corta && (
            <p className="text-lg text-gray-600 mt-2">{producto.descripcion_corta}</p>
          )}

          {/* Precio */}
          <div className="mt-6">
            {tieneDescuento ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#FF6B00]">
                  {formatPrecio(producto.precio_oferta!)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrecio(producto.precio_base)}
                </span>
                <Badge variant="danger" size="md">
                  -{Math.round((1 - producto.precio_oferta! / producto.precio_base) * 100)}%
                </Badge>
              </div>
            ) : (
              <span className="text-4xl font-bold text-[#1A1A1A]">
                {formatPrecio(producto.precio_base)}
              </span>
            )}
          </div>

          {/* Variantes */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Variante:</label>
              <div className="flex flex-wrap gap-2">
                {producto.variantes.map((variante) => (
                  <button
                    key={variante.id}
                    onClick={() => setVarianteSeleccionada(variante.id)}
                    disabled={variante.stock === 0}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      varianteSeleccionada === variante.id
                        ? 'border-[#FF6B00] bg-[#FF6B00] text-white'
                        : variante.stock === 0
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-[#FF6B00]'
                    }`}
                  >
                    {variante.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-4">
            {stock > 0 ? (
              <span className="text-green-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                En stock ({stock} disponibles)
              </span>
            ) : (
              <span className="text-red-600">Agotado</span>
            )}
          </div>

          {/* Cantidad y agregar al carrito */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="px-4 py-3 hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-medium">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                className="px-4 py-3 hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAgregarCarrito}
              disabled={stock === 0 || agregando}
              loading={agregando}
              className="flex-1"
              size="lg"
            >
              {agregado ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  ¡Agregado!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </>
              )}
            </Button>
          </div>

          {/* Botones extra */}
          <div className="mt-4 flex gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B00]">
              <Heart className="w-5 h-5" />
              Favorito
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B00]">
              <Share2 className="w-5 h-5" />
              Compartir
            </button>
          </div>

          {/* Beneficios */}
          <div className="mt-8 border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Truck className="w-5 h-5 text-[#FF6B00]" />
              <span>Envío gratis en compras mayores a $500</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-5 h-5 text-[#FF6B00]" />
              <span>Garantía de 1 año</span>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción y características */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Descripción</h2>
        <div className="prose max-w-none text-gray-700">
          <p>{producto.descripcion || producto.descripcion_corta}</p>
        </div>

        {producto.caracteristicas && producto.caracteristicas.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Características</h3>
            <ul className="grid sm:grid-cols-2 gap-2">
              {producto.caracteristicas.map((car, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-[#FF6B00]" />
                  {car}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Volver */}
      <div className="mt-12">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
