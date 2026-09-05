'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search, User, ChevronDown, Home, Grid3X3, Heart, Phone } from 'lucide-react';
import { useCarrito } from '@/hooks/useCarrito';
import { cn } from '@/lib/utils';
import { getSupabase } from '@/lib/supabase';

interface Categoria {
  nombre: string;
  slug: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaAbierta, setBusquedaAbierta] = useState(false);
  const { totalItems } = useCarrito();

  useEffect(() => {
    async function cargarCategorias() {
      const supabase = getSupabase();
      const { data } = await supabase
        .from('categorias')
        .select('nombre, slug')
        .eq('activa', true)
        .order('orden');
      if (data) setCategorias(data);
    }
    cargarCategorias();
  }, []);

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      setBusquedaAbierta(false);
      router.push(`/catalogo?busqueda=${encodeURIComponent(busqueda.trim())}`);
    }
  };

  return (
    <>
      {/* Navbar principal - Desktop */}
      <nav className="bg-white shadow-md sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/logo_boxi_horizontal.jpg" alt="BoxiTec" width={120} height={40} className="h-10 w-auto" priority />
            </Link>

            {/* Busqueda desktop */}
            <div className="flex-1 max-w-lg mx-8">
              <form onSubmit={handleBusqueda} className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A00] focus:border-transparent"
                />
                <button type="submit" aria-label="Buscar" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400 hover:text-[#C85A00]" />
                </button>
              </form>
            </div>

            {/* Navegacion desktop */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#C85A00] transition-colors"
                >
                  <span>Categorias</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", categoriasAbiertas && "rotate-180")} />
                </button>
                
                {categoriasAbiertas && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border">
                    {categorias.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/catalogo?categoria=${cat.slug}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#C85A00]"
                        onClick={() => setCategoriasAbiertas(false)}
                      >
                        {cat.nombre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            <Link href="/catalogo" className="text-gray-700 hover:text-[#C85A00] transition-colors">
              Catalogo
            </Link>

            <Link href="/blog" className="text-gray-700 hover:text-[#C85A00] transition-colors">
              Blog
            </Link>

              <Link href="/cuenta" aria-label="Mi cuenta" className="text-gray-700 hover:text-[#C85A00] transition-colors">
                <User className="w-6 h-6" />
              </Link>

              <Link href="/carrito" aria-label="Ver carrito" className="relative text-gray-700 hover:text-[#C85A00] transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C85A00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Navbar movil - Top */}
      <nav className="bg-white shadow-md sticky top-0 z-50 md:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/logo_boxi_horizontal.jpg" alt="BoxiTec" width={100} height={32} className="h-8 w-auto" priority />
            </Link>

            {/* Iconos derecha */}
            <div className="flex items-center gap-2">
              {/* Busqueda */}
              <button
                onClick={() => setBusquedaAbierta(!busquedaAbierta)}
                aria-label="Buscar"
                className="p-2 text-gray-700 hover:text-[#C85A00] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Carrito */}
              <Link href="/carrito" aria-label="Ver carrito" className="relative p-2 text-gray-700 hover:text-[#C85A00] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#C85A00] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Menu hamburguesa */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
                className="p-2 text-gray-700 hover:text-[#C85A00] transition-colors"
              >
                {menuAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Barra de busqueda expandible movil */}
          {busquedaAbierta && (
            <form onSubmit={handleBusqueda} className="mt-3 relative animate-in slide-in-from-top">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00] bg-gray-50"
              />
              <button
                type="button"
                onClick={() => { setBusquedaAbierta(false); setBusqueda(''); }}
                aria-label="Cerrar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Boton de categorias movil */}
        <div className="border-t px-4 py-2">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-[#C85A00] transition-colors"
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Ver categorias</span>
            <ChevronDown className={cn("w-4 h-4 transition-transform", menuAbierto && "rotate-180")} />
          </button>
        </div>

        {/* Menu movil expandible */}
        {menuAbierto && (
          <div className="border-t bg-white animate-in slide-in-from-top">
            {/* Categorias */}
            <div className="px-4 py-3 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Categorias</p>
              <div className="grid grid-cols-2 gap-2">
                {categorias.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/catalogo?categoria=${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-[#C85A00] hover:text-white transition-colors"
                    onClick={() => setMenuAbierto(false)}
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="px-4 py-3">
              <Link
                href="/catalogo"
                className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-[#C85A00]"
                onClick={() => setMenuAbierto(false)}
              >
                <Grid3X3 className="w-5 h-5" />
                Ver catalogo completo
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-[#C85A00]"
                onClick={() => setMenuAbierto(false)}
              >
                📝 Blog
              </Link>
              <Link
                href="/cuenta"
                className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-[#C85A00]"
                onClick={() => setMenuAbierto(false)}
              >
                <User className="w-5 h-5" />
                Mi cuenta
              </Link>
              <Link
                href="/cuenta/favoritos"
                className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-[#C85A00]"
                onClick={() => setMenuAbierto(false)}
              >
                <Heart className="w-5 h-5" />
                Favoritos
              </Link>
              <a
                href="tel:+526651423910"
                className="flex items-center gap-3 py-2.5 text-gray-700 hover:text-[#C85A00]"
                onClick={() => setMenuAbierto(false)}
              >
                <Phone className="w-5 h-5" />
                Llamar ahora
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Barra de navegacion inferior - Solo movil */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 py-1">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
              pathname === '/' ? "text-[#C85A00]" : "text-gray-500"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Inicio</span>
          </Link>

          <Link
            href="/catalogo"
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
              pathname === '/catalogo' ? "text-[#C85A00]" : "text-gray-500"
            )}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Catalogo</span>
          </Link>

          <Link
            href="/carrito"
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg transition-colors relative",
              pathname === '/carrito' ? "text-[#C85A00]" : "text-gray-500"
            )}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C85A00] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">Carrito</span>
          </Link>

          <Link
            href="/cuenta/favoritos"
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
              pathname === '/cuenta/favoritos' ? "text-[#C85A00]" : "text-gray-500"
            )}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Favoritos</span>
          </Link>

          <Link
            href="/cuenta"
            className={cn(
              "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
              pathname === '/cuenta' ? "text-[#C85A00]" : "text-gray-500"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Cuenta</span>
          </Link>
        </div>
      </div>

      {/* Spacer para la barra inferior en movil */}
      <div className="h-16 md:hidden" />
    </>
  );
}
