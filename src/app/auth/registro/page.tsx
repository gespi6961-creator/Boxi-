'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegistroPage() {
  const { signUp } = useAuth();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    const { error: signUpError } = await signUp(email, password, nombre, apellido, telefono);

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
    } else {
      setExito(true);
    }
  };

  if (exito) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Cuenta Creada!</h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada exitosamente. Ya puedes acceder a tu tienda BoxiTec.
          </p>
          <Link href="/cuenta">
            <Button className="w-full">Ir a Mi Cuenta</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mt-4">Crear Cuenta</h1>
          <p className="text-gray-600 mt-1">Unete a BoxiTec y accede a ofertas exclusivas</p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  label="Apellido"
                  placeholder="Tu apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                label="Telefono"
                type="tel"
                placeholder="Tu telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="pl-10"
              />
            </div>

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
                label="Contrasena"
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

            <label className="flex items-start">
              <input type="checkbox" required className="rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00] mt-1" />
              <span className="ml-2 text-sm text-gray-600">
                Acepto los{' '}
                <Link href="#" className="text-[#FF6B00] hover:underline">Terminos y Condiciones</Link>
                {' '}y la{' '}
                <Link href="#" className="text-[#FF6B00] hover:underline">Politica de Privacidad</Link>
              </span>
            </label>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-[#FF6B00] hover:text-[#CC5500] font-medium">
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
