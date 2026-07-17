'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { subirImagenProducto, eliminarImagenProducto } from '@/lib/storage';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    if (!id) return;
    
    async function cargarDatos() {
      const [categoriasRes, productoRes] = await Promise.all([
        supabase.from('categorias').select('*').order('orden'),
        supabase.from('productos').select('*').eq('id', id).single(),
      ]);

      if (categoriasRes.data) setCategorias(categoriasRes.data);
      
      if (productoRes.data) {
        const prod = productoRes.data;
        setFormulario({
          nombre: prod.nombre || '',
          slug: prod.slug || '',
          descripcion_corta: prod.descripcion_corta || '',
          descripcion: prod.descripcion || '',
          precio_base: prod.precio_base?.toString() || '',
          precio_oferta: prod.precio_oferta?.toString() || '',
          categoria_id: prod.categoria_id || '',
          imagen_url: prod.imagen_url || '',
          destacado: prod.destacado || false,
          activo: prod.activo ?? true,
        });
        if (prod.imagen_url) {
          setPreviewUrl(prod.imagen_url);
        }
      } else {
        alert('Producto no encontrado');
        router.push('/admin/productos');
      }
      
      setCargando(false);
    }
    cargarDatos();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB');
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Solo se permiten imágenes JPG, PNG, WebP o GIF');
      return;
    }

    const urlLocal = URL.createObjectURL(archivo);
    setPreviewUrl(urlLocal);

    setSubiendoImagen(true);
    const urlPublica = await subirImagenProducto(archivo, id, 0);
    setSubiendoImagen(false);

    if (urlPublica) {
      setFormulario(prev => ({ ...prev, imagen_url: urlPublica }));
    } else {
      alert('Error al subir la imagen. Verifica que el bucket "productos" exista en Supabase Storage.');
      setPreviewUrl(formulario.imagen_url || null);
    }
  };

  const removeImage = async () => {
    if (formulario.imagen_url && formulario.imagen_url.includes('productos/')) {
      await eliminarImagenProducto(formulario.imagen_url);
    }
    setFormulario(prev => ({ ...prev, imagen_url: '' }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

    const { error } = await supabase
      .from('productos')
      .update({
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
      })
      .eq('id', id);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      router.push('/admin/productos');
    }
    
    setGuardando(false);
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    setGuardando(true);
    const { error } = await supabase.from('productos').delete().eq('id', id);
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      router.push('/admin/productos');
    }
    setGuardando(false);
  };

  if (cargando) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/admin/productos" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a productos
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Editar Producto</h1>
        <Button onClick={handleDelete} variant="danger" size="sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Eliminar
        </Button>
      </div>

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
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Imagen del Producto</h2>
          
          <div 
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              previewUrl 
                ? 'border-[#FF6B00] bg-orange-50' 
                : 'border-gray-300 hover:border-[#FF6B00] cursor-pointer'
            }`}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative inline-block">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-48 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                {subiendoImagen && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                <p className="text-sm text-gray-400">JPG, PNG, WebP o GIF (máx. 5MB)</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-4">
            <Input
              label="O ingresa URL de imagen"
              name="imagen_url"
              value={formulario.imagen_url}
              onChange={handleInputChange}
              helperText="URL directa de la imagen (opcional)"
            />
          </div>
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
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
