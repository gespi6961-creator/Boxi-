'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Shield, Truck, CreditCard } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import ProductoCard from '@/components/producto/ProductoCard';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  imagen_url_2: string | null;
  imagen_url_3: string | null;
  orden: number;
  activa: boolean;
  cantidad?: number;
  productos?: Array<{ count: number }>;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  precio_base: number;
  precio_oferta: number | null;
  imagen_url: string | null;
  imagen_url_2: string | null;
  imagen_url_3: string | null;
  destacado: boolean;
  activo: boolean;
  categoria: { nombre: string };
}

export default function HomePage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      const supabase = getSupabase();
      const { data: cats } = await supabase
        .from('categorias')
        .select('*, productos:productos(count)')
        .eq('activa', true)
        .order('orden');
      
      if (cats) {
        const catsConCantidad = cats
          .map((cat) => ({
            ...cat,
            cantidad: Array.isArray(cat.productos) ? cat.productos.length : 0,
          }))
          .filter((c) => c.cantidad > 0);
        setCategorias(catsConCantidad);
      }

      const { data: prods } = await supabase
        .from('productos')
        .select('*, categoria:categorias(nombre)')
        .eq('activo', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (prods) {
        const mapped = prods.map(p => ({
          ...p,
          categoria: Array.isArray(p.categoria) ? p.categoria[0] : p.categoria
        }));
        setProductosDestacados(mapped);
      }
    }
    cargarDatos();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#C85A00] to-[#A04800] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Donde la tecnología cobra vida
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100">
                Descubre gadgets innovadores, accesorios inteligentes y todo lo que 
                necesitas para cada momento de tu día.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#C85A00] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Ver Catálogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/catalogo?ofertas=true"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Ver Ofertas
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-8xl">BoxiTec</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de beneficios */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Truck className="w-5 h-5 text-[#C85A00]" />
              <span className="text-sm">Envío gratis +$1,000</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Shield className="w-5 h-5 text-[#C85A00]" />
              <span className="text-sm">Garantía incluida</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <CreditCard className="w-5 h-5 text-[#C85A00]" />
              <span className="text-sm">Transferencia bancaria</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Zap className="w-5 h-5 text-[#C85A00]" />
              <span className="text-sm">Entrega rápida</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1A1A1A]">Explora por Categoría</h2>
            <p className="text-gray-600 mt-2">Encuentra lo que necesitas</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo?categoria=${cat.slug}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group"
              >
                {cat.imagen_url ? (
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <Image
                      src={cat.imagen_url}
                      alt={cat.nombre}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      quality={80}
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#C85A00]/10 to-[#C85A00]/5 flex items-center justify-center">
                    <span className="text-[#C85A00] text-4xl font-bold opacity-30">{cat.nombre.charAt(0)}</span>
                  </div>
                )}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-[#1A1A1A]">{cat.nombre}</h3>
                  {cat.descripcion && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cat.descripcion}</p>
                  )}
                  <p className="text-xs text-[#C85A00] font-medium mt-2">{cat.cantidad} productos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Productos Destacados</h2>
              <p className="text-gray-600 mt-1">Los más populares de BoxiTec</p>
            </div>
            <Link
              href="/catalogo"
              className="text-[#C85A00] hover:text-[#A04800] font-medium flex items-center"
            >
              Ver todo
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosDestacados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-16 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para la tecnología?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Suscríbete y recibe ofertas exclusivas, nuevos productos y descuentos 
            especiales directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C85A00] focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#C85A00] text-white font-semibold rounded-xl hover:bg-[#A04800] transition-all hover:scale-105 shadow-lg shadow-[#C85A00]/25"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
