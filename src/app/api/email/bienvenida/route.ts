import { NextRequest, NextResponse } from 'next/server';

function getResend() {
  const { Resend } = require('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

interface WelcomeEmailData {
  nombre: string;
  email: string;
}

function generarHTMLBienvenida(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #C85A00, #A04800); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">BoxiTec</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Donde la tecnologia cobra vida</p>
                </td>
              </tr>

              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <h2 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 24px;">
                    ¡Bienvenido, ${data.nombre}! 🎉
                  </h2>
                  <p style="color: #666; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
                    Gracias por unirte a BoxiTec. Ahora tienes acceso a las mejores ofertas en tecnologia y gadgets innovadores.
                  </p>

                  <!-- Beneficios -->
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; text-align: left; margin-bottom: 30px;">
                    <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Tus beneficios:</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #666;">
                          ✅ <strong>Envio gratis</strong> en compras mayores a $1,000 MXN
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">
                          ✅ <strong>Garantia incluida</strong> en todos los productos
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">
                          ✅ <strong>Pago contra entrega</strong> disponible
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">
                          ✅ <strong>Ofertas exclusivas</strong> para miembros
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- CTA -->
                  <a href="https://boxi-store.vercel.app/catalogo" style="display: inline-block; background-color: #C85A00; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                    Ver Catalogo
                  </a>

                  <!-- Cupon -->
                  <div style="margin-top: 30px; padding: 20px; border: 2px dashed #C85A00; border-radius: 8px;">
                    <p style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 14px;">🎉 <strong>Descuento de bienvenida</strong></p>
                    <p style="color: #C85A00; margin: 0; font-size: 24px; font-weight: bold;">BOXI10</p>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 12px;">10% de descuento en tu primera compra</p>
                  </div>
                </td>
              </tr>

              <!-- Contacto -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">¿Tienes preguntas? Contactanos:</p>
                    <p style="margin: 0;">
                      <a href="https://wa.me/526651423910" style="color: #25D366; text-decoration: none; font-weight: bold;">
                        📱 WhatsApp: +52 665 142 3910
                      </a>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                  <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">© 2026 BoxiTec - Todos los derechos reservados</p>
                  <p style="color: #666; margin: 0; font-size: 12px;">Swapmeet Encinos, Encinos No.800, Local 327, Tecate, B.C.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const data: WelcomeEmailData = await request.json();

    // Validar datos
    if (!data.email || !data.nombre) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Verificar que Resend API key esta configurada
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no esta configurada');
      return NextResponse.json(
        { error: 'Servicio de email no configurado' },
        { status: 500 }
      );
    }

    // Enviar email
    const resend = getResend();
    const resultado = await resend.emails.send({
      from: 'BoxiTec <pedidos@boxi-store.vercel.app>',
      to: data.email,
      subject: '¡Bienvenido a BoxiTec! 🎉',
      html: generarHTMLBienvenida(data),
    });

    console.log('Email de bienvenida enviado:', resultado);

    return NextResponse.json({
      success: true,
      messageId: resultado.data?.id,
    });
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email' },
      { status: 500 }
    );
  }
}
