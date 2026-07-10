'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useCarrito } from '@/hooks/useCarrito';
import { cn } from '@/lib/utils';

const categorias = [
  { nombre: 'Herramientas', slug: 'herramientas' },
  { nombre: 'Mochilas', slug: 'mochilas' },
  { nombre: 'Gaming', slug: 'gaming' },
  { nombre: 'Iluminación', slug: 'iluminacion' },
  { nombre: 'Lentes IA', slug: 'lentes-ia' },
  { nombre: 'Accesorios Auto', slug: 'accesorios-auto' },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const { totalItems } = useCarrito();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/logo_boxi.jpg" alt="BOXI" className="h-12 w-auto" />
          </Link>

          {/* Búsqueda (desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Categorías dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriasAbiertas(!categoriasAbiertas)}
                className="flex items-center space-x-1 text-gray-700 hover:text-[#FF6B00] transition-colors"
              >
                <span>Categorías</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", categoriasAbiertas && "rotate-180")} />
              </button>
              
              {categoriasAbiertas && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border">
                  {categorias.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/catalogo/${cat.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#FF6B00]"
                      onClick={() => setCategoriasAbiertas(false)}
                    >
                      {cat.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/catalogo" className="text-gray-700 hover:text-[#FF6B00] transition-colors">
              Catálogo
            </Link>

            {/* Iconos */}
            <Link href="/cuenta" className="text-gray-700 hover:text-[#FF6B00] transition-colors">
              <User className="w-6 h-6" />
            </Link>

            <Link href="/carrito" className="relative text-gray-700 hover:text-[#FF6B00] transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF6B00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="px-4 py-2 border-t">
            <p className="text-sm font-medium text-gray-500 mb-2">Categorías</p>
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogo/${cat.slug}`}
                className="block py-2 text-gray-700 hover:text-[#FF6B00]"
                onClick={() => setMenuAbierto(false)}
              >
                {cat.nombre}
              </Link>
            ))}
          </div>

          <div className="px-4 py-3 border-t">
            <Link
              href="/catalogo"
              className="block py-2 text-gray-700 hover:text-[#FF6B00]"
              onClick={() => setMenuAbierto(false)}
            >
              Ver catálogo completo
            </Link>
            <Link
              href="/cuenta"
              className="block py-2 text-gray-700 hover:text-[#FF6B00]"
              onClick={() => setMenuAbierto(false)}
            >
              Mi cuenta
            </Link>
            <Link
              href="/carrito"
              className="flex items-center justify-between py-2 text-gray-700 hover:text-[#FF6B00]"
              onClick={() => setMenuAbierto(false)}
            >
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="bg-[#FF6B00] text-white text-xs font-bold rounded-full px-2 py-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
