import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog de Tecnologia y Gadgets | BoxiTec',
  description: 'Consejos, guias y novedades sobre tecnologia, smartwatches, luces LED, bocinas Bluetooth y gadgets innovadores. Aprende como mejorar tu negocio con tecnología.',
  keywords: ['blog tecnologia', 'guia smartwatch', 'luces LED consejos', 'bocinas bluetooth tips', 'gadgets 2026', 'tecnologia negocio'],
  openGraph: {
    title: 'Blog de Tecnologia | BoxiTec',
    description: 'Consejos, guias y novedades sobre tecnologia y gadgets innovadores.',
    url: 'https://boxi-store.vercel.app/blog',
    siteName: 'BoxiTec',
    locale: 'es_MX',
    type: 'website',
  },
  alternates: {
    canonical: 'https://boxi-store.vercel.app/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
