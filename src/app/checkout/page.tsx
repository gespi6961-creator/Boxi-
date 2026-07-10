'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Truck, Check, ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrecio } from '@/lib/utils';

// Datos bancarios para transferencia
const datosBancarios = {
  banco: 'BBVA México',
  titular: 'BOXI TECNOLOGÍA SA DE CV',
  clabe: '012 345 678 901 234 567',
  cuenta: '1234567890',
  referencia: 'Tu número de pedido',
};

export default function CheckoutPage() {
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    numero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    referencias: '',
  });

  // Carrito de ejemplo (luego viene del hook)
  const carrito = [
    { id: '1', nombre: 'Teclado Mecánico RGB', variante: 'RGB Blue', precio: 649, cantidad: 1 },
    { id: '2', nombre: 'Kit Luces LED 5m', variante: '5 metros', precio: 299, cantidad: 2 },
  ];

  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const envio = subtotal >= 500 ? 0 : 99;
  const total = subtotal + envio;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paso === 1) {
      setPaso(2);
      return;
    }

    if (paso === 2) {
      setPaso(3);
      return;
    }

    // Paso 3: Crear pedido
    setEnviando(true);
    
    // Simular creación de pedido
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const numPedido = 'BOXI-' + Date.now().toString().slice(-6);
    setNumeroPedido(numPedido);
    setPedidoCreado(true);
    setEnviando(false);
  };

  const copiarCLABE = () => {
    navigator.clipboard.writeText(datosBancarios.clabe.replace(/\s/g, ''));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Pedido creado
  if (pedidoCreado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">¡Pedido Confirmado!</h1>
        <p className="text-gray-600 mb-2">Tu número de pedido es:</p>
        <p className="text-2xl font-bold text-[#FF6B00] mb-6">{numeroPedido}</p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-[#1A1A1A] mb-4">Instrucciones de pago</h3>
          <p className="text-gray-600 mb-4">
            Realiza una transferencia bancaria con los siguientes datos:
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Banco:</span>
              <span className="font-medium">{datosBancarios.banco}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Titular:</span>
              <span className="font-medium">{datosBancarios.titular}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CLABE:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{datosBancarios.clabe}</span>
                <button onClick={copiarCLABE} className="text-[#FF6B00] hover:text-[#CC5500]">
                  {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referencia:</span>
              <span className="font-medium text-[#FF6B00]">{numeroPedido}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="font-bold text-lg">{formatPrecio(total)}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Una vez que confirmemos tu pago, enviaremos tu pedido. 
          Puedes contactarnos por WhatsApp para mayor rapidez.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogo">
            <Button variant="outline">Seguir Comprando</Button>
          </Link>
          <a href={`https://wa.me/521XXXXXXXXXX?text=Hola, realicé el pedido ${numeroPedido}`} target="_blank">
            <Button>Contactar por WhatsApp</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((pasoNumero, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                pasoNumero <= paso 
                  ? 'bg-[#FF6B00] text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {pasoNumero < paso ? <Check className="w-4 h-4" /> : pasoNumero}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">
                {pasoNumero === 1 ? 'Datos' : pasoNumero === 2 ? 'Envío' : 'Pago'}
              </span>
              {index < 2 && <div className="w-16 sm:w-32 h-1 bg-gray-200 mx-2"><div className={`h-full ${pasoNumero < paso ? 'bg-[#FF6B00]' : ''}`}></div></div>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            {/* Paso 1: Datos personales */}
            {paso === 1 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Datos Personales
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre completo"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Teléfono"
                    name="telefono"
                    type="tel"
                    value={formulario.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Dirección de envío */}
            {paso === 2 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Dirección de Envío
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Calle"
                      name="direccion"
                      value={formulario.direccion}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Input
                    label="Número"
                    name="numero"
                    value={formulario.numero}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Colonia"
                    name="colonia"
                    value={formulario.colonia}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Ciudad"
                    name="ciudad"
                    value={formulario.ciudad}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Estado"
                    name="estado"
                    value={formulario.estado}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Código Postal"
                    name="codigoPostal"
                    value={formulario.codigoPostal}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Referencias (opcional)"
                    name="referencias"
                    value={formulario.referencias}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Paso 3: Método de pago */}
            {paso === 3 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#FF6B00] text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Método de Pago
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-800 font-medium">
                    <CreditCard className="w-5 h-5" />
                    Transferencia Bancaria
                  </div>
                  <p className="text-sm text-blue-600 mt-2">
                    Realiza una transferencia con los datos que te proporcionaremos al confirmar el pedido.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-[#1A1A1A] mb-3">Datos bancarios:</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Banco:</span> {datosBancarios.banco}</p>
                    <p><span className="text-gray-600">Titular:</span> {datosBancarios.titular}</p>
                    <p><span className="text-gray-600">Cuenta:</span> {datosBancarios.cuenta}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  * Al confirmar recibirás los datos completos para realizar la transferencia.
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              {paso > 1 && (
                <Button type="button" variant="outline" onClick={() => setPaso(paso - 1)}>
                  Anterior
                </Button>
              )}
              <Button type="submit" loading={enviando} className="flex-1">
                {paso === 3 ? 'Confirmar Pedido' : 'Siguiente'}
              </Button>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-[#1A1A1A] mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-4">
                {carrito.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-gray-500">{item.variante} x{item.cantidad}</p>
                    </div>
                    <span>{formatPrecio(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrecio(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Envío
                  </span>
                  <span>{envio === 0 ? 'Gratis' : formatPrecio(envio)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrecio(total)}</span>
                </div>
              </div>

              {envio === 0 && (
                <p className="text-sm text-green-600 text-center mt-4">
                  ¡Envío gratis!
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      <Link href="/carrito" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mt-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al carrito
      </Link>
    </div>
  );
}
