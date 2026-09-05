import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY no esta configurada. Agrega la clave en las variables de entorno de Vercel.');
  }
  return new Stripe(key, {
    typescript: true,
  });
}

export async function POST(request: Request) {
  try {
    const { amount, currency, pedidoId, email, description } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Monto invalido' },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe maneja centavos
      currency: currency || 'mxn',
      receipt_email: email,
      metadata: {
        pedidoId: pedidoId || '',
        email: email || '',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err: unknown) {
    console.error('Error creating payment intent:', err);
    const msg = err instanceof Error ? err.message : 'Error al procesar el pago';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
