'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrecio } from '@/lib/utils';

// Datos de ejemplo del carrito
const carritoEjemplo = [
  {
    id: '1',
    nombre: 'Smart Watch Pro X',
    variante: 'Negro - Talla M',
    precio: 999,
    cantidad: 1,
    imagen: null,
  },
  {
    id: '2',
    nombre: 'Kit Luces LED RGB',
    variante: '5 metros',
    precio: 449,
    cantidad: 2,
    imagen: null,
  },
];

export default function CarritoPage() {
  const [carrito, setCarrito] = useState(carritoEjemplo);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(false);
  const [descuento, setDescuento] = useState(0);

  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    setCarrito(carrito.map(item => 
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const eliminarItem = (id: string) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const aplicarCupon = () => {
    // Simular validación de cupón
    if (codigoCupon.toUpperCase() === 'BOXI10') {
      setCuponAplicado(true);
      setDescuento(subtotal * 0.1);
    }
  };

  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const envio = subtotal >= 500 ? 0 : 99;
  const total = subtotal - descuento + envio;

  if (carrito.length === 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Carrito de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-4 flex gap-4"
            >
              {/* Imagen */}
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">📦</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-[#1A1A1A]">{item.nombre}</h3>
                <p className="text-sm text-gray-500">{item.variante}</p>
                <p className="text-lg font-bold text-[#FF6B00] mt-2">
                  {formatPrecio(item.precio)}
                </p>
              </div>

              {/* Controles */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => eliminarItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{item.cantidad}</span>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

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
                <Input
                  type="text"
                  placeholder="Ej: BOXI10"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  disabled={cuponAplicado}
                />
                <Button
                  variant="outline"
                  onClick={aplicarCupon}
                  disabled={cuponAplicado || !codigoCupon}
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {cuponAplicado && (
                <p className="text-sm text-green-600 mt-1">
                  ¡Cupón aplicado! -{formatPrecio(descuento)}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
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
                <span>{formatPrecio(total)}</span>
              </div>
            </div>

            {envio === 0 && (
              <p className="text-sm text-green-600 text-center mb-4">
                ¡Envío gratis en compras mayores a $500!
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
