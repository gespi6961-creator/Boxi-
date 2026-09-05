import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalogo de Productos | BoxiTec - Tecnologia y Gadgets',
  description: 'Explora nuestro catalogo de smartwatches, lentes IA, bocinas Bluetooth, luces LED y gadgets innovadores. Envio gratis en compras mayores a $1,000 MXN.',
  keywords: ['catalogo tecnologia', 'smartwatch mexico', 'lentes inteligentes', 'bocina bluetooth', 'luces LED', 'gadgets baratos', 'accesorios tecnologia'],
  openGraph: {
    title: 'Catalogo de Productos | BoxiTec',
    description: 'Descubre los mejores gadgets y accesorios tecnologicos con envio gratis a todo Mexico.',
    url: 'https://boxi-store.vercel.app/catalogo',
    siteName: 'BoxiTec',
    locale: 'es_MX',
    type: 'website',
  },
  alternates: {
    canonical: 'https://boxi-store.vercel.app/catalogo',
  },
};

export default function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
