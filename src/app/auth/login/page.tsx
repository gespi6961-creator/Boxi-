'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/cuenta';
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Email o contraseña incorrectos');
      setLoading(false);
    } else {
      router.push(redirectTo);
    }
  };

  return (
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

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]" />
            <span className="ml-2 text-gray-600">Recordarme</span>
          </label>
          <Link href="#" className="text-[#FF6B00] hover:text-[#CC5500]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          <LogIn className="w-5 h-5 mr-2" />
          Iniciar Sesión
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/auth/registro" className="text-[#FF6B00] hover:text-[#CC5500] font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mt-4">Iniciar Sesión</h1>
          <p className="text-gray-600 mt-1">Accede a tu cuenta de BOXI</p>
        </div>

        {/* Formulario */}
        <Suspense fallback={
          <div className="bg-white border rounded-xl p-6 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full mx-auto"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
