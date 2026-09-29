'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  imagen_url_2: string | null;
  imagen_url_3: string | null;
  activa: boolean;
  orden: number;
}

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState<number | null>(null);

  const [formulario, setFormulario] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    imagen_url: '',
    imagen_url_2: '',
    imagen_url_3: '',
    activa: true,
  });

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const fileRef3 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const supabase = getSupabase();
    const { data } = await supabase.from('categorias').select('*').order('orden');
    setCategorias(data || []);
    setCargando(false);
  };

  const handleEdit = (cat: Categoria) => {
    setEditando(cat.id);
    setFormulario({
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion || '',
      imagen_url: cat.imagen_url || '',
      imagen_url_2: cat.imagen_url_2 || '',
      imagen_url_3: cat.imagen_url_3 || '',
      activa: cat.activa,
    });
  };

  const handleSave = async () => {
    setGuardando(true);
    const supabase = getSupabase();
    const { error } = await supabase
      .from('categorias')
      .update({
        nombre: formulario.nombre,
        slug: formulario.slug,
        descripcion: formulario.descripcion || null,
        imagen_url: formulario.imagen_url || null,
        imagen_url_2: formulario.imagen_url_2 || null,
        imagen_url_3: formulario.imagen_url_3 || null,
        activa: formulario.activa,
      })
      .eq('id', editando!);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setEditando(null);
      cargarCategorias();
    }
    setGuardando(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const field = slot === 1 ? 'imagen_url' : slot === 2 ? 'imagen_url_2' : 'imagen_url_3';

    setSubiendo(slot);
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('productoId', 'cat-' + editando);
    formData.append('index', 'img' + slot);

    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();
    setSubiendo(null);

    if (response.ok) {
      setFormulario(prev => ({ ...prev, [field]: result.url }));
    } else {
      alert('Error al subir: ' + (result.error || 'Error'));
    }
  };

  const removeImage = (slot: number) => {
    const field = slot === 1 ? 'imagen_url' : slot === 2 ? 'imagen_url_2' : 'imagen_url_3';
    setFormulario(prev => ({ ...prev, [field]: '' }));
  };

  const ImageSlot = ({ slot, preview, label }: { slot: number; preview: string; label: string }) => {
    const fileRef = slot === 1 ? fileRef1 : slot === 2 ? fileRef2 : fileRef3;
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <div
          className={`border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
            preview ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-300 hover:border-[#FF6B00] cursor-pointer'
          }`}
          onClick={() => !preview && fileRef.current?.click()}
        >
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="" className="h-20 rounded object-contain" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
                className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              {subiendo === slot && (
                <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Upload className="w-6 h-6 mx-auto text-gray-400" />
              <p className="text-xs text-gray-400">Subir</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleImageUpload(e, slot)}
          className="hidden"
        />
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center text-[#FF6B00] hover:text-[#CC5500] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al admin
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">Gestionar Categorías</h1>

      <div className="space-y-4">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white border rounded-xl p-4">
            {editando === cat.id ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formulario.nombre}
                      onChange={(e) => setFormulario(prev => ({ ...prev, nombre: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={formulario.slug}
                      onChange={(e) => setFormulario(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={formulario.descripcion}
                      onChange={(e) => setFormulario(prev => ({ ...prev, descripcion: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (3 slots)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <ImageSlot slot={1} preview={formulario.imagen_url} label="Imagen 1" />
                    <ImageSlot slot={2} preview={formulario.imagen_url_2} label="Imagen 2" />
                    <ImageSlot slot={3} preview={formulario.imagen_url_3} label="Imagen 3" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formulario.activa}
                    onChange={(e) => setFormulario(prev => ({ ...prev, activa: e.target.checked }))}
                    className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className="text-sm text-gray-700">Activa</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditando(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={guardando}
                    className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg hover:bg-[#CC5500] disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[cat.imagen_url, cat.imagen_url_2, cat.imagen_url_3].map((img, i) => (
                      <div key={i} className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                        {img ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {i + 1}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{cat.nombre}</p>
                    <p className="text-sm text-gray-500">{cat.descripcion || 'Sin descripción'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${cat.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
