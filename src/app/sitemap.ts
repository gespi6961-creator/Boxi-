import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://boxi-store.vercel.app';

const blogPosts = [
  { slug: 'mejores-smartwatches-2025', date: '2025-12-01' },
  { slug: 'luces-led-inteligentes', date: '2025-11-15' },
  { slug: 'audifonos-bluetooth-guia', date: '2025-10-20' },
  { slug: 'gafas-inteligentes-ia', date: '2025-10-01' },
  { slug: 'ahorro-energetico-hogar', date: '2025-09-15' },
  { slug: 'accesorios-tecnologia-necesarios', date: '2025-09-01' },
  { slug: 'como-elegir-smartwatch-perfecto', date: '2025-08-15' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [productosRes, categoriasRes] = await Promise.all([
    supabase.from('productos').select('id, fecha_actualizacion'),
    supabase.from('categorias').select('id, slug'),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/politica-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terminos-condiciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-envios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-devoluciones`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const productPages: MetadataRoute.Sitemap = (productosRes.data ?? []).map((p) => ({
    url: `${BASE_URL}/producto/${p.id}`,
    lastModified: p.fecha_actualizacion ? new Date(p.fecha_actualizacion) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categoriasRes.data ?? []).map((c) => ({
    url: `${BASE_URL}/catalogo/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...categoryPages, ...blogPages];
}
