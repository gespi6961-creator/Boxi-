'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatFecha } from '@/lib/utils';

export default function AdminCuponesPage() {
  const [cupones, setCupones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [formulario, setFormulario] = useState({
    codigo: '',
    tipo: 'porcentaje',
    valor: '',
    minimo_compra: '',
    fecha_expiracion: '',
    uso_maximo: '',
  });

  useEffect(() => {
    cargarCupones();
  }, []);

  const cargarCupones = async () => {
    const supabase = getSupabase();
    const { data } = await supabase.from('cupones').select('*').order('created_at', { ascending: false });
    setCupones(data || []);
    setCargando(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    
    const datos = {
      codigo: formulario.codigo.toUpperCase(),
      tipo: formulario.tipo,
      valor: parseFloat(formulario.valor),
      minimo_compra: formulario.minimo_compra ? parseFloat(formulario.minimo_compra) : 0,
      fecha_expiracion: formulario.fecha_expiracion || null,
      uso_maximo: formulario.uso_maximo ? parseInt(formulario.uso_maximo) : null,
    };

    if (editando) {
      await supabase.from('cupones').update(datos).eq('id', editando.id);
    } else {
      await supabase.from('cupones').insert(datos);
    }

    setMostrarFormulario(false);
    setEditando(null);
    setFormulario({ codigo: '', tipo: 'porcentaje', valor: '', minimo_compra: '', fecha_expiracion: '', uso_maximo: '' });
    cargarCupones();
  };

  const editarCupon = (cupon: any) => {
    setEditando(cupon);
    setFormulario({
      codigo: cupon.codigo,
      tipo: cupon.tipo,
      valor: cupon.valor.toString(),
      minimo_compra: cupon.minimo_compra?.toString() || '',
      fecha_expiracion: cupon.fecha_expiracion?.split('T')[0] || '',
      uso_maximo: cupon.uso_maximo?.toString() || '',
    });
    setMostrarFormulario(true);
  };

  const eliminarCupon = async (id: string) => {
    if (!confirm('¿Eliminar este cupón?')) return;
    const supabase = getSupabase();
    await supabase.from('cupones').delete().eq('id', id);
    cargarCupones();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Cupones</h1>
          <p className="text-gray-600">{cupones.length} cupones creados</p>
        </div>
        <Button onClick={() => { setMostrarFormulario(true); setEditando(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cupón
        </Button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
            {editando ? 'Editar Cupón' : 'Nuevo Cupón'}
          </h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Código del cupón"
              name="codigo"
              value={formulario.codigo}
              onChange={handleInputChange}
              required
              placeholder="Ej: BOXI10"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de descuento</label>
              <select
                name="tipo"
                value={formulario.tipo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A00]"
              >
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="fijo">Monto fijo ($)</option>
              </select>
            </div>
            <Input
              label="Valor del descuento"
              name="valor"
              type="number"
              min="0"
              step="0.01"
              value={formulario.valor}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Compra mínima ($)"
              name="minimo_compra"
              type="number"
              min="0"
              value={formulario.minimo_compra}
              onChange={handleInputChange}
            />
            <Input
              label="Fecha de expiración"
              name="fecha_expiracion"
              type="date"
              value={formulario.fecha_expiracion}
              onChange={handleInputChange}
            />
            <Input
              label="Usos máximos"
              name="uso_maximo"
              type="number"
              min="0"
              value={formulario.uso_maximo}
              onChange={handleInputChange}
              helperText="Dejar vacío para uso ilimitado"
            />
            <div className="sm:col-span-2 flex gap-4">
              <Button type="button" variant="outline" onClick={() => { setMostrarFormulario(false); setEditando(null); }}>
                Cancelar
              </Button>
              <Button type="submit">
                {editando ? 'Guardar Cambios' : 'Crear Cupón'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de cupones */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : cupones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay cupones creados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Código</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tipo</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Valor</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Mínimo</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Usos</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Expira</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cupones.map((cupon) => (
                  <tr key={cupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#C85A00]">{cupon.codigo}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{cupon.tipo}</td>
                    <td className="px-6 py-4 font-medium">
                      {cupon.tipo === 'porcentaje' ? `${cupon.valor}%` : `$${cupon.valor}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {cupon.minimo_compra > 0 ? `$${cupon.minimo_compra}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {cupon.uso_actual}/{cupon.uso_maximo || '∞'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {cupon.fecha_expiracion ? formatFecha(cupon.fecha_expiracion) : 'Sin límite'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => editarCupon(cupon)}
                          className="p-2 text-gray-400 hover:text-[#C85A00] hover:bg-orange-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarCupon(cupon.id)}
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
