import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

const articulosMeta: Record<string, { titulo: string; descripcion: string; keywords: string[] }> = {
  'como-elegir-smartwatch-perfecto': {
    titulo: 'Como Elegir el Smartwatch Perfecto para Ti',
    descripcion: 'Guia completa para elegir el smartwatch ideal segun tu estilo de vida, presupuesto y necesidades. Descubre que funciones son importantes.',
    keywords: ['elegir smartwatch', 'mejor smartwatch', 'guia smartwatch', 'comprar reloj inteligente', 'smartwatch 2026'],
  },
  'mejores-luces-led-negocio-2026': {
    titulo: 'Las 5 Mejores Luces LED para Iluminar tu Negocio en 2026',
    descripcion: 'Descubre como las luces LED pueden transformar la iluminacion de tu negocio, ahorrar energia y crear un ambiente mas atractivo para tus clientes.',
    keywords: ['luces LED negocio', 'iluminacion LED', 'ahorrar energia', 'luces comerciales'],
  },
  'smartwatch-vs-reloj-tradicional': {
    titulo: 'Smartwatch vs Reloj Tradicional: Por que Debes Cambiar',
    descripcion: 'Analisis completo de las ventajas de usar un smartwatch en tu dia a dia. Funciones de salud, productividad y conectividad.',
    keywords: ['smartwatch vs reloj', 'reloj inteligente', 'smartwatch 2026', 'tecnologia wearable'],
  },
  'guia-elegir-bocina-bluetooth': {
    titulo: 'Guia para Elegir la Bocina Bluetooth Perfecta',
    descripcion: 'Aprende a elegir la bocina bluetooth ideal segun tus necesidades: sonido, portabilidad, resistencia al agua y precio.',
    keywords: ['bocina bluetooth', 'elegir bocina', 'mejor bocina', 'audio portatil'],
  },
  'lentes-inteligencia-artificial': {
    titulo: 'Lentes con Inteligencia Artificial: El Futuro ya esta Aqui',
    descripcion: 'Conoce los lentes inteligentes con IA que pueden grabar video, hacer llamadas y hasta traducir en tiempo real.',
    keywords: ['lentes IA', 'lentes inteligentes', 'inteligencia artificial', 'gadgets futuro'],
  },
  'ahorrar-energia-tecnologia-led': {
    titulo: 'Como Ahorrar Energia con Tecnologia LED en tu Hogar',
    descripcion: 'Tips practicos para reducir tu factura de luz usando bombillas y tiras LED inteligentes. Ahorro de hasta 80%.',
    keywords: ['ahorrar energia', 'tecnologia LED', 'bombillas LED', 'hogar inteligente'],
  },
  'accesorios-tech-imprescindibles-2026': {
    titulo: 'Los 10 Accesorios Tech que No Pueden Faltarte en 2026',
    descripcion: 'Lista de los accesorios tecnologicos mas populares y utiles del ano. Desde cargadores inalambricos hasta organizadores smart.',
    keywords: ['accesorios tech', 'gadgets 2026', 'tecnologia imprescindible', 'accesorios inteligentes'],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = articulosMeta[slug];

  if (!meta) {
    return {
      title: 'Articulo no encontrado | Blog BoxiTec',
    };
  }

  return {
    title: `${meta.titulo} | Blog BoxiTec`,
    description: meta.descripcion,
    keywords: [...meta.keywords, 'blog boxitec', 'tecnologia', 'mexico'],
    openGraph: {
      title: meta.titulo,
      description: meta.descripcion,
      url: `https://boxi-store.vercel.app/blog/${slug}`,
      siteName: 'BoxiTec',
      locale: 'es_MX',
      type: 'article',
    },
    alternates: {
      canonical: `https://boxi-store.vercel.app/blog/${slug}`,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
