'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, Search, ChevronDown, ChevronUp, Tag, Package, Percent, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import ProductoCard from '@/components/producto/ProductoCard';
import Button from '@/components/ui/Button';
import { formatPrecio } from '@/lib/utils';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  icono?: string;
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

function CatalogoContent() {
  const searchParams = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(() => searchParams.get('categoria') || 'todas');
  const [busqueda, setBusqueda] = useState(() => searchParams.get('busqueda') || '');
  const [ordenar, setOrdenar] = useState('novedad');
  const [cargando, setCargando] = useState(true);
  
  // Filtros avanzados
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [soloOfertas, setSoloOfertas] = useState(() => searchParams.get('ofertas') === 'true');
  
  // UI
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [seccionFiltro, setSeccionFiltro] = useState<string | null>(null);
  const [busquedaVisible, setBusquedaVisible] = useState(false);

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

  // Sincronizar parámetros de URL
  useEffect(() => {
    const cat = searchParams.get('categoria');
    const busq = searchParams.get('busqueda');
    const ofertas = searchParams.get('ofertas');
    if (cat) setCategoriaSeleccionada(cat);
    if (busq) setBusqueda(busq);
    if (ofertas === 'true') setSoloOfertas(true);
  }, [searchParams]);

  // Cargar categorías
  useEffect(() => {
    async function cargarCategorias() {
      const supabase = getSupabase();
      const { data } = await supabase.from('categorias').select('*').order('orden');
      if (data) setCategorias(data);
    }
    cargarCategorias();
  }, []);

  // Cargar productos
  useEffect(() => {
    async function cargarProductos() {
      const supabase = getSupabase();
      setCargando(true);
      
      let query = supabase
        .from('productos')
        .select('*, categoria:categorias(id, nombre, slug)')
        .eq('activo', true);

      if (categoriaSeleccionada !== 'todas') {
        const cat = categorias.find(c => c.slug === categoriaSeleccionada);
        if (cat) {
          query = query.eq('categoria_id', cat.id);
        }
      }

      if (busqueda) {
        query = query.or(`nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%,descripcion_corta.ilike.%${busqueda}%`);
      }

      if (precioMin) {
        query = query.gte('precio_base', parseFloat(precioMin));
      }
      if (precioMax) {
        query = query.lte('precio_base', parseFloat(precioMax));
      }

      if (soloEnStock) {
        query = query.gt('stock', 0);
      }

      if (soloOfertas) {
        query = query.not('precio_oferta', 'is', null);
      }

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
  }, [categoriaSeleccionada, categorias, busqueda, ordenar, precioMin, precioMax, soloEnStock, soloOfertas]);

  const toggleSeccion = (seccion: string) => {
    setSeccionFiltro(seccionFiltro === seccion ? null : seccion);
  };

  const iconosCategoria: Record<string, string> = {
    'iluminacion': '💡',
    'tecnologia-y-accesorios': '📱',
    'automotriz': '🚗',
    'bocinas-y-audio': '🔊',
    'gaming': '🎮',
    'default': '📦',
  };

  // Panel de filtros
  const FiltrosContent = () => (
    <div className="space-y-4">
      <div>
        <button
          onClick={() => toggleSeccion('precio')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A] py-2"
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#C85A00]" />
            Precio
          </span>
          {seccionFiltro === 'precio' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'precio' && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              min="0"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              min="0"
            />
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => toggleSeccion('stock')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A] py-2"
        >
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#C85A00]" />
            Disponibilidad
          </span>
          {seccionFiltro === 'stock' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'stock' && (
          <label className="mt-2 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soloEnStock}
              onChange={(e) => setSoloEnStock(e.target.checked)}
              className="w-4 h-4 text-[#C85A00] border-gray-300 rounded focus:ring-[#C85A00]"
            />
            <span className="text-sm text-gray-700">Solo en stock</span>
          </label>
        )}
      </div>

      <div>
        <button
          onClick={() => toggleSeccion('ofertas')}
          className="w-full flex items-center justify-between font-medium text-[#1A1A1A] py-2"
        >
          <span className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-[#C85A00]" />
            Ofertas
          </span>
          {seccionFiltro === 'ofertas' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {seccionFiltro === 'ofertas' && (
          <label className="mt-2 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soloOfertas}
              onChange={(e) => setSoloOfertas(e.target.checked)}
              className="w-4 h-4 text-[#C85A00] border-gray-300 rounded focus:ring-[#C85A00]"
            />
            <span className="text-sm text-gray-700">Solo productos en oferta</span>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header movil optimizado */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Titulo y busqueda */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A]">Catalogo</h1>
              <p className="text-xs text-gray-500">{productos.length} productos disponibles</p>
            </div>
            <button
              onClick={() => setBusquedaVisible(!busquedaVisible)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Barra de busqueda expandible */}
          {busquedaVisible && (
            <div className="relative mb-3 animate-in slide-in-from-top">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00] focus:border-transparent bg-gray-50"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Categorias scroll horizontal en movil */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setCategoriaSeleccionada('todas')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoriaSeleccionada === 'todas'
                  ? 'bg-[#C85A00] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategoriaSeleccionada(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  categoriaSeleccionada === cat.slug
                    ? 'bg-[#C85A00] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{iconosCategoria[cat.slug] || iconosCategoria.default}</span>
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Barra de herramientas */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => setDrawerAbierto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
            {filtrosActivos > 0 && (
              <span className="bg-[#C85A00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {filtrosActivos}
              </span>
            )}
          </button>

          <select
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            className="px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A00] shadow-sm"
          >
            <option value="novedad">Mas recientes</option>
            <option value="precio_asc">Menor precio</option>
            <option value="precio_desc">Mayor precio</option>
            <option value="ofertas">Ofertas</option>
          </select>
        </div>

        {/* Filtros activos */}
        {filtrosActivos > 0 && (
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {precioMin && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-[#C85A00] rounded-full text-xs font-medium whitespace-nowrap">
                Min: {formatPrecio(parseFloat(precioMin))}
                <button onClick={() => setPrecioMin('')} className="hover:text-[#A04800]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {precioMax && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-[#C85A00] rounded-full text-xs font-medium whitespace-nowrap">
                Max: {formatPrecio(parseFloat(precioMax))}
                <button onClick={() => setPrecioMax('')} className="hover:text-[#A04800]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {soloEnStock && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-[#C85A00] rounded-full text-xs font-medium whitespace-nowrap">
                En stock
                <button onClick={() => setSoloEnStock(false)} className="hover:text-[#A04800]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {soloOfertas && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-[#C85A00] rounded-full text-xs font-medium whitespace-nowrap">
                Ofertas
                <button onClick={() => setSoloOfertas(false)} className="hover:text-[#A04800]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={limpiarFiltros}
              className="text-xs text-[#C85A00] hover:underline font-medium whitespace-nowrap"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Grid de productos */}
        {cargando ? (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-[#C85A00] border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No encontramos productos</h3>
            <p className="text-gray-500 mb-6">Intenta con otros filtros o busqueda</p>
            <Button onClick={limpiarFiltros} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}

        {/* Envio gratis banner */}
        {!cargando && productos.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-[#C85A00] to-[#E07000] rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold text-lg">Envio gratis</span>
            </div>
            <p className="text-sm text-orange-100">En compras mayores a $1,000 MXN</p>
          </div>
        )}
      </div>

      {/* Drawer filtros - Mobile */}
      {drawerAbierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerAbierto(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Filtros</h2>
                <button
                  onClick={() => setDrawerAbierto(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Busqueda en drawer */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
                />
              </div>

              {/* Categorias en drawer */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1A1A1A] mb-3">Categorias</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCategoriaSeleccionada('todas')}
                    className={`block w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                      categoriaSeleccionada === 'todas'
                        ? 'bg-[#C85A00] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Todos
                  </button>
                  {categorias.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setCategoriaSeleccionada(cat.slug)}
                      className={`block w-full text-left px-3 py-2.5 rounded-xl transition-colors flex items-center gap-2 ${
                        categoriaSeleccionada === cat.slug
                          ? 'bg-[#C85A00] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{iconosCategoria[cat.slug] || iconosCategoria.default}</span>
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              <FiltrosContent />

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

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#C85A00] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando catalogo...</p>
        </div>
      </div>
    }>
      <CatalogoContent />
    </Suspense>
  );
}
