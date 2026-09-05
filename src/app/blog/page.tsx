'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface Articulo {
  id: string;
  titulo: string;
  resumen: string;
  imagen: string;
  categoria: string;
  fecha: string;
  tiempoLectura: string;
  slug: string;
}

const articulos: Articulo[] = [
  {
    id: '0',
    titulo: 'Como Elegir el Smartwatch Perfecto para Ti',
    resumen: 'Guia completa para elegir el smartwatch ideal segun tu estilo de vida, presupuesto y necesidades. Descubre que funciones son importantes y cuales son opcionales.',
    imagen: '/blog/como-elegir-smartwatch.jpg',
    categoria: 'Tecnologia',
    fecha: '2026-09-03',
    tiempoLectura: '7 min',
    slug: 'como-elegir-smartwatch-perfecto',
  },
  {
    id: '1',
    titulo: 'Las 5 Mejores Luces LED para Iluminar tu Negocio en 2026',
    resumen: 'Descubre como las luces LED pueden transformar la iluminacion de tu negocio, ahorrar energia y crear un ambiente mas atractivo para tus clientes.',
    imagen: '/blog/luces-led-negocios.jpg',
    categoria: 'Iluminacion',
    fecha: '2026-09-01',
    tiempoLectura: '5 min',
    slug: 'mejores-luces-led-negocio-2026',
  },
  {
    id: '2',
    titulo: 'Smartwatch vs Reloj Tradicional: Por que Debes Cambiar',
    resumen: 'Analisis completo de las ventajas de usar un smartwatch en tu dia a dia. Funciones de salud, productividad y conectividad.',
    imagen: '/blog/smartwatch-vs-tradicional.jpg',
    categoria: 'Tecnologia',
    fecha: '2026-08-28',
    tiempoLectura: '7 min',
    slug: 'smartwatch-vs-reloj-tradicional',
  },
  {
    id: '3',
    titulo: 'Guia para Elegir la Bocina Bluetooth Perfecta',
    resumen: 'Aprende a elegir la bocina bluetooth ideal segun tus necesidades: sonido, portabilidad, resistencia al agua y precio.',
    imagen: '/blog/guia-bocina-bluetooth.jpg',
    categoria: 'Audio',
    fecha: '2026-08-25',
    tiempoLectura: '6 min',
    slug: 'guia-elegir-bocina-bluetooth',
  },
  {
    id: '4',
    titulo: 'Lentes con Inteligencia Artificial: El Futuro ya esta Aqui',
    resumen: 'Conoce los lentes inteligentes con IA que pueden grabar video, hacer llamadas y hasta traducir en tiempo real.',
    imagen: '/blog/lentes-ia-futuro.jpg',
    categoria: 'Innovacion',
    fecha: '2026-08-20',
    tiempoLectura: '4 min',
    slug: 'lentes-inteligencia-artificial',
  },
  {
    id: '5',
    titulo: 'Como Ahorrar Energia con Tecnologia LED en tu Hogar',
    resumen: 'Tips practicos para reducir tu factura de luz usando bombillas y tiras LED inteligentes. Ahorro de hasta 80%.',
    imagen: '/blog/ahorrar-energia-led.jpg',
    categoria: 'Hogar Inteligente',
    fecha: '2026-08-15',
    tiempoLectura: '5 min',
    slug: 'ahorrar-energia-tecnologia-led',
  },
  {
    id: '6',
    titulo: 'Los 10 Accesorios Tech que No Pueden Faltarte en 2026',
    resumen: 'Lista de los accesorios tecnologicos mas populares y utiles del ano. Desde cargadores inalambricos hasta organizadores smart.',
    imagen: '/blog/accesorios-tech-2026.jpg',
    categoria: 'Accesorios',
    fecha: '2026-08-10',
    tiempoLectura: '8 min',
    slug: 'accesorios-tech-imprescindibles-2026',
  },
];

function TarjetaArticulo({ articulo }: { articulo: Articulo }) {
  return (
    <Link 
      href={`/blog/${articulo.slug}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
    >
      {/* Imagen */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-[#C85A00]/20 to-[#C85A00]/5 flex items-center justify-center">
          <span className="text-6xl opacity-30">📝</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-[#C85A00] text-white text-xs font-bold px-3 py-1 rounded-full">
            {articulo.categoria}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(articulo.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {articulo.tiempoLectura}
          </span>
        </div>

        <h3 className="font-bold text-[#1A1A1A] text-lg line-clamp-2 group-hover:text-[#C85A00] transition-colors">
          {articulo.titulo}
        </h3>

        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
          {articulo.resumen}
        </p>

        <div className="mt-4 flex items-center text-[#C85A00] font-medium text-sm group-hover:gap-2 transition-all">
          Leer mas
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-[#1A1A1A] text-center">
            Blog de <span className="text-[#C85A00]">BoxiTec</span>
          </h1>
          <p className="text-gray-600 text-center mt-3 max-w-2xl mx-auto">
            Consejos, guias y novedades sobre tecnologia, gadgets y soluciones inteligentes para tu negocio y hogar.
          </p>
        </div>
      </div>

      {/* Articulos destacados */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Articulo principal */}
        <div className="mb-8">
          <TarjetaArticulo articulo={articulos[0]} />
        </div>

        {/* Grid de articulos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articulos.slice(1).map((articulo) => (
            <TarjetaArticulo key={articulo.id} articulo={articulo} />
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
            Tecnologia y Gadgets en BoxiTec
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              En BoxiTec encontraras la mejor seleccion de <strong>tecnologia y gadgets</strong> para 
              tu negocio y hogar. Somos una tienda especializada en <strong>smartwatches</strong>, 
              <strong> lentes inteligentes con IA</strong>, <strong>bocinas Bluetooth</strong>, 
              <strong> luces LED</strong> y todo tipo de accesorios tecnologicos innovadores.
            </p>
            <p>
              Ubicados en <strong>Tecate, Baja California</strong>, ofrecemos envio gratis a todo 
              Mexico en compras mayores a $1,000 MXN. Nuestros productos cuentan con garantia y 
              la opcion de pago contra entrega para tu tranquilidad.
            </p>
            <p>
              Visita nuestro <Link href="/catalogo" className="text-[#C85A00] hover:underline">catalogo</Link> y 
              descubre por que somos la mejor opcion en tecnologia accesible. Si tienes preguntas, 
              contactanos al <a href="tel:+526651423910" className="text-[#C85A00] hover:underline">+52 665 142 3910</a> o 
              por WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
