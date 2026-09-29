import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { AuthProvider } from "@/lib/auth";
import { CarritoProvider } from "@/hooks/useCarrito";
import { FavoritosProvider } from "@/hooks/useFavoritos";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BoxiTec | Smartwatches, Gadgets y Tecnologia - Envio Gratis +$1,000",
    template: "%s | BoxiTec",
  },
  description: "Compra smartwatches, lentes IA, bocinas Bluetooth, luces LED y gadgets innovadores en BoxiTec. Envio gratis en compras +$1,000 MXN. Garantia incluida.",
  keywords: ["tecnologia", "gadgets", "smartwatch", "gaming", "LED", "lentes IA", "accesorios", "bocina bluetooth", "envio gratis mexico", "tienda online mexico", "tecnologia barata"],
  authors: [{ name: "BoxiTec" }],
  creator: "BoxiTec",
  publisher: "BoxiTec",
  metadataBase: new URL("https://boxi-store.vercel.app"),
  openGraph: {
    title: "BoxiTec | Smartwatches, Gadgets y Tecnologia",
    description: "Compra smartwatches, lentes IA, bocinas Bluetooth, luces LED y gadgets innovadores. Envio gratis en compras +$1,000 MXN.",
    url: "https://boxi-store.vercel.app",
    siteName: "BoxiTec",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/logo_boxi.jpg",
        width: 800,
        height: 600,
        alt: "BoxiTec - Tienda de Tecnologia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BoxiTec | Smartwatches, Gadgets y Tecnologia",
    description: "Compra smartwatches, lentes IA, bocinas Bluetooth, luces LED y gadgets innovadores. Envio gratis en compras +$1,000 MXN.",
    images: ["/logo_boxi.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://boxi-store.vercel.app",
  },
  other: {
    "google-site-verification": "PbYskF-xKm3X158qARbORBr8ohYeTm3ZNQ7iaOO4kgI",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BoxiTec",
  "url": "https://boxi-store.vercel.app",
  "description": "Tienda de tecnologia y gadgets innovadores con envio gratis a todo Mexico",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://boxi-store.vercel.app/catalogo?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BoxiTec",
  "url": "https://boxi-store.vercel.app",
  "logo": "https://boxi-store.vercel.app/logo_boxi.jpg",
  "description": "Tienda de tecnologia y gadgets innovadores",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle San Ignacio No. 105, Fraccionamiento Santa Anita",
    "addressLocality": "Tecate",
    "addressRegion": "Baja California",
    "postalCode": "21453",
    "addressCountry": "MX",
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+52-665-142-3910",
    "contactType": "customer service",
    "availableLanguage": "Spanish",
  },
  "sameAs": [
    "https://www.instagram.com/boxi_tech",
    "https://www.tiktok.com/@gioespi1",
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "BoxiTec",
  "image": "https://boxi-store.vercel.app/logo_boxi.jpg",
  "url": "https://boxi-store.vercel.app",
  "telephone": "+52-665-142-3910",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle San Ignacio No. 105, Fraccionamiento Santa Anita",
    "addressLocality": "Tecate",
    "addressRegion": "Baja California",
    "postalCode": "21453",
    "addressCountry": "MX",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 32.5427,
    "longitude": -116.6519,
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "18:00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${inter.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <CarritoProvider>
            <FavoritosProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
            </FavoritosProvider>
          </CarritoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
