'use client';

import { useState, useEffect } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { formatPrecio, formatFecha } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const estados = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'confirmado', label: 'Confirmado', color: 'bg-blue-100 text-blue-700' },
  { value: 'preparando', label: 'Preparando', color: 'bg-purple-100 text-purple-700' },
  { value: 'enviado', label: 'Enviado', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'entregado', label: 'Entregado', color: 'bg-green-100 text-green-700' },
  { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    const { data } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });
    
    setPedidos(data || []);
    setCargando(false);
  };

  const actualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq('id', pedidoId);
    
    cargarPedidos();
  };

  const getEstadoColor = (estado: string) => {
    return estados.find(e => e.value === estado)?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Pedidos</h1>
        <p className="text-gray-600">{pedidos.length} pedidos en total</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {estados.slice(0, 4).map((estado) => {
          const count = pedidos.filter(p => p.estado === estado.value).length;
          return (
            <div key={estado.value} className="bg-white border rounded-xl p-4">
              <p className="text-sm text-gray-500">{estado.label}</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay pedidos aún</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Pedido</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Fecha</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Método Pago</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">{pedido.numero_pedido}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatFecha(pedido.created_at)}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#FF6B00]">
                      {formatPrecio(pedido.total)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {pedido.metodo_pago}
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
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

      {/* Modal detalle pedido */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1A1A1A]">
                  Pedido {pedidoSeleccionado.numero_pedido}
                </h2>
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{formatFecha(pedidoSeleccionado.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getEstadoColor(pedidoSeleccionado.estado)}`}>
                      {pedidoSeleccionado.estado}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Método de pago</p>
                  <p className="font-medium capitalize">{pedidoSeleccionado.metodo_pago}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Resumen</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrecio(pedidoSeleccionado.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{pedidoSeleccionado.envio === 0 ? 'Gratis' : formatPrecio(pedidoSeleccionado.envio)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-[#FF6B00]">{formatPrecio(pedidoSeleccionado.total)}</span>
                    </div>
                  </div>
                </div>

                {pedidoSeleccionado.notas && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-500 mb-1">Notas del cliente</p>
                    <p className="text-gray-700">{pedidoSeleccionado.notas}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
