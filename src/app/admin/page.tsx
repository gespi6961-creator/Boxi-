'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight, LayoutGrid, UserCheck, FileSpreadsheet } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { formatPrecio, formatFecha } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    ingresosTotales: 0,
    pedidosPendientes: 0,
  });
  const [pedidosRecientes, setPedidosRecientes] = useState<Array<{
    id: string;
    numero_pedido: string;
    total: number;
    estado: string;
    created_at: string;
  }>>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarStats() {
      const supabase = getSupabase();
      const [productos, pedidos, pedidosRecientes] = await Promise.all([
        supabase.from('productos').select('id', { count: 'exact', head: true }),
        supabase.from('pedidos').select('*'),
        supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      const totalIngresos = pedidos.data?.reduce((sum, p) => sum + (p.total || 0), 0) || 0;
      const pendientes = pedidos.data?.filter(p => p.estado === 'pendiente').length || 0;

      setStats({
        totalProductos: productos.count || 0,
        totalPedidos: pedidos.data?.length || 0,
        ingresosTotales: totalIngresos,
        pedidosPendientes: pendientes,
      });

      setPedidosRecientes(pedidosRecientes.data || []);
      setCargando(false);
    }

    cargarStats();
  }, []);

  const statCards = [
    { label: 'Productos', value: stats.totalProductos, icon: Package, color: 'bg-blue-500' },
    { label: 'Pedidos', value: stats.totalPedidos, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Ingresos', value: formatPrecio(stats.ingresosTotales), icon: DollarSign, color: 'bg-[#FF6B00]' },
    { label: 'Pendientes', value: stats.pedidosPendientes, icon: TrendingUp, color: 'bg-yellow-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
          <p className="text-gray-600">Panel de administración de BoxiTec</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#CC5500] transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pedidos recientes */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Pedidos Recientes</h2>
            <Link href="/admin/pedidos" className="text-[#FF6B00] hover:text-[#CC5500] text-sm">
              Ver todos
            </Link>
          </div>

          {cargando ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : pedidosRecientes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {pedidosRecientes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{pedido.numero_pedido}</p>
                    <p className="text-sm text-gray-500">{formatFecha(pedido.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FF6B00]">{formatPrecio(pedido.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pedido.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                      pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Accesos Rápidos</h2>
          <div className="space-y-3">
            <Link href="/admin/productos" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Gestionar Productos</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/categorias" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Gestionar Categorías</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/pedidos" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Gestionar Pedidos</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/cupones" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Gestionar Cupones</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/clientes" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Gestionar Clientes</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link href="/admin/inventario" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-[#FF6B00]" />
                <span className="font-medium">Inventario (Excel)</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
