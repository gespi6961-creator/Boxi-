'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ProductoCard from '@/components/producto/ProductoCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string;
  precio_base: number;
  precio_oferta: number | null;
  imagen_url: string;
  categoria: { nombre: string };
}

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('novedad');
  const [cargando, setCargando] = useState(true);

  // Cargar categorías
  useEffect(() => {
    async function cargarCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('orden');
      if (data) setCategorias(data);
    }
    cargarCategorias();
  }, []);

  // Cargar productos
  useEffect(() => {
    async function cargarProductos() {
      setCargando(true);
      
      let query = supabase
        .from('productos')
        .select('*, categoria:categorias(nombre, slug)')
        .eq('activo', true);

      // Filtrar por categoría
      if (categoriaSeleccionada !== 'todas') {
        query = query.eq('categoria.slug', categoriaSeleccionada);
      }

      // Buscar por nombre
      if (busqueda) {
        query = query.ilike('nombre', `%${busqueda}%`);
      }

      // Ordenar
      switch (ordenar) {
        case 'precio_asc':
          query = query.order('precio_base', { ascending: true });
          break;
        case 'precio_desc':
          query = query.order('precio_base', { ascending: false });
          break;
        case 'novedad':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error:', error);
      } else {
        setProductos(data || []);
      }
      setCargando(false);
    }
    cargarProductos();
  }, [categoriaSeleccionada, busqueda, ordenar]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Catálogo</h1>
        <p className="text-gray-600 mt-1">Explora todos nuestros productos</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filtros */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            {/* Búsqueda */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <h3 className="font-semibold text-[#1A1A1A] mb-4">Categorías</h3>
            <div className="space-y-2">
              <button
                onClick={() => setCategoriaSeleccionada('todas')}
                className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  categoriaSeleccionada === 'todas'
                    ? 'bg-[#FF6B00] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Todas
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setCategoriaSeleccionada(cat.slug)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    categoriaSeleccionada === cat.slug
                      ? 'bg-[#FF6B00] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Barra de herramientas */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
            <p className="text-sm text-gray-600">
              {cargando ? 'Cargando...' : `${productos.length} productos`}
            </p>

            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            >
              <option value="novedad">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </div>

          {/* Grid de productos */}
          {cargando ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
