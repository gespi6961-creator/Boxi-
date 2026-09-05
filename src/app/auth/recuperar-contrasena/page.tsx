'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = getSupabase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/restablecer-contrasena`,
      });

      if (resetError) {
        // Manejar rate limit de Supabase
        if (resetError.message?.includes('rate') || resetError.message?.includes('too many') || resetError.status === 429) {
          setError('Demasiadas solicitudes. Espera unos minutos antes de intentar de nuevo.');
        } else {
          setError(resetError.message || 'Error al enviar el correo. Intenta de nuevo.');
        }
      } else {
        setEnviado(true);
      }
    } catch {
      setError('Error de conexion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#C85A00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">B</span>
              </div>
            </Link>
          </div>

          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Correo Enviado</h1>
            <p className="text-gray-600 mb-6">
              Si existe una cuenta con <strong>{email}</strong>, recibiras un enlace para restablecer tu contrasena.
              Revisa tu bandeja de entrada y spam.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Iniciar Sesion
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#C85A00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mt-4">Recuperar Contrasena</h1>
          <p className="text-gray-600 mt-1">Ingresa tu email y te enviaremos un enlace para restablecerla</p>
        </div>

        {/* Formulario */}
        <div className="bg-white border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <Send className="w-5 h-5 mr-2" />
              Enviar Enlace
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-[#C85A00] hover:text-[#A04800] font-medium inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Iniciar Sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
