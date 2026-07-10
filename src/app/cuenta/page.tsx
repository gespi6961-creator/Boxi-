'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, Settings, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import { formatFecha, formatPrecio } from '@/lib/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CuentaPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
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
      
      const { data } = await supabase
        .from('pedidos')
        .select('*')
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false });
      
      setPedidos(data || []);
      setCargando(false);
    }
    
    if (user) {
      cargarPedidos();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-6 sticky top-24">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-semibold text-[#1A1A1A]">{user.user_metadata?.nombre || 'Usuario'}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <Link href="/cuenta" className="flex items-center gap-3 px-4 py-2 bg-[#FF6B00] text-white rounded-lg">
                <User className="w-5 h-5" />
                Mi Cuenta
              </Link>
              <Link href="/cuenta/pedidos" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Package className="w-5 h-5" />
                Mis Pedidos
              </Link>
              <Link href="/cuenta/perfil" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
                Editar Perfil
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Bienvenido, {user.user_metadata?.nombre || 'Usuario'}</h1>

          {/* Estadísticas */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">{pedidos.length}</p>
                  <p className="text-sm text-gray-500">Pedidos</p>
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
                  <p className="text-sm text-gray-500">Favoritos</p>
                </div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">0</p>
                  <p className="text-sm text-gray-500">Direcciones</p>
                </div>
              </div>
            </div>
          </div>

          {/* Últimos pedidos */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Últimos Pedidos</h2>
              <Link href="/cuenta/pedidos" className="text-[#FF6B00] hover:text-[#CC5500] text-sm">
                Ver todos
              </Link>
            </div>

            {cargando ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes pedidos aún</p>
                <Link href="/catalogo">
                  <Button className="mt-4" size="sm">Ir al Catálogo</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.slice(0, 3).map((pedido) => (
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
        </main>
      </div>
    </div>
  );
}
