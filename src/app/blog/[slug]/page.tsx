'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle } from 'lucide-react';

interface ArticuloCompleto {
  titulo: string;
  resumen: string;
  categoria: string;
  fecha: string;
  tiempoLectura: string;
  contenido: string[];
  productosRelacionados: Array<{
    nombre: string;
    precio: string;
    link: string;
  }>;
}

const articulos: Record<string, ArticuloCompleto> = {
  'como-elegir-smartwatch-perfecto': {
    titulo: 'Como Elegir el Smartwatch Perfecto para Ti',
    resumen: 'Guia completa para elegir el smartwatch ideal segun tu estilo de vida, presupuesto y necesidades.',
    categoria: 'Tecnologia',
    fecha: '2026-09-03',
    tiempoLectura: '7 min',
    contenido: [
      'Elegir un smartwatch puede ser abrumador con tantas opciones disponibles en el mercado. En esta guia te explicamos paso a paso como encontrar el reloj inteligente perfecto para ti, sin gastar de mas ni Functions de mas.',
      '## Paso 1: Define tu presupuesto',
      'Antes de mirar modelos, decides cuanto quieres invertir. Los smartwatches se dividen en tres rangos:',
      '- **Economicos ($500 - $1,000 MXN):** Funciones basicas como pasos, notificaciones y monitor cardiaco. Ideales para comenzar.',
      '- **Intermedios ($1,000 - $2,000 MXN):** GPS, pantalla AMOLED, resistance al agua y mas funciones de salud.',
      '- **Premium ($2,000+ MXN):** Todo lo anterior mas ECG, SpO2, pantalla siempre activa y materiales premium.',
      '## Paso 2: Que funciones necesitas?',
      'No todas las personas necesitan las mismas funciones. Identifica cual es tu prioridad:',
      '**Para deportistas:**',
      '- GPS integrado para registrar rutas',
      '- Monitor cardiaco preciso',
      '- Resistance al agua (minimo IP68)',
      '- Bateria de larga duracion',
      '**Para profesionales:**',
      '- Notificaciones del celular',
      '- Respuesta rapida a mensajes',
      '- Calendario y alarmas',
      '- Diseno elegante para la oficina',
      '**Para salud:**',
      '- Monitoreo de sueño',
      '- Detector de oxigeno en sangre (SpO2)',
      '- Electrocardiograma (ECG)',
      '- Alertas de ritmo cardiaco irregular',
      '## Paso 3: Compatibilidad con tu celular',
      'Esta es una regla de oro que mucha gente olvida:',
      '- **iPhone:** Busca Apple Watch o smartwatch que兼容 con iOS',
      '- **Android:** La mayoria de smartwatches funcionan, pero algunos como Samsung Galaxy Watch son mejores con Samsung',
      '## Paso 4: Tamaño y comodidad',
      'El smartwatch pasara horas en tu muñeca, asi que la comodidad es clave:',
      '- **Muñecas pequenas (menos de 16cm):** Busca pantallas de 40mm o menos',
      '- **Muñecas medianas (16-18cm):** Pantallas de 40-44mm',
      '- **Muñecas grandes (mas de 18cm):** Pantallas de 44mm o mas',
      '## Paso 5: Duracion de la bateria',
      'Segun tu uso:',
      '- **Uso ligero (solo notificaciones):** 5-7 dias',
      '- **Uso moderado (deportes + notificaciones):** 2-4 dias',
      '- **Uso intensivo (GPS siempre activo):** 1-2 dias',
      '## Paso 6: Marcas recomendadas',
      'En BoxiTec encontras smartwatches de calidad a buen precio. Algunas marcas que te recomendamos:',
      '- Para presupuesto ajustado: Smartwatch Sport ($799 MXN)',
      '- Para todo uso: Smartwatch Pro Max ($1,299 MXN)',
      '- Para deportistas: Smartwatch Ultra ($1,899 MXN)',
      '## Consejos finales',
      '1. No pagues por funciones que no vas a usar',
      '2. Lee reseñas antes de comprar',
      '3. Verifica la garantia',
      '4. Considera el costo de correas adicionales',
      '5. Si puedes, pruebalo antes de comprar',
      'En BoxiTec tenemos smartwatches para cada tipo de usuario. Visita nuestro catalogo y encuentra el tuyo.',
    ],
    productosRelacionados: [
      { nombre: 'Smartwatch Sport - $799 MXN', precio: '$799 MXN', link: '/catalogo' },
      { nombre: 'Smartwatch Pro Max - $1,299 MXN', precio: '$1,299 MXN', link: '/catalogo' },
      { nombre: 'Smartwatch Ultra - $1,899 MXN', precio: '$1,899 MXN', link: '/catalogo' },
    ],
  },
  'mejores-luces-led-negocio-2026': {
    titulo: 'Las 5 Mejores Luces LED para Iluminar tu Negocio en 2026',
    resumen: 'Descubre como las luces LED pueden transformar la iluminacion de tu negocio.',
    categoria: 'Iluminacion',
    fecha: '2026-09-01',
    tiempoLectura: '5 min',
    contenido: [
      'La iluminacion LED se ha convertido en un elemente esencial para cualquier negocio que busque ahorrar energia y crear un ambiente atractivo para sus clientes. En 2026, las opciones son mas variadas y accesibles que nunca.',
      '## Por que elegir luces LED para tu negocio?',
      'Las luces LED ofrecen multiples ventajas sobre la iluminacion tradicional: consumen hasta un 80% menos de energia, duran significativamente mas (hasta 50,000 horas) y no emiten calor excesivo.',
      '## Top 5 Luces LED recomendadas',
      '1. **Tira LED RGB** - Ideal para crear ambientes personalizables. Puedes cambiar el color segun la ocasion.',
      '2. **Panel LED cuadrado** - Perfecto para oficinas y tiendas. Proporciona iluminacion uniforme y profesional.',
      '3. **Foco LED inteligente** - Se controla desde tu celular. Perfecto para tiendas que buscan automatizacion.',
      '4. **Lampara LED industrial** - Para grandes espacios como bodegas o locales amplios.',
      '5. **Cinta LED waterproof** - Para exteriores o areas con humedad.',
      '## Tips para iluminar tu negocio',
      '- Evalua el tamano del espacio antes de comprar',
      '- Considera la temperatura del color (3000K-5000K para negocios)',
      '- Invierte en productos de calidad para mayor durabilidad',
      '- Consulta con un electricista para la instalacion',
    ],
    productosRelacionados: [
      { nombre: 'Tira LED RGB 5metros', precio: '$399 MXN', link: '/catalogo?categoria=iluminacion' },
      { nombre: 'Panel LED Cuadrado 48W', precio: '$599 MXN', link: '/catalogo?categoria=iluminacion' },
    ],
  },
  'smartwatch-vs-reloj-tradicional': {
    titulo: 'Smartwatch vs Reloj Tradicional: Por que Debes Cambiar',
    resumen: 'Analisis completo de las ventajas de usar un smartwatch en tu dia a dia.',
    categoria: 'Tecnologia',
    fecha: '2026-08-28',
    tiempoLectura: '7 min',
    contenido: [
      'El debate entre smartwatch y reloj tradicional sigue vigente, pero cada vez mas personas estan descubriendo las ventajas de usar un reloj inteligente en su vida diaria.',
      '## Funciones de salud y bienestar',
      'Los smartwatch modernos pueden monitorear tu ritmo cardiaco, nivel de oxigeno en sangre, calidad del sueño e incluso detectar caidas. Estas funciones pueden salvar vidas.',
      '## Productividad y conectividad',
      'Recibe notificaciones, contesta mensajes y haz llamadas sin sacar tu celular. Ideal para profesionales que necesitan estar conectados.',
      '## Deportes y actividad fisica',
      'Registra automaticamente tus pasos, calorias quemadas y diferentes tipos de ejercicio. Muchos incluyen GPS para correr o andar en bicicleta.',
      '## El factor economico',
      'Aunque el precio inicial es mayor, un smartwatch puede reloj tradicional + pulsera de actividad + reloj despertador + GPS. Es una inversion inteligente.',
      '## Conclusion',
      'Si buscas algo mas que la hora, un smartwatch es la mejor inversion en tecnologia personal que puedes hacer en 2026.',
    ],
    productosRelacionados: [
      { nombre: 'Smartwatch Pro Max', precio: '$1,299 MXN', link: '/catalogo' },
      { nombre: 'Smartwatch Sport', precio: '$799 MXN', link: '/catalogo' },
    ],
  },
  'guia-elegir-bocina-bluetooth': {
    titulo: 'Guia para Elegir la Bocina Bluetooth Perfecta',
    resumen: 'Aprende a elegir la bocina bluetooth ideal segun tus necesidades.',
    categoria: 'Audio',
    fecha: '2026-08-25',
    tiempoLectura: '6 min',
    contenido: [
      'Elegir la bocina bluetooth correcta puede ser complicado con tantas opciones disponibles. Esta guia te ayudara a tomar la mejor decision segun tus necesidades.',
      '## Considera el tamano del espacio',
      'Para habitaciones pequenas, una bocina compacta es suficiente. Para espacios grandes o al aire libre, necesitas algo con mas potencia de watts.',
      '## Resistencia al agua',
      'Si planeas usarla en la playa, piscina o bañera, busca una con clasificacion IPX7 o superior.',
      '## Duracion de bateria',
      'Las mejores bocinas ofrecen entre 10-20 horas de reproduccion. Para viajes largos, busca una con bateria de larga duracion.',
      '## Calidad de sonido',
      'Los watts no lo son todo. Lee reseñas y busca bocinas con buen equilibrio entre graves y agudos.',
      '## Marcas recomendadas',
      'JBL, Sony, Bose y Marshall son excelentes opciones. En BoxiTec tenemos opciones de todas estas marcas.',
    ],
    productosRelacionados: [
      { nombre: 'Bocina Bluetooth 20W', precio: '$499 MXN', link: '/catalogo?categoria=bocinas-y-audio' },
      { nombre: 'Bocina Waterproof IPX7', precio: '$699 MXN', link: '/catalogo?categoria=bocinas-y-audio' },
    ],
  },
  'lentes-inteligencia-artificial': {
    titulo: 'Lentes con Inteligencia Artificial: El Futuro ya esta Aqui',
    resumen: 'Conoce los lentes inteligentes con IA que pueden grabar video y traducir.',
    categoria: 'Innovacion',
    fecha: '2026-08-20',
    tiempoLectura: '4 min',
    contenido: [
      'Los lentes inteligentes con inteligencia artificial estan revolucionando la forma en que interactuamos con la tecnologia. Ya no es ciencia ficcion.',
      '## Que pueden hacer estos lentes?',
      '- Grabar video en primera persona',
      '- Hacer llamadas manos libres',
      '- Traducir idiomas en tiempo real',
      '- Navegacion con aumentada',
      '- Reconocimiento de objetos',
      '## Ventajas sobre otros dispositivos',
      'A diferencia de los celulares, los lentes IA permiten usar la tecnologia de forma natural, sin distraerte de lo que estas haciendo.',
      '## Usos practicos',
      'Profesionales de salud, ingenieros, turistas y creadores de contenido ya estan usando esta tecnologia en su dia a dia.',
      '## El futuro de los lentes IA',
      'En los proximos anos, veremos modelos mas ligeros, economicos y con mas funcionalidades integradas.',
    ],
    productosRelacionados: [
      { nombre: 'Lentes IA Pro', precio: '$2,499 MXN', link: '/catalogo' },
      { nombre: 'Lentes IA Basic', precio: '$1,499 MXN', link: '/catalogo' },
    ],
  },
  'ahorrar-energia-tecnologia-led': {
    titulo: 'Como Ahorrar Energia con Tecnologia LED en tu Hogar',
    resumen: 'Tips practicos para reducir tu factura de luz usando bombillas y tiras LED.',
    categoria: 'Hogar Inteligente',
    fecha: '2026-08-15',
    tiempoLectura: '5 min',
    contenido: [
      'Reducir el consumo de energia en el hogar no solo es bueno para el medio ambiente, sino que tambien te ahorra dinero cada mes. La tecnologia LED es la forma mas facil de lograrlo.',
      '## Cuanto puedes ahorrar?',
      'Cambiar 10 bombillas tradicionales por LED puede ahorrarte hasta $1,500 pesos al ano en tu factura de luz.',
      '## Tips para ahorrar energia',
      '1. Reemplaza todas las bombillas incandescentes por LED',
      '2. Usa temporizadores en areas de paso',
      '3. Aprovecha la luz natural durante el dia',
      '4. Desconecta aparatos en standby',
      '5. Usa focos inteligentes que se apaguen solos',
      '## Inversion inicial vs ahorro a largo plazo',
      'Aunque las bombillas LED cuestan mas inicialmente, se pagan solas en 6-12 meses de ahorro.',
    ],
    productosRelacionados: [
      { nombre: 'Kit 10 Bombillas LED', precio: '$599 MXN', link: '/catalogo?categoria=iluminacion' },
      { nombre: 'Tira LED Inteligente', precio: '$449 MXN', link: '/catalogo?categoria=iluminacion' },
    ],
  },
  'accesorios-tech-imprescindibles-2026': {
    titulo: 'Los 10 Accesorios Tech que No Pueden Faltarte en 2026',
    resumen: 'Lista de los accesorios tecnologicos mas populares y utiles del ano.',
    categoria: 'Accesorios',
    fecha: '2026-08-10',
    tiempoLectura: '8 min',
    contenido: [
      'La tecnologia avanza rapidamente y cada ano aparecen nuevos accesorios que hacen nuestra vida mas facil. Aqui esta nuestra lista de los 10 imprescindibles de 2026.',
      '## 1. Cargador inalambrico rapido',
      'Olvídate de los cables. Los cargadores inalambricos ahora son tan rapidos como los cableados.',
      '## 2. Organizador de escritorio smart',
      'Con puertos USB integrados y carga inalambrica para tu celular.',
      '## 3. Lampara de escritorio LED regulable',
      'Perfecta para trabajar sin cansar la vista. Regula la temperatura del color.',
      '## 4. Bocina de escritorio compacta',
      'Para disfrutar musica mientras trabajas sin ocupar espacio.',
      '## 5. Soporte para celular con carga',
      'Mantiene tu celular cargado y visible mientras trabajas.',
      '## 6. Audifonos con cancelacion de ruido',
      'Ideales para concentrarse en espacios ruidosos.',
      '## 7. Webcam HD con luz integrada',
      'Para videollamadas profesionales desde casa.',
      '## 8. Hub USB-C multifuncion',
      'Conecta todos tus dispositivos con un solo cable.',
      '## 9. Almacenamiento externo SSD',
      'Rapido, compacto y con gran capacidad.',
      '## 10. Reloj despertador inteligente',
      'Se integra con tu smartphone y te despierta en el mejor momento.',
    ],
    productosRelacionados: [
      { nombre: 'Cargador Inalambrico 15W', precio: '$349 MXN', link: '/catalogo' },
      { nombre: 'Hub USB-C 7 en 1', precio: '$599 MXN', link: '/catalogo' },
    ],
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const articulo = articulos[slug];

  if (!articulo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-4">Articulo no encontrado</h1>
          <Link href="/blog" className="text-[#FF6B00] hover:underline">Volver al blog</Link>
        </div>
      </div>
    );
  }

  const compartirWhatsApp = () => {
    const texto = `Mira este articulo de BoxiTec: ${articulo.titulo}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto + ' - ' + window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/blog" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al blog
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="bg-[#FF6B00]/10 text-[#FF6B00] px-3 py-1 rounded-full font-medium">
              {articulo.categoria}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(articulo.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {articulo.tiempoLectura} de lectura
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
            {articulo.titulo}
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            {articulo.resumen}
          </p>

          {/* Botones de compartir */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={compartirWhatsApp}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border">
          <div className="prose max-w-none">
            {articulo.contenido.map((parrafo, i) => {
              if (parrafo.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">
                    {parrafo.replace('## ', '')}
                  </h2>
                );
              }
              if (parrafo.startsWith('- ')) {
                return (
                  <li key={i} className="text-gray-700 ml-4 mb-2">
                    {parrafo.replace('- ', '')}
                  </li>
                );
              }
              if (parrafo.match(/^\d\./)) {
                return (
                  <li key={i} className="text-gray-700 ml-4 mb-2 list-decimal">
                    {parrafo.replace(/^\d\.\s*/, '')}
                  </li>
                );
              }
              return (
                <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                  {parrafo}
                </p>
              );
            })}
          </div>
        </div>

        {/* Productos relacionados */}
        {articulo.productosRelacionados.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Productos Relacionados
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {articulo.productosRelacionados.map((prod, i) => (
                <Link
                  key={i}
                  href={prod.link}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#FF6B00]/5 transition-colors border border-gray-100"
                >
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{prod.nombre}</p>
                    <p className="text-[#FF6B00] font-bold">{prod.precio}</p>
                  </div>
                  <span className="text-[#FF6B00] text-sm">Ver</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#FF6B00] to-[#CC5500] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            ¿Te interesa algun producto?
          </h3>
          <p className="text-orange-100 mb-6">
            Visita nuestro catalogo y encuentra las mejores ofertas en tecnologia.
          </p>
          <Link
            href="/catalogo"
            className="inline-block bg-white text-[#FF6B00] px-8 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors"
          >
            Ver Catalogo
          </Link>
        </div>
      </div>
    </div>
  );
}
