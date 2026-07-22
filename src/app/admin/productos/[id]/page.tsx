'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  if (!id) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600">ID de producto no válido</p>
        <Link href="/admin/productos" className="text-[#FF6B00] hover:underline mt-4 inline-block">
          Volver a productos
        </Link>
      </div>
    );
  }

  return <EditarForm id={id} router={router} />;
}

function EditarForm({ id, router }: { id: string; router: any }) {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Imágenes: 3 slots
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);
  const [subiendo1, setSubiendo1] = useState(false);
  const [subiendo2, setSubiendo2] = useState(false);
  const [subiendo3, setSubiendo3] = useState(false);

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);

  const [formulario, setFormulario] = useState({
    nombre: '',
    slug: '',
    descripcion_corta: '',
    descripcion: '',
    precio_base: '',
    precio_oferta: '',
    categoria_id: '',
    imagen_url: '',
    imagen_url_2: '',
    imagen_url_3: '',
    destacado: false,
    activo: true,
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [categoriasRes, productoRes] = await Promise.all([
          supabase.from('categorias').select('*').order('orden'),
          supabase.from('productos').select('*').eq('id', id).single(),
        ]);

        if (categoriasRes.data) setCategorias(categoriasRes.data);

        if (productoRes.error) {
          setError('Producto no encontrado: ' + productoRes.error.message);
          setCargando(false);
          return;
        }

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
            imagen_url_2: prod.imagen_url_2 || '',
            imagen_url_3: prod.imagen_url_3 || '',
            destacado: prod.destacado || false,
            activo: prod.activo ?? true,
          });
          if (prod.imagen_url) setPreview1(prod.imagen_url);
          if (prod.imagen_url_2) setPreview2(prod.imagen_url_2);
          if (prod.imagen_url_3) setPreview3(prod.imagen_url_3);
        }
      } catch (err: any) {
        setError('Error cargando datos: ' + err.message);
      }
      setCargando(false);
    }
    cargarDatos();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const uploadImage = async (archivo: File, index: number): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('productoId', id);
    formData.append('index', index.toString());

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();

    if (!response.ok) {
      alert('Error al subir: ' + (result.error || 'Error desconocido'));
      return null;
    }
    return result.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (archivo.size > 5 * 1024 * 1024) {
      alert('La imagen no puede superar 5MB');
      return;
    }

    const setPreview = slot === 1 ? setPreview1 : slot === 2 ? setPreview2 : setPreview3;
    const setSubiendo = slot === 1 ? setSubiendo1 : slot === 2 ? setSubiendo2 : setSubiendo3;
    const field = slot === 1 ? 'imagen_url' : slot === 2 ? 'imagen_url_2' : 'imagen_url_3';

    setPreview(URL.createObjectURL(archivo));
    setSubiendo(true);

    const url = await uploadImage(archivo, slot);
    if (url) {
      setFormulario(prev => ({ ...prev, [field]: url }));
    } else {
      setPreview(formulario.imagen_url || null);
    }
    setSubiendo(false);
  };

  const removeImage = (slot: number) => {
    const setPreview = slot === 1 ? setPreview1 : slot === 2 ? setPreview2 : setPreview3;
    const field = slot === 1 ? 'imagen_url' : slot === 2 ? 'imagen_url_2' : 'imagen_url_3';
    const fileRef = slot === 1 ? fileRef1 : slot === 2 ? fileRef2 : fileRef3;

    setPreview(null);
    setFormulario(prev => ({ ...prev, [field]: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const ImageSlot = ({
    slot, preview, subiendo, fileRef, label
  }: {
    slot: number; preview: string | null; subiendo: boolean;
    fileRef: React.RefObject<HTMLInputElement | null>; label: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
          preview ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-300 hover:border-[#FF6B00] cursor-pointer'
        }`}
        onClick={() => !preview && fileRef.current?.click()}
      >
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt={`Preview ${slot}`} className="max-h-40 rounded-lg object-contain" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            {subiendo && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-1" />
            <p className="text-sm text-gray-500">Seleccionar imagen</p>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFileChange(e, slot)}
        className="hidden"
      />
    </div>
  );

  if (cargando) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/productos" className="text-[#FF6B00] hover:underline">
          Volver a productos
        </Link>
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
        <button
          onClick={handleDelete}
          disabled={guardando}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Información Básica</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              >
                <option value="">Seleccionar</option>
                {categorias.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio base ($)</label>
              <input
                type="number"
                name="precio_base"
                step="0.01"
                min="0"
                value={formulario.precio_base}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio oferta ($)</label>
              <input
                type="number"
                name="precio_oferta"
                step="0.01"
                min="0"
                value={formulario.precio_oferta}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
              <input
                type="text"
                name="descripcion_corta"
                value={formulario.descripcion_corta}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción completa</label>
              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Imágenes del Producto (máx. 3)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ImageSlot slot={1} preview={preview1} subiendo={subiendo1} fileRef={fileRef1} label="Imagen principal" />
            <ImageSlot slot={2} preview={preview2} subiendo={subiendo2} fileRef={fileRef2} label="Imagen 2" />
            <ImageSlot slot={3} preview={preview3} subiendo={subiendo3} fileRef={fileRef3} label="Imagen 3" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="activo" checked={formulario.activo} onChange={handleInputChange} className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
            <span className="text-sm font-medium text-gray-700">Activo</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="destacado" checked={formulario.destacado} onChange={handleInputChange} className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
            <span className="text-sm font-medium text-gray-700">Destacado</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/admin/productos" className="flex-1">
            <button type="button" className="w-full px-4 py-2 border-2 border-[#FF6B00] text-[#FF6B00] rounded-lg hover:bg-[#FF6B00] hover:text-white transition-colors">
              Cancelar
            </button>
          </Link>
          <button
            type="submit"
            disabled={guardando}
            className="flex-1 px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#CC5500] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            {guardando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);

    const { error } = await supabase
      .from('productos')
      .update({
        nombre: formulario.nombre,
        slug: formulario.slug || formulario.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        descripcion_corta: formulario.descripcion_corta,
        descripcion: formulario.descripcion,
        precio_base: parseFloat(formulario.precio_base),
        precio_oferta: formulario.precio_oferta ? parseFloat(formulario.precio_oferta) : null,
        categoria_id: formulario.categoria_id || null,
        imagen_url: formulario.imagen_url || null,
        imagen_url_2: formulario.imagen_url_2 || null,
        imagen_url_3: formulario.imagen_url_3 || null,
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
  }

  async function handleDelete() {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    setGuardando(true);
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      router.push('/admin/productos');
    }
    setGuardando(false);
  }
}
