'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CreditCard, Truck, Check, ArrowLeft, Copy, CheckCircle,
  ShoppingBag, Landmark, Lock, AlertCircle,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrecio } from '@/lib/utils';
import { useCarrito } from '@/hooks/useCarrito';
import { useAuth } from '@/lib/auth';

/* ──────────── Datos bancarios (transferencia) ──────────── */
const datosBancarios = {
  banco: 'BBVA Mexico',
  titular: 'BOXI TECNOLOGIA SA DE CV',
  clabe: '012 345 678 901 234 567',
  cuenta: '1234567890',
};

/* ──────────── Tipos ──────────── */
type MetodoPago = 'tarjeta' | 'transferencia';

interface TarjetaDatos {
  titular: string;
  numero: string;
  expMes: string;
  expAno: string;
  cvv: string;
}

/* ──────────── Helpers ──────────── */
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}

function getCardBrand(number: string): string {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^6(?:011|5)/.test(n)) return 'Discover';
  return '';
}

/* ──────────── Componente visual de tarjeta ──────────── */
function CardPreview({ datos, brand }: { datos: TarjetaDatos; brand: string }) {
  return (
    <div className="relative w-full max-w-sm mx-auto mb-6">
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333] rounded-2xl p-6 text-white shadow-xl aspect-[1.586/1] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-7 bg-yellow-400 rounded-md" />
          <span className="text-sm font-bold tracking-wider">{brand || 'TARJETA'}</span>
        </div>
        <div>
          <p className="text-lg tracking-[0.2em] font-mono mb-3">
            {datos.numero || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Titular</p>
              <p className="text-sm font-medium uppercase tracking-wide">
                {datos.titular || 'NOMBRE APELLIDO'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase">Vence</p>
              <p className="text-sm font-medium">
                {datos.expMes && datos.expAno ? `${datos.expMes}/${datos.expAno}` : 'MM/AA'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════ */
/*                    PAGE PRINCIPAL                       */
/* ════════════════════════════════════════════════════════ */
export default function CheckoutPage() {
  const { items, subtotal, cupon, descuento, limpiar } = useCarrito();
  const { user } = useAuth();
  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');
  const [totalGuardado, setTotalGuardado] = useState(0);
  const [subtotalGuardado, setSubtotalGuardado] = useState(0);
  const [descuentoGuardado, setDescuentoGuardado] = useState(0);
  const [envioGuardado, setEnvioGuardado] = useState(0);
  const [metodoGuardado, setMetodoGuardado] = useState<MetodoPago>('tarjeta');
  const cardRef = useRef<HTMLDivElement>(null);

  /* ──── Datos personales ──── */
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

  /* ──── Datos tarjeta ──── */
  const [tarjeta, setTarjeta] = useState<TarjetaDatos>({
    titular: '',
    numero: '',
    expMes: '',
    expAno: '',
    cvv: '',
  });
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState('');

  const envio = subtotal >= 1000 ? 0 : 99;
  const total = subtotal - descuento + envio;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  /* ──── Auto-llenar si esta logueado ──── */
  useEffect(() => {
    if (user && !formulario.email) {
      const meta = user.user_metadata || {};
      setFormulario((prev) => ({
        ...prev,
        nombre: prev.nombre || (meta.nombre ? `${meta.nombre} ${meta.apellido || ''}`.trim() : ''),
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  /* ──── Manejo de tarjeta ──── */
  const handleTarjetaChange = (field: keyof TarjetaDatos, value: string) => {
    let formatted = value;

    if (field === 'numero') {
      formatted = formatCardNumber(value);
    } else if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'expMes') {
      const digits = value.replace(/\D/g, '').slice(0, 2);
      const num = parseInt(digits, 10);
      formatted = num > 12 ? '12' : digits;
    } else if (field === 'expAno') {
      formatted = value.replace(/\D/g, '').slice(0, 2);
    }

    setTarjeta((prev) => ({ ...prev, [field]: formatted }));
  };

  const cardBrand = getCardBrand(tarjeta.numero);

  /* ══════════════════════════════════════════════════════ */
  /*                    SUBMIT                              */
  /* ══════════════════════════════════════════════════════ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Paso 1 → 2
    if (paso === 1) {
      if (!formulario.nombre || !formulario.email || !formulario.telefono) {
        setError('Completa todos los campos');
        return;
      }
      setPaso(2);
      return;
    }

    // Paso 2 → 3
    if (paso === 2) {
      if (!formulario.direccion || !formulario.ciudad || !formulario.estado || !formulario.codigoPostal) {
        setError('Completa la direccion');
        return;
      }
      setPaso(3);
      return;
    }

    // Paso 3 — Validar metodo de pago
    if (metodoPago === 'tarjeta') {
      if (!tarjeta.titular || !tarjeta.numero || !tarjeta.expMes || !tarjeta.expAno || !tarjeta.cvv) {
        setError('Completa todos los datos de la tarjeta');
        return;
      }
      if (tarjeta.numero.replace(/\s/g, '').length < 16) {
        setError('Numero de tarjeta invalido');
        return;
      }
      if (tarjeta.cvv.length < 3) {
        setError('CVV invalido');
        return;
      }
    }

    // Crear pedido
    setEnviando(true);
    setErrorPago('');
    const supabase = getSupabase();

    try {
      // 1. Guardar o actualizar cliente
      let clienteId = null;
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', formulario.email)
        .single();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
        await supabase.from('clientes').update({
          nombre: formulario.nombre,
          telefono: formulario.telefono,
          direccion: {
            calle: formulario.direccion,
            numero: formulario.numero,
            colonia: formulario.colonia,
            ciudad: formulario.ciudad,
            estado: formulario.estado,
            codigo_postal: formulario.codigoPostal,
            referencias: formulario.referencias,
          },
        }).eq('id', clienteId);
      } else {
        const { data: nuevoCliente } = await supabase.from('clientes').insert({
          nombre: formulario.nombre,
          email: formulario.email,
          telefono: formulario.telefono,
          direccion: {
            calle: formulario.direccion,
            numero: formulario.numero,
            colonia: formulario.colonia,
            ciudad: formulario.ciudad,
            estado: formulario.estado,
            codigo_postal: formulario.codigoPostal,
            referencias: formulario.referencias,
          },
          origen_registro: 'web',
        }).select('id').single();
        clienteId = nuevoCliente?.id;
      }

      // 2. Generar numero de pedido
      const numPedido = 'BOXI-' + Date.now().toString().slice(-6);

      // 3. Si es tarjeta, procesar pago con Stripe
      let stripePaymentId = null;
      if (metodoPago === 'tarjeta') {
        setProcesandoPago(true);

        const res = await fetch('/api/payment/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'mxn',
            pedidoId: numPedido,
            email: formulario.email,
            description: `Pedido ${numPedido} - BoxiTec`,
          }),
        });

        const paymentData = await res.json();

        if (!res.ok) {
          throw new Error(paymentData.error || 'Error al procesar el pago con tarjeta');
        }

        stripePaymentId = paymentData.paymentIntentId;

        // Verificar que el pago fue exitoso
        const verifyRes = await fetch(`/api/payment/verify?payment_intent=${stripePaymentId}`);
        const verifyData = await verifyRes.json();

        if (verifyData.status !== 'succeeded') {
          throw new Error('El pago no fue completado. Intenta de nuevo.');
        }

        setProcesandoPago(false);
      }

      // 4. Crear pedido
      const { data: pedido, error: errorPedido } = await supabase.from('pedidos').insert({
        numero_pedido: numPedido,
        cliente_id: clienteId,
        estado: metodoPago === 'tarjeta' ? 'pagado' : 'pendiente',
        subtotal,
        descuento,
        envio,
        total,
        metodo_pago: metodoPago,
        datos_pago: metodoPago === 'tarjeta'
          ? { stripe_payment_id: stripePaymentId, card_brand: cardBrand }
          : { banco: datosBancarios.banco, clabe: datosBancarios.clabe },
        direccion_envio: {
          calle: formulario.direccion,
          numero: formulario.numero,
          colonia: formulario.colonia,
          ciudad: formulario.ciudad,
          estado: formulario.estado,
          codigo_postal: formulario.codigoPostal,
          referencias: formulario.referencias,
        },
        notas: `Cliente: ${formulario.nombre} | Tel: ${formulario.telefono} | Email: ${formulario.email}`,
      }).select('id').single();

      if (errorPedido) throw errorPedido;

      // 5. Guardar detalles
      const detalles = items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto.id,
        variante_id: item.variante.id?.startsWith('default-') ? null : item.variante.id,
        cantidad: item.cantidad,
        precio_unitario: item.variante.precio ?? item.producto.precio_base,
        subtotal: (item.variante.precio ?? item.producto.precio_base) * item.cantidad,
      }));

      const { error: errorDetalles } = await supabase.from('pedido_detalles').insert(detalles);
      if (errorDetalles) throw errorDetalles;

      // 6. Totales
      setSubtotalGuardado(subtotal);
      setDescuentoGuardado(descuento);
      setEnvioGuardado(envio);
      setTotalGuardado(total);
      setMetodoGuardado(metodoPago);

      // 7. WhatsApp
      let mensaje = `Hola, realice el pedido *${numPedido}*\n\n*Productos:*\n`;
      items.forEach((item) => {
        const precio = item.variante.precio ?? item.producto.precio_base;
        mensaje += `- ${item.producto.nombre} x${item.cantidad} = ${formatPrecio(precio * item.cantidad)}\n`;
      });
      mensaje += `\n*Subtotal:* ${formatPrecio(subtotal)}`;
      if (descuento > 0) mensaje += `\n*Descuento:* -${formatPrecio(descuento)}`;
      mensaje += `\n*Envio:* ${envio === 0 ? 'Gratis' : formatPrecio(envio)}`;
      mensaje += `\n*Total:* ${formatPrecio(total)}`;
      mensaje += `\n*Metodo de pago:* ${metodoPago === 'tarjeta' ? 'Tarjeta (' + cardBrand + ')' : 'Transferencia'}`;
      mensaje += `\n\n${metodoPago === 'tarjeta' ? 'Pago confirmado automaticamente.' : '¿Cual es el tiempo de entrega?'}`;
      const urlWhatsApp = `https://wa.me/526651423910?text=${encodeURIComponent(mensaje)}`;

      // 8. Enviar email de confirmacion
      try {
        const emailData = {
          numeroPedido: numPedido,
          nombre: formulario.nombre,
          email: formulario.email,
          telefono: formulario.telefono,
          items: items.map((item) => ({
            nombre: item.producto.nombre,
            cantidad: item.cantidad,
            precio: item.variante.precio ?? item.producto.precio_base,
            variante: item.variante.nombre,
          })),
          subtotal,
          descuento,
          envio,
          total,
          metodoPago,
          direccionEnvio: {
            calle: formulario.direccion,
            numero: formulario.numero,
            colonia: formulario.colonia,
            ciudad: formulario.ciudad,
            estado: formulario.estado,
            codigoPostal: formulario.codigoPostal,
          },
          cardBrand: metodoPago === 'tarjeta' ? cardBrand : undefined,
        };

        await fetch('/api/email/pedido', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });
        console.log('Email de confirmacion enviado');
      } catch (emailError) {
        console.error('Error al enviar email:', emailError);
        // No fallar el pedido si el email falla
      }

      // 9. Limpiar carrito
      limpiar();
      setNumeroPedido(numPedido);
      setPedidoCreado(true);

      // 9. Abrir WhatsApp
      window.open(urlWhatsApp, '_blank');
    } catch (err: unknown) {
      console.error('Error:', err);
      let msg = 'Error desconocido al procesar el pedido';
      if (err instanceof Error) {
        msg = err.message;
      } else if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        msg = (e.message as string) || (e.error as string) || JSON.stringify(err);
      }
      setError(msg);
    }

    setEnviando(false);
    setProcesandoPago(false);
  };

  const copiarCLABE = () => {
    navigator.clipboard.writeText(datosBancarios.clabe.replace(/\s/g, ''));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  /* ══════════════════════════════════════════════════════ */
  /*                  EMPTY / SUCCESS                      */
  /* ══════════════════════════════════════════════════════ */
  if (items.length === 0 && !pedidoCreado) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Tu carrito esta vacio</h1>
        <p className="text-gray-600 mb-6">Agrega productos antes de continuar</p>
        <Link href="/catalogo">
          <Button>Ver Catalogo</Button>
        </Link>
      </div>
    );
  }

  if (pedidoCreado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">
          {metodoGuardado === 'tarjeta' ? 'Pago Recibido!' : 'Pedido Confirmado!'}
        </h1>
        <p className="text-gray-600 mb-2">Tu numero de pedido es:</p>
        <p className="text-2xl font-bold text-[#C85A00] mb-6">{numeroPedido}</p>

        {metodoGuardado === 'transferencia' ? (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Instrucciones de pago</h3>
            <p className="text-gray-600 mb-4">Realiza una transferencia bancaria con los siguientes datos:</p>
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
                  <button onClick={copiarCLABE} className="text-[#C85A00] hover:text-[#A04800]">
                    {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Referencia:</span>
                <span className="font-medium text-[#C85A00]">{numeroPedido}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-bold text-lg">{formatPrecio(totalGuardado)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Pago con tarjeta confirmado</h3>
            </div>
            <p className="text-green-700 text-sm">
              Tu pago de <strong>{formatPrecio(totalGuardado)}</strong> fue procesado exitosamente.
              Recibirás un comprobante por correo electronico.
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          {metodoGuardado === 'tarjeta'
            ? 'Tu pedido sera preparado y enviado a la brevedad.'
            : 'Una vez que confirmemos tu pago, enviaremos tu pedido. Puedes contactarnos por WhatsApp para mayor rapidez.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogo">
            <Button variant="outline">Seguir Comprando</Button>
          </Link>
          <a
            href={`https://wa.me/526651423910?text=Hola, realice el pedido ${numeroPedido}. ${
              metodoGuardado === 'tarjeta' ? 'Pago con tarjeta.' : '¿Podrian confirmar la disponibilidad?'
            }`}
            target="_blank"
          >
            <Button>Contactar por WhatsApp</Button>
          </a>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════ */
  /*                    CHECKOUT                           */
  /* ══════════════════════════════════════════════════════ */
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
                  ? 'bg-[#C85A00] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {pasoNumero < paso ? <Check className="w-4 h-4" /> : pasoNumero}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">
                {pasoNumero === 1 ? 'Datos' : pasoNumero === 2 ? 'Envio' : 'Pago'}
              </span>
              {index < 2 && (
                <div className="w-16 sm:w-32 h-1 bg-gray-200 mx-2">
                  <div className={`h-full ${pasoNumero < paso ? 'bg-[#C85A00]' : ''}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* ═══════ PASO 1: Datos personales ═══════ */}
            {paso === 1 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#C85A00] text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Datos Personales
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Nombre completo" name="nombre" value={formulario.nombre} onChange={handleInputChange} required />
                  <Input label="Email" name="email" type="email" value={formulario.email} onChange={handleInputChange} required />
                  <Input label="Telefono" name="telefono" type="tel" value={formulario.telefono} onChange={handleInputChange} required />
                </div>
              </div>
            )}

            {/* ═══════ PASO 2: Direccion ═══════ */}
            {paso === 2 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#C85A00] text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Direccion de Envio
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input label="Calle" name="direccion" value={formulario.direccion} onChange={handleInputChange} required />
                  </div>
                  <Input label="Numero" name="numero" value={formulario.numero} onChange={handleInputChange} required />
                  <Input label="Colonia" name="colonia" value={formulario.colonia} onChange={handleInputChange} required />
                  <Input label="Ciudad" name="ciudad" value={formulario.ciudad} onChange={handleInputChange} required />
                  <Input label="Estado" name="estado" value={formulario.estado} onChange={handleInputChange} required />
                  <Input label="Codigo Postal" name="codigoPostal" value={formulario.codigoPostal} onChange={handleInputChange} required />
                  <Input label="Referencias (opcional)" name="referencias" value={formulario.referencias} onChange={handleInputChange} />
                </div>
              </div>
            )}

            {/* ═══════ PASO 3: Metodo de pago ═══════ */}
            {paso === 3 && (
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#C85A00] text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Metodo de Pago
                </h2>

                {/* Selector de metodo */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      metodoPago === 'tarjeta'
                        ? 'border-[#C85A00] bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        metodoPago === 'tarjeta' ? 'bg-[#C85A00] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Tarjeta</p>
                        <p className="text-xs text-gray-500">Credito o debito</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      metodoPago === 'transferencia'
                        ? 'border-[#C85A00] bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        metodoPago === 'transferencia' ? 'bg-[#C85A00] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Transferencia</p>
                        <p className="text-xs text-gray-500">Deposito o SPEI</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* ═══════ FORMULARIO TARJETA ═══════ */}
                {metodoPago === 'tarjeta' && (
                  <div className="space-y-4">
                    <CardPreview datos={tarjeta} brand={cardBrand} />

                    <Input
                      label="Nombre en la tarjeta"
                      placeholder="Como aparece en la tarjeta"
                      value={tarjeta.titular}
                      onChange={(e) => handleTarjetaChange('titular', e.target.value)}
                      required
                    />

                    <Input
                      label="Numero de tarjeta"
                      placeholder="1234 5678 9012 3456"
                      value={tarjeta.numero}
                      onChange={(e) => handleTarjetaChange('numero', e.target.value)}
                      required
                      maxLength={19}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="Mes"
                        placeholder="MM"
                        value={tarjeta.expMes}
                        onChange={(e) => handleTarjetaChange('expMes', e.target.value)}
                        required
                        maxLength={2}
                      />
                      <Input
                        label="Ano"
                        placeholder="AA"
                        value={tarjeta.expAno}
                        onChange={(e) => handleTarjetaChange('expAno', e.target.value)}
                        required
                        maxLength={2}
                      />
                      <Input
                        label="CVV"
                        placeholder="123"
                        type="password"
                        value={tarjeta.cvv}
                        onChange={(e) => handleTarjetaChange('cvv', e.target.value)}
                        required
                        maxLength={4}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Lock className="w-3 h-3" />
                      <span>Pago seguro con encriptacion SSL. Tus datos estan protegidos.</span>
                    </div>
                  </div>
                )}

                {/* ═══════ FORMULARIO TRANSFERENCIA ═══════ */}
                {metodoPago === 'transferencia' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 font-medium mb-3">
                      <Landmark className="w-5 h-5" />
                      Transferencia Bancaria
                    </div>
                    <p className="text-sm text-blue-600 mb-4">
                      Realiza una transferencia con los datos que te proporcionaremos al confirmar el pedido.
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                      <p><span className="text-gray-600">Banco:</span> <span className="font-medium">{datosBancarios.banco}</span></p>
                      <p><span className="text-gray-600">Titular:</span> <span className="font-medium">{datosBancarios.titular}</span></p>
                      <p><span className="text-gray-600">Cuenta:</span> <span className="font-medium">{datosBancarios.cuenta}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              {paso > 1 && (
                <Button type="button" variant="outline" onClick={() => setPaso(paso - 1)}>
                  Anterior
                </Button>
              )}
              <Button type="submit" loading={enviando || procesandoPago} className="flex-1">
                {paso === 3
                  ? metodoPago === 'tarjeta'
                    ? `Pagar ${formatPrecio(total)}`
                    : 'Confirmar Pedido'
                  : 'Siguiente'}
              </Button>
            </div>
          </div>

          {/* ═══════ RESUMEN ═══════ */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-[#1A1A1A] mb-4">Resumen del Pedido</h3>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const precio = item.variante.precio ?? item.producto.precio_base;
                  return (
                    <div key={item.variante.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.producto.nombre}</p>
                        <p className="text-gray-500">{item.variante.nombre} x{item.cantidad}</p>
                      </div>
                      <span className="font-medium">{formatPrecio(precio * item.cantidad)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-4 space-y-2">
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
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Envio
                  </span>
                  <span>{envio === 0 ? 'Gratis' : formatPrecio(envio)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrecio(total)}</span>
                </div>
              </div>
              {envio === 0 && (
                <p className="text-sm text-green-600 text-center mt-4">Envio gratis!</p>
              )}
            </div>
          </div>
        </div>
      </form>

      <Link href="/carrito" className="inline-flex items-center text-[#C85A00] hover:text-[#A04800] mt-8">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al carrito
      </Link>
    </div>
  );
}
