import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, CreditCard } from 'lucide-react';
import ProductoCard from '@/components/producto/ProductoCard';

// Categorías con iconos
const categorias = [
  { nombre: 'Herramientas', slug: 'herramientas', icono: '🔧', descripcion: 'Arrancadores y herramientas inteligentes' },
  { nombre: 'Mochilas', slug: 'mochilas', icono: '🎒', descripcion: 'Mochilas y bolsos tech' },
  { nombre: 'Gaming', slug: 'gaming', icono: '🎮', descripcion: 'Accesorios para gaming' },
  { nombre: 'Iluminación', slug: 'iluminacion', icono: '💡', descripcion: 'Luces LED e iluminación' },
  { nombre: 'Lentes IA', slug: 'lentes-ia', icono: '👓', descripcion: 'Lentes con inteligencia artificial' },
  { nombre: 'Accesorios Auto', slug: 'accesorios-auto', icono: '🚗', descripcion: 'Soportes para carros' },
];

// Productos de ejemplo (luego vendrán de Supabase)
const productosDestacados = [
  {
    id: '1',
    nombre: 'Smart Watch Pro X',
    slug: 'smart-watch-pro-x',
    descripcion_corta: 'Reloj inteligente con GPS y monitor de salud',
    precio_base: 1299,
    precio_oferta: 999,
    imagen_url: '/images/productos/smartwatch.jpg',
    categoria: { nombre: 'Wearables' },
  },
  {
    id: '2',
    nombre: 'Lentes IA Vision Plus',
    slug: 'lentes-ia-vision-plus',
    descripcion_corta: 'Lentes con asistente de IA integrado',
    precio_base: 2499,
    precio_oferta: null,
    imagen_url: '/images/productos/lentes.jpg',
    categoria: { nombre: 'Lentes IA' },
  },
  {
    id: '3',
    nombre: 'Kit Luces LED Ambiente',
    slug: 'kit-luces-led',
    descripcion_corta: 'Tira LED RGB con control por app',
    precio_base: 599,
    precio_oferta: 449,
    imagen_url: '/images/productos/led.jpg',
    categoria: { nombre: 'Iluminación' },
  },
  {
    id: '4',
    nombre: 'Soporte Carro Magnético',
    slug: 'soporte-carro-magnetico',
    descripcion_corta: 'Soporte magnético universal para celular',
    precio_base: 299,
    precio_oferta: null,
    imagen_url: '/images/productos/soporte.jpg',
    categoria: { nombre: 'Accesorios Auto' },
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FF6B00] to-[#CC5500] text-white">
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
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#FF6B00] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
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
                <span className="text-8xl">Boxi</span>
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
              <Truck className="w-5 h-5 text-[#FF6B00]" />
              <span className="text-sm">Envío gratis +$500</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Shield className="w-5 h-5 text-[#FF6B00]" />
              <span className="text-sm">Garantía incluida</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <CreditCard className="w-5 h-5 text-[#FF6B00]" />
              <span className="text-sm">Transferencia bancaria</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-700">
              <Zap className="w-5 h-5 text-[#FF6B00]" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo/${cat.slug}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100"
              >
                <span className="text-4xl block mb-3">{cat.icono}</span>
                <h3 className="font-semibold text-[#1A1A1A]">{cat.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1">{cat.descripcion}</p>
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
              <p className="text-gray-600 mt-1">Los más populares de BOXI</p>
            </div>
            <Link
              href="/catalogo"
              className="text-[#FF6B00] hover:text-[#CC5500] font-medium flex items-center"
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
      <section className="py-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para la tecnología?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Suscríbete y recibe ofertas exclusivas, nuevos productos y descuentos 
            especiales directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#FF6B00] text-white font-semibold rounded-lg hover:bg-[#CC5500] transition-colors"
            >
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
