'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function PerfilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    numero: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    referencias: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function cargarPerfil() {
      if (!user) return;
      const supabase = getSupabase();

      const { data } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', user.email)
        .single();

      if (data) {
        const dir = data.direccion || {};
        setFormulario({
          nombre: data.nombre || '',
          telefono: data.telefono || '',
          direccion: dir.calle || '',
          numero: dir.numero || '',
          colonia: dir.colonia || '',
          ciudad: dir.ciudad || '',
          estado: dir.estado || '',
          codigoPostal: dir.codigo_postal || '',
          referencias: dir.referencias || '',
        });
      }
    }

    if (user) {
      cargarPerfil();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    const supabase = getSupabase();

    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          nombre: formulario.nombre,
          telefono: formulario.telefono,
          direccion: {
            calle: formulario.direccion,
            numero: formulario.numero,
            colonia: formulario.colonia,
            ciudad: formulario.ciudad,
            estado: formulario.estado,
            codigo_postal: formulario.codigoPostal,
            referencias: formulario.referencias,
          },
        })
        .eq('email', user?.email);

      if (error) throw error;
      setMensaje('Perfil actualizado correctamente');
      setTimeout(() => setMensaje(''), 3000);
    } catch (err: any) {
      setMensaje('Error: ' + (err.message || 'No se pudo guardar'));
    }

    setGuardando(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#C85A00] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/cuenta" className="inline-flex items-center text-[#C85A00] hover:text-[#A04800] mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a Mi Cuenta
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Editar Perfil</h1>

      {mensaje && (
        <div className={`px-4 py-3 rounded-lg mb-6 ${
          mensaje.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#C85A00] rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-[#1A1A1A]">{user.email}</p>
            <p className="text-sm text-gray-500">Miembro desde {new Date(user.created_at).toLocaleDateString('es-MX')}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Nombre completo" name="nombre" value={formulario.nombre} onChange={handleInputChange} required />
          <Input label="Teléfono" name="telefono" type="tel" value={formulario.telefono} onChange={handleInputChange} required />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-[#1A1A1A] mb-3">Dirección</h3>
        </div>

        <Input label="Calle" name="direccion" value={formulario.direccion} onChange={handleInputChange} required />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Número" name="numero" value={formulario.numero} onChange={handleInputChange} required />
          <Input label="Colonia" name="colonia" value={formulario.colonia} onChange={handleInputChange} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Ciudad" name="ciudad" value={formulario.ciudad} onChange={handleInputChange} required />
          <Input label="Estado" name="estado" value={formulario.estado} onChange={handleInputChange} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Código Postal" name="codigoPostal" value={formulario.codigoPostal} onChange={handleInputChange} required />
          <Input label="Referencias (opcional)" name="referencias" value={formulario.referencias} onChange={handleInputChange} />
        </div>

        <Button type="submit" loading={guardando} className="w-full mt-4">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </form>
    </div>
  );
}
