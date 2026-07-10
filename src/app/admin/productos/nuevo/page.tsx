'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    slug: '',
    descripcion_corta: '',
    descripcion: '',
    precio_base: '',
    precio_oferta: '',
    categoria_id: '',
    imagen_url: '',
    destacado: false,
    activo: true,
  });

  useEffect(() => {
    async function cargarCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('orden');
      setCategorias(data || []);
    }
    cargarCategorias();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const generateSlug = (nombre: string) => {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const { error } = await supabase.from('productos').insert({
      nombre: formulario.nombre,
      slug: formulario.slug || generateSlug(formulario.nombre),
      descripcion_corta: formulario.descripcion_corta,
      descripcion: formulario.descripcion,
      precio_base: parseFloat(formulario.precio_base),
      precio_oferta: formulario.precio_oferta ? parseFloat(formulario.precio_oferta) : null,
      categoria_id: formulario.categoria_id || null,
      imagen_url: formulario.imagen_url || null,
      destacado: formulario.destacado,
      activo: formulario.activo,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      router.push('/admin/productos');
    }
    
    setGuardando(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/admin/productos" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-6">
        {/* Información básica */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Información Básica</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Nombre del producto"
                name="nombre"
                value={formulario.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <Input
              label="Slug (URL)"
              name="slug"
              value={formulario.slug}
              onChange={handleInputChange}
              helperText="Se genera automáticamente si lo dejas vacío"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
              <input
                type="text"
                name="descripcion_corta"
                value={formulario.descripcion_corta}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                placeholder="Aparecerá en la card del producto"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción completa</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                placeholder="Descripción detallada del producto"
              />
            </div>
          </div>
        </div>

        {/* Precios */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Precios</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Precio base ($)"
              name="precio_base"
              type="number"
              step="0.01"
              min="0"
              value={formulario.precio_base}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Precio de oferta ($)"
              name="precio_oferta"
              type="number"
              step="0.01"
              min="0"
              value={formulario.precio_oferta}
              onChange={handleInputChange}
              helperText="Dejar vacío si no hay oferta"
            />
          </div>
        </div>

        {/* Imagen */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Imagen</h2>
          <Input
            label="URL de la imagen"
            name="imagen_url"
            value={formulario.imagen_url}
            onChange={handleInputChange}
            helperText="URL de la imagen del producto"
          />
        </div>

        {/* Estado */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={formulario.activo}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
            />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="destacado"
              checked={formulario.destacado}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
            />
            <span className="text-sm font-medium text-gray-700">Destacado</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <Link href="/admin/productos" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" loading={guardando} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar Producto
          </Button>
        </div>
      </form>
    </div>
  );
}
