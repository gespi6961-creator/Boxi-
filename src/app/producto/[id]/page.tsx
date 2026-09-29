'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, Truck, Shield, ArrowLeft, Plus, Minus, Check, MessageCircle, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { formatPrecio } from '@/lib/utils';
import { useCarrito } from '@/hooks/useCarrito';
import { useFavoritos } from '@/hooks/useFavoritos';

export default function ProductoDetallePage() {
  const params = useParams();
  const { agregar } = useCarrito();
  const { toggleFavorito, esFavorito } = useFavoritos();
  const [producto, setProducto] = useState<{
    id: string;
    nombre: string;
    slug: string;
    descripcion: string | null;
    descripcion_corta: string | null;
    precio_base: number;
    precio_oferta: number | null;
    imagen_url: string | null;
    imagen_url_2: string | null;
    imagen_url_3: string | null;
    categoria_id: string;
    caracteristicas: string[];
    activo: boolean;
    destacado: boolean;
    created_at: string;
    updated_at: string;
    categoria?: { nombre: string; slug: string };
    variantes?: Array<{ id: string; nombre: string; precio: number | null; stock: number }>;
  } | null>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<Array<{
    id: string;
    nombre: string;
    slug: string;
    precio_base: number;
    precio_oferta: number | null;
    imagen_url: string | null;
  }>>([]);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenActual, setImagenActual] = useState(0);
  const [agregando, setAgregando] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoRelacionados, setCargandoRelacionados] = useState(true);
  const [tabActiva, setTabActiva] = useState<'descripcion' | 'specs' | 'envio'>('descripcion');
  const [zoomActivo, setZoomActivo] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function cargarProducto() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('productos')
        .select('*, categoria:categorias(nombre, slug), variantes(id, nombre, precio, stock)')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setProducto(data);
        if (data.variantes?.length > 0) {
          setVarianteSeleccionada(data.variantes[0].id);
        }

        const { data: relacionados } = await supabase
          .from('productos')
          .select('id, nombre, slug, precio_base, precio_oferta, imagen_url')
          .eq('categoria_id', data.categoria_id)
          .neq('id', data.id)
          .limit(4);
        
        setProductosRelacionados(relacionados || []);
        setCargandoRelacionados(false);
      }
      setCargando(false);
    }
    cargarProducto();
  }, [params.id]);

  const handleAgregarCarrito = async () => {
    if (!producto) return;
    setAgregando(true);
    
    const variante = varianteSeleccionada 
      ? producto.variantes?.find((v) => v.id === varianteSeleccionada) ?? null
      : null;
    
    const productoConImagenes = {
      ...producto,
      imagenes: [producto.imagen_url, producto.imagen_url_2, producto.imagen_url_3].filter((img): img is string => img !== null),
    } as Parameters<typeof agregar>[0];
    
    agregar(productoConImagenes, variante as Parameters<typeof agregar>[1], cantidad);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setAgregando(false);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const compartirWhatsApp = () => {
    const texto = `Hola, me interesa el producto: ${producto?.nombre} - ${formatPrecio(producto?.precio_oferta || producto?.precio_base || 0)}`;
    const url = `https://wa.me/526651423910?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
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
        <Link href="/catalogo" className="text-[#FF6B00] hover:underline">Volver al catalogo</Link>
      </div>
    );
  }

  const varianteActual = producto.variantes?.find((v) => v.id === varianteSeleccionada);
  const precioActual = varianteActual?.precio ?? producto.precio_oferta ?? producto.precio_base;
  const stock = varianteActual?.stock ?? ((producto.variantes?.length ?? 0) > 0 ? 0 : 0);
  const tieneDescuento = producto.precio_oferta !== null;
  const favorito = esFavorito(producto.id);

  const imagenes = [producto.imagen_url, producto.imagen_url_2, producto.imagen_url_3].filter((img): img is string => img !== null);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": producto.nombre,
    "image": imagenes,
    "description": producto.descripcion_corta || producto.descripcion || producto.nombre,
    "brand": {
      "@type": "Brand",
      "name": "BoxiTec",
    },
    "sku": producto.id,
    "offers": {
      "@type": "Offer",
      "url": `https://boxi-store.vercel.app/producto/${producto.id}`,
      "priceCurrency": "MXN",
      "price": precioActual,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "BoxiTec",
      },
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#FF6B00]">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-[#FF6B00]">Catalogo</Link>
        <span>/</span>
        <Link href={`/catalogo?categoria=${producto.categoria?.slug}`} className="hover:text-[#FF6B00]">
          {producto.categoria?.nombre}
        </Link>
        <span>/</span>
        <span className="text-[#1A1A1A] truncate max-w-[200px]">{producto.nombre}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galeria de imagenes */}
        <div>
          {/* Imagen principal con zoom */}
          <div
            className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 cursor-crosshair"
            onMouseEnter={() => setZoomActivo(true)}
            onMouseLeave={() => setZoomActivo(false)}
            onMouseMove={handleMouseMove}
          >
            {imagenes[imagenActual] ? (
              <Image
                src={imagenes[imagenActual]}
                alt={producto.nombre}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover transition-transform duration-200 ${
                  zoomActivo ? 'scale-150' : ''
                }`}
                style={zoomActivo ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                quality={90}
                priority={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">📦</span>
              </div>
            )}

            {/* Badge de descuento */}
            {tieneDescuento && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round((1 - producto.precio_oferta! / producto.precio_base) * 100)}%
                </span>
              </div>
            )}

            {/* Navegacion */}
            {imagenes.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setImagenActual(imagenActual > 0 ? imagenActual - 1 : imagenes.length - 1); }}
                  aria-label="Imagen anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setImagenActual(imagenActual < imagenes.length - 1 ? imagenActual + 1 : 0); }}
                  aria-label="Imagen siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Indicador de zoom */}
            {zoomActivo && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <ZoomIn className="w-3 h-3" /> Zoom
              </div>
            )}

            {/* Contador de imagenes */}
            {imagenes.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                {imagenActual + 1} / {imagenes.length}
              </div>
            )}
          </div>

          {/* Thumbnails optimizados */}
          {imagenes.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImagenActual(i)}
                  className={`aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 transition-all relative ${
                    imagenActual === i
                      ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/30'
                      : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  {img ? (
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                      quality={60}
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info del producto */}
        <div>
          {/* Categoria */}
          <Link
            href={`/catalogo?categoria=${producto.categoria?.slug}`}
            className="inline-block bg-[#FF6B00]/10 text-[#FF6B00] px-3 py-1 rounded-full text-sm font-medium hover:bg-[#FF6B00]/20 transition-colors"
          >
            {producto.categoria?.nombre}
          </Link>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mt-4">{producto.nombre}</h1>

          {producto.descripcion_corta && (
            <p className="text-lg text-gray-600 mt-3">{producto.descripcion_corta}</p>
          )}

          {/* Rating — Solo se muestra si hay reseñas reales */}

          {/* Precio */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            {tieneDescuento ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-[#FF6B00]">
                  {formatPrecio(producto.precio_oferta!)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrecio(producto.precio_base)}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                  Ahorra {formatPrecio(producto.precio_base - producto.precio_oferta!)}
                </span>
              </div>
            ) : (
              <span className="text-4xl font-bold text-[#1A1A1A]">
                {formatPrecio(producto.precio_base)}
              </span>
            )}
            <p className="text-sm text-gray-500 mt-2">Precios con IVA incluido Pago contra entrega disponible</p>
          </div>

          {/* Variantes */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Presentacion:</label>
              <div className="flex flex-wrap gap-2">
                {producto.variantes.map((variante) => (
                  <button
                    key={variante.id}
                    onClick={() => setVarianteSeleccionada(variante.id)}
                    disabled={variante.stock === 0}
                    className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium ${
                      varianteSeleccionada === variante.id
                        ? 'border-[#FF6B00] bg-[#FF6B00] text-white shadow-md'
                        : variante.stock === 0
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                        : 'border-gray-200 hover:border-[#FF6B00] hover:bg-orange-50'
                    }`}
                  >
                    {variante.nombre}
                    {variante.precio && (
                      <span className="block text-xs mt-0.5 opacity-80">
                        {formatPrecio(variante.precio)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-4">
            {stock > 0 ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-600 font-medium">
                  En stock ({stock} disponibles)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-red-600 font-medium">Agotado</span>
              </div>
            )}
          </div>

          {/* Cantidad y agregar al carrito */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                aria-label="Reducir cantidad"
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 py-3 font-bold text-lg min-w-[60px] text-center">{cantidad}</span>
              <button
                onClick={() => setCantidad(Math.min(stock, cantidad + 1))}
                aria-label="Aumentar cantidad"
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAgregarCarrito}
              disabled={stock === 0 || agregando}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center gap-2 ${
                agregado
                  ? 'bg-green-500 text-white'
                  : stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF6B00] text-white hover:bg-[#CC5500] shadow-lg hover:shadow-xl'
              }`}
            >
              {agregando ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent"></div>
              ) : agregado ? (
                <>
                  <Check className="w-5 h-5" />
                  Agregado al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </>
              )}
            </button>
          </div>

          {/* Total estimado */}
          {stock > 0 && (
            <p className="text-sm text-gray-500 mt-2 text-right">
              Total: <span className="font-bold text-[#1A1A1A]">{formatPrecio(precioActual * cantidad)}</span>
            </p>
          )}

          {/* Botones extra */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => toggleFavorito(producto.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${favorito ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-sm">{favorito ? 'En Favoritos' : 'Favorito'}</span>
            </button>
            <button
              onClick={compartirWhatsApp}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">WhatsApp</span>
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: producto?.nombre,
                    text: `Mira este producto en BoxiTec: ${producto?.nombre}`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copiado al portapapeles');
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B00] transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Compartir</span>
            </button>
          </div>

          {/* Beneficios */}
          <div className="mt-8 border-t pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Envio gratis</p>
                <p className="text-sm text-gray-500">En compras mayores a $1,000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Garantia de 1 mes</p>
                <p className="text-sm text-gray-500">Contra defectos de fabricacion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div>
                <p className="font-medium text-[#1A1A1A]">Pago contra entrega</p>
                <p className="text-sm text-gray-500">Paga cuando recibas tu pedido</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de informacion */}
      <div className="mt-16">
        <div className="flex border-b overflow-x-auto">
          {(['descripcion', 'specs', 'envio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                tabActiva === tab
                  ? 'border-b-2 border-[#FF6B00] text-[#FF6B00]'
                  : 'text-gray-500 hover:text-[#1A1A1A]'
              }`}
            >
              {tab === 'descripcion' ? 'Descripcion' : tab === 'specs' ? 'Caracteristicas' : 'Envio y Garantia'}
            </button>
          ))}
        </div>

        <div className="py-8">
          {tabActiva === 'descripcion' && (
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {producto.descripcion ? (
                <p className="whitespace-pre-line">{producto.descripcion}</p>
              ) : producto.descripcion_corta ? (
                <p>{producto.descripcion_corta}</p>
              ) : (
                <p className="text-gray-500 italic">Descripcion no disponible.</p>
              )}
            </div>
          )}

          {tabActiva === 'specs' && (
            <div>
              {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {producto.caracteristicas.map((car: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-[#FF6B00]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#FF6B00]" />
                      </div>
                      <span className="text-gray-700">{car}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No hay especificaciones disponibles.</p>
              )}
            </div>
          )}

          {tabActiva === 'envio' && (
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Envio Estandar</h3>
                <p className="text-sm text-gray-500">3-5 dias habiles</p>
                <p className="text-sm text-green-600 font-medium mt-1">Gratis +$1,000</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Envio Exprés</h3>
                <p className="text-sm text-gray-500">1-2 dias habiles</p>
                <p className="text-sm text-blue-600 font-medium mt-1">Costo adicional</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">Garantia</h3>
                <p className="text-sm text-gray-500">1 ano de cobertura</p>
                <p className="text-sm text-[#FF6B00] font-medium mt-1">Defectos de fabrica</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16 min-h-[400px]">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Te puede interesar</h2>
        {cargandoRelacionados ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border rounded-xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : productosRelacionados.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productosRelacionados.map((prod) => (
              <Link
                key={prod.id}
                href={`/producto/${prod.id}`}
                className="bg-white border rounded-xl p-4 hover:shadow-lg transition-all group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                  {prod.imagen_url ? (
                    <Image
                      src={prod.imagen_url}
                      alt={prod.nombre}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                      quality={75}
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <h3 className="font-medium text-[#1A1A1A] text-sm line-clamp-2">{prod.nombre}</h3>
                <p className="text-[#FF6B00] font-bold mt-1">
                  {formatPrecio(prod.precio_oferta || prod.precio_base)}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {/* Volver */}
      <div className="mt-12">
        <Link href="/catalogo" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500]">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al catalogo
        </Link>
      </div>
    </div>
    </>
  );
}
