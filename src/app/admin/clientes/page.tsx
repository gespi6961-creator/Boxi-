'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Trash2, Edit, Save, X, Users } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  direccion: any;
  notas: string | null;
  activo: boolean;
  created_at: string;
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<Partial<Cliente>>({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  async function cargarClientes() {
    setCargando(true);
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
    } else {
      setClientes(data || []);
    }
    setCargando(false);
  }

  async function guardarCliente() {
    if (!formulario.nombre || !formulario.email) return;
    setGuardando(true);
    const supabase = getSupabase();

    if (editando) {
      const { error } = await supabase
        .from('clientes')
        .update({
          nombre: formulario.nombre,
          apellido: formulario.apellido,
          email: formulario.email,
          telefono: formulario.telefono,
          direccion: formulario.direccion,
          notas: formulario.notas,
          activo: formulario.activo,
        })
        .eq('id', editando);
      
      if (!error) {
        setEditando(null);
        setFormulario({});
        cargarClientes();
      }
    } else {
      const { error } = await supabase
        .from('clientes')
        .insert({
          nombre: formulario.nombre,
          apellido: formulario.apellido,
          email: formulario.email,
          telefono: formulario.telefono,
          direccion: formulario.direccion || {},
          notas: formulario.notas,
          activo: true,
        });
      
      if (!error) {
        setFormulario({});
        cargarClientes();
      }
    }
    setGuardando(false);
  }

  async function eliminarCliente(id: string) {
    if (!confirm('¿Eliminar este cliente?')) return;
    const supabase = getSupabase();
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (!error) cargarClientes();
  }

  function iniciarEdicion(cliente: Cliente) {
    setEditando(cliente.id);
    setFormulario(cliente);
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono?.includes(busqueda)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-[#C85A00]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Clientes</h1>
            <p className="text-gray-600 mt-1">{clientes.length} clientes registrados</p>
          </div>
        </div>
      </div>

      {/* Búsqueda y formulario */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Búsqueda */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-3">Buscar cliente</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre, email o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Formulario */}
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-3">
              {editando ? 'Editar cliente' : 'Nuevo cliente'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre *"
                value={formulario.nombre || ''}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <input
                type="text"
                placeholder="Apellido"
                value={formulario.apellido || ''}
                onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <input
                type="email"
                placeholder="Email *"
                value={formulario.email || ''}
                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={formulario.telefono || ''}
                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={formulario.direccion?.ciudad || ''}
                onChange={(e) => setFormulario({
                  ...formulario,
                  direccion: { ...formulario.direccion, ciudad: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
              <input
                type="text"
                placeholder="Estado"
                value={formulario.direccion?.estado || ''}
                onChange={(e) => setFormulario({
                  ...formulario,
                  direccion: { ...formulario.direccion, estado: e.target.value }
                })}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={guardarCliente}
                disabled={guardando || !formulario.nombre || !formulario.email}
                size="sm"
              >
                <Save className="w-4 h-4 mr-1" />
                {editando ? 'Actualizar' : 'Guardar'}
              </Button>
              {editando && (
                <Button
                  onClick={() => { setEditando(null); setFormulario({}); }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      {cargando ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                      <p className="text-sm text-gray-500">{cliente.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{cliente.telefono || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {cliente.direccion?.ciudad || '-'}{cliente.direccion?.estado ? `, ${cliente.direccion.estado}` : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">
                      {new Date(cliente.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => iniciarEdicion(cliente)}
                        className="text-gray-400 hover:text-[#C85A00] transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => eliminarCliente(cliente.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
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
  );
}
