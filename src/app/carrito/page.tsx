'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatPrecio } from '@/lib/utils';
import { useCarrito } from '@/hooks/useCarrito';

export default function CarritoPage() {
  const { items, cupon, isLoaded, subtotal, descuento, total, actualizarCantidad, eliminar, aplicarCupon, removerCupon } = useCarrito();
  const [codigoCupon, setCodigoCupon] = useState('');
  const [errorCupon, setErrorCupon] = useState('');
  const [exitoCupon, setExitoCupon] = useState('');
  const [cargandoCupon, setCargandoCupon] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando carrito...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-6">Agrega productos para comenzar a comprar</p>
        <Link href="/catalogo">
          <Button>Ver Catálogo</Button>
        </Link>
      </div>
    );
  }

  const envio = subtotal >= 1000 ? 0 : 99;
  const totalFinal = total + envio;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Carrito de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const precio = item.variante.precio ?? item.producto.precio_base;
            return (
              <div
                key={item.variante.id}
                className="bg-white border rounded-xl p-4 flex gap-4"
              >
                {/* Imagen */}
                <Link href={`/producto/${item.producto.id}`} className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                  {item.producto.imagen_url ? (
                    <Image
                      src={item.producto.imagen_url}
                      alt={item.producto.nombre}
                      fill
                      sizes="96px"
                      className="object-cover"
                      quality={70}
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link href={`/producto/${item.producto.id}`}>
                    <h3 className="font-semibold text-[#1A1A1A] hover:text-[#FF6B00] transition-colors">{item.producto.nombre}</h3>
                  </Link>
                  <p className="text-sm text-gray-500">{item.variante.nombre}</p>
                  <p className="text-lg font-bold text-[#FF6B00] mt-2">
                    {formatPrecio(precio)}
                  </p>
                </div>

                {/* Controles */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => eliminar(item.variante.id)}
                    aria-label="Eliminar producto"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.variante.id, item.cantidad - 1)}
                      aria-label="Reducir cantidad"
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.variante.id, item.cantidad + 1)}
                      aria-label="Aumentar cantidad"
                      className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/catalogo"
            className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Seguir comprando
          </Link>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Resumen</h2>

            {/* Cupón */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Código de descuento
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: BOXI10"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  disabled={!!cupon}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00] disabled:bg-gray-100"
                />
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!codigoCupon) return;
                    setCargandoCupon(true);
                    setErrorCupon('');
                    setExitoCupon('');
                    try {
                      const { getSupabase } = await import('@/lib/supabase');
                      const supabase = getSupabase();
                      const { data, error } = await supabase
                        .from('cupones')
                        .select('*')
                        .eq('codigo', codigoCupon.toUpperCase())
                        .eq('activo', true)
                        .single();
                      if (data) {
                        aplicarCupon(data);
                        setExitoCupon(`¡Cupón aplicado! -${data.tipo === 'porcentaje' ? `${data.valor}%` : formatPrecio(data.valor)}`);
                        setErrorCupon('');
                      } else {
                        setErrorCupon('Cupón no válido');
                        setExitoCupon('');
                      }
                    } catch {
                      setErrorCupon('Error al validar cupón');
                      setExitoCupon('');
                    } finally {
                      setCargandoCupon(false);
                    }
                  }}
                  disabled={!!cupon || !codigoCupon || cargandoCupon}
                >
                  {cargandoCupon ? (
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Tag className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errorCupon && (
                <p className="text-sm text-red-500 mt-2">{errorCupon}</p>
              )}
              {exitoCupon && !cupon && (
                <p className="text-sm text-green-600 mt-2">{exitoCupon}</p>
              )}
              {cupon && (
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-green-600">
                    ¡Cupón {cupon.codigo} aplicado! -{formatPrecio(descuento)}
                  </p>
                  <button onClick={() => { removerCupon(); setExitoCupon(''); setCodigoCupon(''); }} className="text-xs text-red-500 hover:underline">Quitar</button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} productos)</span>
                <span>{formatPrecio(subtotal)}</span>
              </div>
              {descuento > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrecio(descuento)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span>{envio === 0 ? 'Gratis' : formatPrecio(envio)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-[#1A1A1A]">
                <span>Total</span>
                <span>{formatPrecio(totalFinal)}</span>
              </div>
            </div>

            {envio === 0 && (
              <p className="text-sm text-green-600 text-center mb-4">
                ¡Envío gratis en compras mayores a $1,000!
              </p>
            )}

            <Link href="/checkout">
              <Button className="w-full" size="lg">
                Continuar al Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
