import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Emails de administradores - agregar aqui los emails que tengan acceso al admin
const ADMIN_EMAILS = ['gespi6961@gmail.com', 'boxitec.tech@gmail.com'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Manejar callback de recuperacion de contrasena (PKCE flow)
  // Supabase envia un "code" como query param que debemos intercambiar por una session
  if (request.nextUrl.pathname === '/auth/restablecer-contrasena') {
    const code = request.nextUrl.searchParams.get('code');
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Redirigir sin el param "code" para limpiar la URL
        const url = request.nextUrl.clone();
        url.searchParams.delete('code');
        return NextResponse.redirect(url);
      }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario ya está autenticado y está en login/registro, redirigir a cuenta
  if (user && (
    request.nextUrl.pathname.startsWith('/auth/login') ||
    request.nextUrl.pathname.startsWith('/auth/registro')
  )) {
    const url = request.nextUrl.clone();
    url.pathname = '/cuenta';
    return NextResponse.redirect(url);
  }

  // Proteger rutas admin - solo admins
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    // Verificar si es admin
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      const url = request.nextUrl.clone();
      url.pathname = '/cuenta';
      url.searchParams.set('error', 'no_admin');
      return NextResponse.redirect(url);
    }
  }

  // Proteger rutas de cuenta (requiere auth)
  if (request.nextUrl.pathname.startsWith('/cuenta')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Proteger checkout (requiere auth)
  if (request.nextUrl.pathname.startsWith('/checkout')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirect', '/checkout');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/cuenta/:path*', '/checkout', '/auth/login', '/auth/registro', '/auth/restablecer-contrasena'],
};
