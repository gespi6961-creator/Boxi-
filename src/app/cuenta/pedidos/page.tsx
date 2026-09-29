'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { formatFecha, formatPrecio } from '@/lib/utils';

export default function PedidosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function cargarPedidos() {
      if (!user) return;
      const supabase = getSupabase();

      const { data: cliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', user.email)
        .single();

      if (cliente) {
        const { data } = await supabase
          .from('pedidos')
          .select('*')
          .eq('cliente_id', cliente.id)
          .order('created_at', { ascending: false });

        setPedidos(data || []);
      }
      setCargando(false);
    }

    if (user) {
      cargarPedidos();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      preparando: 'bg-purple-100 text-purple-800',
      enviado: 'bg-indigo-100 text-indigo-800',
      entregado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/cuenta" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a Mi Cuenta
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Mis Pedidos</h1>

      {cargando ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-500 mb-6">Explora nuestro catálogo y haz tu primer pedido</p>
          <Link href="/catalogo" className="inline-block bg-[#FF6B00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#CC5500] transition-colors">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="bg-white border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-lg text-[#1A1A1A]">{pedido.numero_pedido}</p>
                  <p className="text-sm text-gray-500">{formatFecha(pedido.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getEstadoColor(pedido.estado)}`}>
                    {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                  </span>
                  <p className="font-bold text-[#FF6B00] text-lg">{formatPrecio(pedido.total)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
