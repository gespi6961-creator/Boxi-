'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, Search, ChevronDown, ChevronUp, Tag, Package, Percent } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ProductoCard from '@/components/producto/ProductoCard';
import Button from '@/components/ui/Button';

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
  
  // Filtros avanzados
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [soloOfertas, setSoloOfertas] = useState(false);
  
  // UI
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [seccionFiltro, setSeccionFiltro] = useState<string | null>(null);

  // Contar filtros activos
  const filtrosActivos = [
    precioMin !== '',
    precioMax !== '',
    soloEnStock,
    soloOfertas,
  ].filter(Boolean).length;

  const limpiarFiltros = () => {
    setPrecioMin('');
    setPrecioMax('');
    setSoloEnStock(false);
    setSoloOfertas(false);
  };

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

      // Filtro rango de precio
      if (precioMin) {
        query = query.gte('precio_base', parseFloat(precioMin));
      }
      if (precioMax) {
        query = query.lte('precio_base', parseFloat(precioMax));
      }

      // Solo en stock
      if (soloEnStock) {
        query = query.gt('stock', 0);
      }

      // Solo ofertas
      if (soloOfertas) {
        query = query.not('precio_oferta', 'is', null);
      }

      // Ordenar
      switch (ordenar) {
        case 'precio_asc':
          query = query.order('precio_base', { ascending: true });
          break;
        case 'precio_desc':
          query = query.order('precio_base', { ascending: false });
          break;
        case 'ofertas':
          query = query.not('precio_oferta', 'is', null).order('precio_base', { ascending: true });
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
  }, [categoriaSeleccionada, busqueda, ordenar, precioMin, precioMax, soloEnStock, soloOfertas]);

  const toggleSeccion = (seccion: string) => {
    setSeccionFiltro(seccionFiltro === seccion ? null : seccion);
  };

  // Panel de filtros (compartido entre sidebar y drawer)
  const FiltrosContent = () => (
    <div className="space-y-6">
      {/* Filtro por precio */}
      <div>
        <button
          onClick={() => toggleSeccion('precio')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A]"
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#FF6B00]" />
            Precio
          </span>
          {seccionFiltro === 'precio' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'precio' && (
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              min="0"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              min="0"
            />
          </div>
        )}
      </div>

      {/* Filtro por stock */}
      <div>
        <button
          onClick={() => toggleSeccion('stock')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A]"
        >
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#FF6B00]" />
            Disponibilidad
          </span>
          {seccionFiltro === 'stock' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'stock' && (
          <label className="mt-3 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soloEnStock}
              onChange={(e) => setSoloEnStock(e.target.checked)}
              className="w-4 h-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
            />
            <span className="text-sm text-gray-700">Solo en stock</span>
          </label>
        )}
      </div>

      {/* Filtro por ofertas */}
      <div>
        <button
          onClick={() => toggleSeccion('ofertas')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A]"
        >
          <span className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#FF6B00]" />
            Ofertas
          </span>
          {seccionFiltro === 'ofertas' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'ofertas' && (
          <label className="mt-3 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soloOfertas}
              onChange={(e) => setSoloOfertas(e.target.checked)}
              className="w-4 h-4 text-[#FF6B00] border-gray-300 rounded focus:ring-[#FF6B00]"
            />
            <span className="text-sm text-gray-700">Solo productos en oferta</span>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Catálogo</h1>
        <p className="text-gray-600 mt-1">Explora todos nuestros productos</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filtros - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1A1A1A]">Filtros</h3>
              {filtrosActivos > 0 && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs text-[#FF6B00] hover:underline"
                >
                  Limpiar ({filtrosActivos})
                </button>
              )}
            </div>

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

            {/* Categorías */}
            <div className="mb-6">
              <h4 className="font-medium text-[#1A1A1A] mb-3">Categorías</h4>
              <div className="space-y-1">
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

            {/* Filtros avanzados */}
            <FiltrosContent />
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Barra de herramientas */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              {/* Botón filtros móvil */}
              <button
                onClick={() => setDrawerAbierto(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="bg-[#FF6B00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {filtrosActivos}
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-600">
                {cargando ? 'Cargando...' : `${productos.length} productos`}
              </p>

              {/* Filtros activos como chips */}
              {filtrosActivos > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  {precioMin && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-[#FF6B00] rounded-full text-xs">
                      Min: ${precioMin}
                      <button onClick={() => setPrecioMin('')} className="hover:text-[#CC5500]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {precioMax && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-[#FF6B00] rounded-full text-xs">
                      Max: ${precioMax}
                      <button onClick={() => setPrecioMax('')} className="hover:text-[#CC5500]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {soloEnStock && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-[#FF6B00] rounded-full text-xs">
                      En stock
                      <button onClick={() => setSoloEnStock(false)} className="hover:text-[#CC5500]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {soloOfertas && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-[#FF6B00] rounded-full text-xs">
                      Ofertas
                      <button onClick={() => setSoloOfertas(false)} className="hover:text-[#CC5500]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            >
              <option value="novedad">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="ofertas">Solo ofertas</option>
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
              <p className="text-gray-600 mb-4">No se encontraron productos con esos filtros</p>
              <Button onClick={limpiarFiltros} variant="outline" size="sm">
                Limpiar filtros
              </Button>
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

      {/* Drawer filtros - Mobile */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerAbierto(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Filtros</h2>
                <button
                  onClick={() => setDrawerAbierto(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Búsqueda en drawer */}
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

              {/* Categorías en drawer */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1A1A1A] mb-3">Categorías</h4>
                <div className="space-y-1">
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

              {/* Filtros avanzados en drawer */}
              <FiltrosContent />

              {/* Botones drawer */}
              <div className="mt-6 flex gap-3">
                <Button onClick={limpiarFiltros} variant="outline" className="flex-1">
                  Limpiar
                </Button>
                <Button onClick={() => setDrawerAbierto(false)} className="flex-1">
                  Ver {productos.length} productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
