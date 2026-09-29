import { NextRequest, NextResponse } from 'next/server';

function getResend() {
  const { Resend } = require('resend');
  return new Resend(process.env.RESEND_API_KEY);
}

interface PedidoEmailData {
  numeroPedido: string;
  nombre: string;
  email: string;
  telefono: string;
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
    variante: string;
  }>;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  metodoPago: 'tarjeta' | 'transferencia';
  direccionEnvio: {
    calle: string;
    numero: string;
    colonia: string;
    ciudad: string;
    estado: string;
    codigoPostal: string;
  };
  cardBrand?: string;
}

function formatPrecio(precio: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(precio);
}

function generarHTMLPedido(data: PedidoEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <strong>${item.nombre}</strong>
        <br>
        <span style="color: #666; font-size: 14px;">${item.variante} x${item.cantidad}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">
        ${formatPrecio(item.precio * item.cantidad)}
      </td>
    </tr>
  `
    )
    .join('');

  const esTransferencia = data.metodoPago === 'transferencia';

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
                <td style="background: linear-gradient(135deg, #FF6B00, #CC5500); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">BoxiTec</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Donde la tecnologia cobra vida</p>
                </td>
              </tr>

              <!-- Confirmacion -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <div style="width: 60px; height: 60px; background-color: #d4edda; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #28a745; font-size: 30px;">✓</span>
                  </div>
                  <h2 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 24px;">
                    ${esTransferencia ? 'Pedido Confirmado!' : 'Pago Recibido!'}
                  </h2>
                  <p style="color: #666; margin: 0; font-size: 16px;">Gracias por tu compra, <strong>${data.nombre}</strong></p>
                </td>
              </tr>

              <!-- Numero de pedido -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="color: #666; margin: 0 0 8px 0; font-size: 14px;">Tu numero de pedido es:</p>
                    <p style="color: #FF6B00; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 2px;">${data.numeroPedido}</p>
                  </div>
                </td>
              </tr>

              <!-- Detalles del pedido -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <h3 style="color: #1a1a1a; margin: 0 0 15px 0; font-size: 18px;">Detalles del Pedido</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 12px; font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase;">Producto</td>
                      <td style="padding: 12px; font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; text-align: right;">Total</td>
                    </tr>
                    ${itemsHTML}
                  </table>
                </td>
              </tr>

              <!-- Totales -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Subtotal</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${formatPrecio(data.subtotal)}</td>
                    </tr>
                    ${data.descuento > 0 ? `
                    <tr>
                      <td style="padding: 8px 0; color: #28a745;">Descuento</td>
                      <td style="padding: 8px 0; text-align: right; color: #28a745;">-${formatPrecio(data.descuento)}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; color: #666;">Envio</td>
                      <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${data.envio === 0 ? 'Gratis' : formatPrecio(data.envio)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-top: 2px solid #1a1a1a; font-weight: bold; font-size: 18px;">Total</td>
                      <td style="padding: 12px 0; border-top: 2px solid #1a1a1a; text-align: right; font-weight: bold; font-size: 18px; color: #FF6B00;">${formatPrecio(data.total)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Metodo de pago -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <div style="background-color: ${esTransferencia ? '#fff3cd' : '#d4edda'}; border-radius: 8px; padding: 20px;">
                    <h4 style="margin: 0 0 10px 0; color: ${esTransferencia ? '#856404' : '#155724'};">
                      ${esTransferencia ? '🏦 Datos para Transferencia' : '💳 Pago con Tarjeta'}
                    </h4>
                    ${esTransferencia ? `
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                      <strong>Banco:</strong> BBVA Mexico<br>
                      <strong>Titular:</strong> BOXI TECNOLOGIA SA DE CV<br>
                      <strong>CLABE:</strong> 012 345 678 901 234 567<br>
                      <strong>Referencia:</strong> ${data.numeroPedido}<br>
                      <strong>Total a pagar:</strong> ${formatPrecio(data.total)}
                    </p>
                    <p style="margin: 15px 0 0 0; color: #856404; font-size: 13px;">
                      * Envianos tu comprobante de pago por WhatsApp para confirmar tu pedido
                    </p>
                    ` : `
                    <p style="margin: 0; color: #155724; font-size: 14px;">
                      <strong>Tarjeta:</strong> ${data.cardBrand || 'N/A'}<br>
                      <strong>Monto:</strong> ${formatPrecio(data.total)}<br>
                      <strong>Estado:</strong> Pago confirmado ✓
                    </p>
                    `}
                  </div>
                </td>
              </tr>

              <!-- Direccion de envio -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <h4 style="color: #1a1a1a; margin: 0 0 10px 0;">📍 Direccion de Envio</h4>
                  <p style="color: #666; margin: 0; line-height: 1.6;">
                    ${data.direccionEnvio.calle} ${data.direccionEnvio.numero}<br>
                    Col. ${data.direccionEnvio.colonia}<br>
                    ${data.direccionEnvio.ciudad}, ${data.direccionEnvio.estado}<br>
                    C.P. ${data.direccionEnvio.codigoPostal}
                  </p>
                </td>
              </tr>

              <!-- Contacto -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; text-align: center;">
                    <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">¿Tienes preguntas? Contactanos:</p>
                    <p style="margin: 0;">
                      <a href="https://wa.me/526651423910?text=Hola, tengo una pregunta sobre el pedido ${data.numeroPedido}" style="color: #25D366; text-decoration: none; font-weight: bold;">
                        📱 WhatsApp: +52 665 142 3910
                      </a>
                    </p>
                    <p style="margin: 10px 0 0 0;">
                      <a href="mailto:boxitec.tech@gmail.com" style="color: #FF6B00; text-decoration: none;">
                        📧 boxitec.tech@gmail.com
                      </a>
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                  <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">© 2026 BoxiTec - Todos los derechos reservados</p>
                  <p style="color: #666; margin: 0; font-size: 12px;">Calle San Ignacio No. 105, Fraccionamiento Santa Anita, Tecate, B.C.</p>
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
    const data: PedidoEmailData = await request.json();

    // Validar datos
    if (!data.numeroPedido || !data.email || !data.nombre) {
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

    // Enviar email de notificacion al negocio
    const resend = getResend();
    const resultado = await resend.emails.send({
      from: 'BoxiTec <pedidos@boxi-store.vercel.app>',
      to: 'boxitec.tech@gmail.com',
      subject: `Nuevo Pedido ${data.numeroPedido} - ${data.metodoPago === 'tarjeta' ? 'Pago con Tarjeta' : 'Transferencia Pendiente'}`,
      html: generarHTMLPedido(data),
    });

    console.log('Email enviado:', resultado);

    return NextResponse.json({
      success: true,
      messageId: resultado.data?.id,
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email' },
      { status: 500 }
    );
  }
}
