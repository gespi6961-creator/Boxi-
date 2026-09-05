import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY no esta configurada.');
  }
  return new Stripe(key, {
    typescript: true,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'payment_intent ID requerido' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      receipt_email: paymentIntent.receipt_email,
      metadata: paymentIntent.metadata,
    });
  } catch (err: unknown) {
    console.error('Error verifying payment:', err);
    const msg = err instanceof Error ? err.message : 'Error al verificar el pago';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
