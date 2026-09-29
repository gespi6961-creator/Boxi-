'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { formatPrecio } from '@/lib/utils';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('productos')
      .select('*, categoria:categorias(nombre)')
      .order('created_at', { ascending: false });
    
    setProductos(data || []);
    setCargando(false);
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    const supabase = getSupabase();
    await supabase.from('productos').delete().eq('id', id);
    cargarProductos();
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Productos</h1>
          <p className="text-gray-600">{productos.length} productos en total</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron productos
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Producto</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Categoría</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Precio</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Oferta</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {producto.imagen_url ? (
                            <img src={producto.imagen_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{producto.nombre}</p>
                          <p className="text-sm text-gray-500">{producto.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {producto.categoria?.nombre || '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                      {formatPrecio(producto.precio_base)}
                    </td>
                    <td className="px-6 py-4 text-[#FF6B00] font-medium">
                      {producto.precio_oferta ? formatPrecio(producto.precio_oferta) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        producto.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/producto/${producto.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/productos/${producto.id}`}
                          className="p-2 text-gray-400 hover:text-[#FF6B00] hover:bg-orange-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => eliminarProducto(producto.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
