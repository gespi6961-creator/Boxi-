import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <Image src="/logo_boxi_horizontal.jpg" alt="BoxiTec" width={160} height={56} className="h-14 w-auto" />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Donde la tecnología cobra vida. Encuentra los mejores gadgets, 
              accesorios y productos tech para cada momento de tu día.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/giovis.espinosa/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@gioespi1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-5.58-2.7V6.69h5.58z"/></svg>
              </a>
            </div>
          </div>

          {/* Enlaces rapidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Catalogo
                </Link>
              </li>
              <li>
                <Link href="/catalogo?ofertas=true" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/cuenta" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Mi Cuenta
                </Link>
              </li>
              <li>
                <Link href="/cuenta/pedidos" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Mis Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo?categoria=iluminacion" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Iluminación
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=tecnologia-y-accesorios" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Tecnología y Accesorios
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=automotriz" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Automotriz
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=bocinas-y-audio" className="text-gray-400 hover:text-[#C85A00] transition-colors">
                  Bocinas y Audio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contacto y Mapa */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>boxitec.tech@gmail.com</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+526651423910" className="hover:text-[#C85A00] transition-colors">+52 665 142 3910</a>
              </div>
              <div className="flex items-start justify-center md:justify-start space-x-2 text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Swapmeet Encinos, Encinos No.800, Local 327</p>
                  <p>Tecate, Baja California, C.P. 21480</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Swapmeet+Encinos+Encinos+No.800+Local+327+Tecate+Baja+California+21480"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#C85A00] hover:text-[#A04800] text-sm font-medium transition-colors"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Abrir en Google Maps
              </a>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-800">
              <iframe
                src="https://www.google.com/maps?q=Swapmeet+Encinos,+Encinos+No.800,+Local+327,+Tecate,+Baja+California,+C.P.+21480&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de BoxiTec"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BoxiTec. Todos los derechos reservados.</p>
          <p className="mt-1">Donde la tecnología cobra vida</p>
        </div>
      </div>
    </footer>
  );
}
