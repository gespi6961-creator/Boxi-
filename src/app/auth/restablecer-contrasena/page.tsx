'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function RestablecerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [estado, setEstado] = useState<'cargando' | 'token_valido' | 'token_invalido'>('cargando');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const procesarToken = async () => {
      const supabase = getSupabase();

      // Supabase procesa automaticamente el hash fragment (#access_token=...&type=recovery)
      // y establece la sesion. Solo necesitamos verificar si hay sesion activa.
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setEstado('token_valido');
      } else {
        // Esperar un momento porque Supabase puede estar procesando el hash
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data: { session: retrySession } } = await supabase.auth.getSession();

        if (retrySession) {
          setEstado('token_valido');
        } else {
          setEstado('token_invalido');
        }
      }
    };

    procesarToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabase();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || 'Error al actualizar la contrasena.');
      } else {
        setExito(true);
      }
    } catch {
      setError('Error de conexion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Estado: cargando
  if (estado === 'cargando') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  // Estado: token invalido
  if (estado === 'token_invalido') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            </Link>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Enlace No Valido</h1>
            <p className="text-gray-600 mb-6">
              Este enlace de recuperacion ya expiro o no es valido. Solicita uno nuevo.
            </p>
            <Link href="/auth/recuperar-contrasena">
              <Button className="w-full">Solicitar Nuevo Enlace</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Estado: exito
  if (exito) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            </Link>
          </div>
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Contrasena Actualizada</h1>
            <p className="text-gray-600 mb-6">
              Tu contrasena ha sido cambiada exitosamente. Ya puedes iniciar sesion.
            </p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Iniciar Sesion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Estado: formulario
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mt-4">Nueva Contrasena</h1>
          <p className="text-gray-600 mt-1">Ingresa tu nueva contrasena</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                label="Nueva contrasena"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                label="Confirmar contrasena"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu contrasena"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Cambiar Contrasena
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-[#FF6B00] hover:text-[#CC5500] font-medium inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Iniciar Sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full"></div>
      </div>
    }>
      <RestablecerForm />
    </Suspense>
  );
}
