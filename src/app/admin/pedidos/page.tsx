'use client';

import { useState, useEffect } from 'react';
import { Eye, ChevronDown, Package, Truck, Phone, Mail, MapPin, CreditCard, Clock } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { formatPrecio, formatFecha } from '@/lib/utils';

const estados = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmado', label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
  { value: 'preparando', label: 'Preparando', color: 'bg-purple-100 text-purple-700' },
  { value: 'enviado', label: 'Enviado', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'entregado', label: 'Entregado', color: 'bg-green-100 text-green-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

interface PedidoCompleto {
  id: string;
  numero_pedido: string;
  estado: string;
  total: number;
  subtotal: number;
  descuento: number;
  envio: number;
  metodo_pago: string;
  datos_pago: any;
  direccion_envio: any;
  notas: string | null;
  created_at: string;
  cliente?: {
    nombre: string;
    email: string;
    telefono: string;
  } | null;
  detalles?: Array<{
    id: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: {
      nombre: string;
      imagen_url: string | null;
    } | null;
    variante: {
      nombre: string;
    } | null;
  }>;
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoCompleto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoCompleto | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(nombre, email, telefono),
        detalles:pedido_detalles(
          *,
          producto:productos(nombre, imagen_url),
          variante:producto_variantes(nombre)
        )
      `)
      .order('created_at', { ascending: false });
    
    setPedidos(data || []);
    setCargando(false);
  };

  const actualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    const supabase = getSupabase();
    await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq('id', pedidoId);
    
    cargarPedidos();
  };

  const getEstadoColor = (estado: string) => {
    return estados.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-700';
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  const totalVentas = pedidos
    .filter(p => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + p.total, 0);

  const pedidosHoy = pedidos.filter(p => {
    const fecha = new Date(p.created_at);
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Gestion de Pedidos</h1>
        <p className="text-gray-600">Administra todos los pedidos de tu tienda</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Pedidos</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{pedidos.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ventas Totales</p>
              <p className="text-2xl font-bold text-green-600">{formatPrecio(totalVentas)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pedidos Hoy</p>
              <p className="text-2xl font-bold text-orange-600">{pedidosHoy}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-purple-600">
                {pedidos.filter(p => p.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtroEstado === 'todos'
              ? 'bg-[#FF6B00] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({pedidos.length})
        </button>
        {estados.map((estado) => {
          const count = pedidos.filter(p => p.estado === estado.value).length;
          return (
            <button
              key={estado.value}
              onClick={() => setFiltroEstado(estado.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroEstado === estado.value
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {estado.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay pedidos en esta categoria</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Pedido</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cliente</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Fecha</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Pago</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">{pedido.numero_pedido}</p>
                      <p className="text-xs text-gray-500">{pedido.detalles?.length || 0} productos</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{pedido.cliente?.nombre || 'Sin registro'}</p>
                      <p className="text-xs text-gray-500">{pedido.cliente?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFecha(pedido.created_at)}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#FF6B00]">
                      {formatPrecio(pedido.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pedido.metodo_pago === 'tarjeta' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {pedido.metodo_pago === 'tarjeta' ? 'Tarjeta' : 'Transferencia'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={pedido.estado}
                          onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                          className={`appearance-none w-full px-3 py-1 pr-8 rounded-full text-xs font-medium cursor-pointer ${getEstadoColor(pedido.estado)}`}
                        >
                          {estados.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        aria-label="Ver detalles del pedido"
                        className="p-2 text-gray-400 hover:text-[#FF6B00] hover:bg-orange-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal detalle pedido COMPLETO */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">
                    Pedido {pedidoSeleccionado.numero_pedido}
                  </h2>
                  <p className="text-sm text-gray-500">{formatFecha(pedidoSeleccionado.created_at)}</p>
                </div>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  aria-label="Cerrar"
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Estado */}
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-2">Cambiar estado:</label>
                <div className="flex flex-wrap gap-2">
                  {estados.map((estado) => (
                    <button
                      key={estado.value}
                      onClick={() => {
                        actualizarEstado(pedidoSeleccionado.id, estado.value);
                        setPedidoSeleccionado({ ...pedidoSeleccionado, estado: estado.value });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        pedidoSeleccionado.estado === estado.value
                          ? 'ring-2 ring-offset-2 ring-[#FF6B00] ' + estado.color
                          : estado.color + ' opacity-60 hover:opacity-100'
                      }`}
                    >
                      {estado.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Info Cliente */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FF6B00]" />
                    Datos del Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre:</strong> {pedidoSeleccionado.cliente?.nombre || 'Sin registro'}</p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {pedidoSeleccionado.cliente?.email || 'Sin email'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {pedidoSeleccionado.cliente?.telefono || 'Sin telefono'}
                    </p>
                    {pedidoSeleccionado.notas && (
                      <p className="mt-3 p-2 bg-white rounded text-gray-600 text-xs">
                        📝 {pedidoSeleccionado.notas}
                      </p>
                    )}
                  </div>
                </div>

                {/* Direccion envio */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF6B00]" />
                    Direccion de Envio
                  </h3>
                  <div className="text-sm text-gray-700">
                    {pedidoSeleccionado.direccion_envio ? (
                      <>
                        <p>{pedidoSeleccionado.direccion_envio.calle} {pedidoSeleccionado.direccion_envio.numero}</p>
                        <p>Col. {pedidoSeleccionado.direccion_envio.colonia}</p>
                        <p>{pedidoSeleccionado.direccion_envio.ciudad}, {pedidoSeleccionado.direccion_envio.estado}</p>
                        <p>C.P. {pedidoSeleccionado.direccion_envio.codigo_postal}</p>
                        {pedidoSeleccionado.direccion_envio.referencias && (
                          <p className="mt-2 text-xs text-gray-500">Ref: {pedidoSeleccionado.direccion_envio.referencias}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">Sin direccion registrada</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="mt-6">
                <h3 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6B00]" />
                  Productos
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2">Producto</th>
                        <th className="text-center px-4 py-2">Cant.</th>
                        <th className="text-right px-4 py-2">Precio</th>
                        <th className="text-right px-4 py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pedidoSeleccionado.detalles?.map((detalle) => (
                        <tr key={detalle.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium">{detalle.producto?.nombre || 'Producto eliminado'}</p>
                            {detalle.variante?.nombre && (
                              <p className="text-xs text-gray-500">{detalle.variante.nombre}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">{detalle.cantidad}</td>
                          <td className="px-4 py-3 text-right">{formatPrecio(detalle.precio_unitario)}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatPrecio(detalle.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrecio(pedidoSeleccionado.subtotal)}</span>
                  </div>
                  {pedidoSeleccionado.descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatPrecio(pedidoSeleccionado.descuento)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Envio</span>
                    <span>{pedidoSeleccionado.envio === 0 ? 'Gratis' : formatPrecio(pedidoSeleccionado.envio)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-[#FF6B00]">{formatPrecio(pedidoSeleccionado.total)}</span>
                  </div>
                </div>
              </div>

              {/* Metodo de pago */}
              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Metodo de Pago
                </h3>
                {pedidoSeleccionado.metodo_pago === 'tarjeta' ? (
                  <div className="text-sm text-blue-700">
                    <p><strong>Tarjeta:</strong> {pedidoSeleccionado.datos_pago?.card_brand || 'N/A'}</p>
                    <p><strong>Estado:</strong> Pago confirmado ✓</p>
                  </div>
                ) : (
                  <div className="text-sm text-blue-700">
                    <p><strong>Banco:</strong> BBVA Mexico</p>
                    <p><strong>Titular:</strong> BOXI TECNOLOGIA SA DE CV</p>
                    <p><strong>CLABE:</strong> 012 345 678 901 234 567</p>
                    <p><strong>Referencia:</strong> {pedidoSeleccionado.numero_pedido}</p>
                    <p className="mt-2 text-xs">⚠️ Esperar comprobante de pago</p>
                  </div>
                )}
              </div>

              {/* Acciones rapidas */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`https://wa.me/526651423910?text=Hola, sobre tu pedido ${pedidoSeleccionado.numero_pedido}: `}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>
                <a
                  href={`tel:${pedidoSeleccionado.cliente?.telefono || ''}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${pedidoSeleccionado.cliente?.email || ''}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
