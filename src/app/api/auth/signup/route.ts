import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password, nombre, apellido, telefono } = await request.json();

    if (!email || !password || !nombre || !apellido) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, apellido, email, contrasena)' },
        { status: 400 }
      );
    }

    // Cliente admin con service role para crear usuario auto-confirmado
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Crear usuario en auth.users con email confirmado
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, apellido },
    });

    if (userError) {
      // Si el usuario ya existe, devolver error claro
      if (userError.message?.includes('already exists') || userError.code === 'user_already_exists') {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este correo electronico' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: userError.message || 'Error al crear usuario' },
        { status: 500 }
      );
    }

    // 2. Crear registro en tabla clientes con todos los campos
    if (userData.user) {
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      const { error: clienteError } = await supabaseAdmin
        .from('clientes')
        .insert({
          id: userData.user.id,
          nombre: nombreCompleto,
          apellido,
          email,
          telefono: telefono || null,
          origen_registro: 'web',
        });

      if (clienteError) {
        console.error('Error creando cliente:', clienteError);
        // No retornamos error fatal - el usuario ya se creo en auth
      }
    }

    // 3. Enviar email de bienvenida
    try {
      const nombreCompleto = `${nombre} ${apellido}`.trim();
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/email/bienvenida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreCompleto,
          email,
        }),
      });
      console.log('Email de bienvenida enviado a:', email);
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
      // No fallar el registro si el email falla
    }

    // 4. Iniciar sesion con el cliente anon para obtener session
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: sessionData, error: sessionError } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (sessionError) {
      // Si no pudo iniciar sesion, igual devolvemos exito porque el usuario se creo
      return NextResponse.json({
        success: true,
        message: 'Cuenta creada. Ahora puedes iniciar sesion.',
      });
    }

    return NextResponse.json({
      success: true,
      session: sessionData.session,
      user: userData.user,
    });
  } catch (err) {
    console.error('Error en signup:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
