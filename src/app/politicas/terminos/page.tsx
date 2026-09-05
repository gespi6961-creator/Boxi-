'use client';

import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones - BoxiTec',
  description:
    'Lee los términos y condiciones de uso del sitio web de BOXI TECNOLOGÍA SA DE CV para la compra de productos electrónicos.',
};

export default function TerminosCondiciones() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline" style={{ color: '#C85A00' }}>
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/politicas"
          className="hover:underline"
          style={{ color: '#C85A00' }}
        >
          Políticas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">
          Términos y Condiciones
        </span>
      </nav>

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#C85A00' }}>
        Términos y Condiciones
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Última actualización: 01 de septiembre de 2026
      </p>

      <div className="prose prose-orange max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            1. Aceptación de los Términos
          </h2>
          <p>
            El acceso y uso del sitio web <strong>https://boxi-store.vercel.app</strong> (en
            adelante, &quot;el Sitio&quot;), propiedad de{' '}
            <strong>BOXI TECNOLOGÍA SA DE CV</strong>, implica la aceptación
            plena y sin reservas de los presentes Términos y Condiciones. Si no
            está de acuerdo con alguno de estos términos, le rogamos no utilice
            el Sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            2. Información del Titular
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Razón social:</strong> BOXI TECNOLOGÍA SA DE CV
            </li>
            <li>
              <strong>Domicilio:</strong> Swapmeet Encinos, Encinos No.800,
              Local 327, Tecate, Baja California, C.P. 21480
            </li>
            <li>
              <strong>Teléfono:</strong> +52 665 142 3910
            </li>
            <li>
              <strong>Correo electrónico:</strong> boxitec.tech@gmail.com
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            3. Objeto
          </h2>
          <p>
            El presente documento establece las condiciones generales de uso del
            Sitio y regula las relaciones comerciales entre BOXI TECNOLOGÍA SA DE
            CV y los usuarios que adquieran productos electrónicos y accesorios
            tecnológicos a través del mismo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            4. Registro de Usuario
          </h2>
          <p>
            Para realizar una compra en el Sitio, el usuario deberá proporcionar
            datos veraces y actualizados. El usuario es responsable de mantener la
            confidencialidad de su cuenta y contraseña, y de notificar
            inmediatamente cualquier uso no autorizado de su cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            5. Productos y Precios
          </h2>
          <p>
            Todos los precios mostrados en el Sitio incluyen el Impuesto al Valor
            Agregado (IVA) y se expresan en pesos mexicanos (MXN). BOXI
            TECNOLOGÍA SA DE CV se reserva el derecho de modificar los precios sin
            previo aviso, siempre que los cambios no afecten a pedidos ya
            confirmados.
          </p>
          <p className="mt-2">
            Las imágenes, descripciones y especificaciones de los productos son
            proporcionadas por los fabricantes y distribuidores. Aunque nos
            esforzamos por mantener la información actualizada, pueden existir
            variaciones menores.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            6. Proceso de Compra
          </h2>
          <p>
            Para realizar una compra, el usuario deberá:
          </p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Seleccionar los productos deseados y agregarlos al carrito de compras.</li>
            <li>Verificar el contenido del carrito y el monto total.</li>
            <li>Proporcionar los datos de envío y facturación.</li>
            <li>Seleccionar el método de pago.</li>
            <li>Confirmar el pedido.</li>
          </ol>
          <p className="mt-2">
            La confirmación del pedido implica la aceptación de estos Términos y
            Condiciones. Recibirá un correo electrónico de confirmación con los
            detalles de su compra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            7. Métodos de Pago
          </h2>
          <p>Aceptamos los siguientes métodos de pago:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Tarjetas de crédito y débito (Visa, Mastercard, American Express)</li>
            <li>Transferencia bancaria</li>
            <li>Otros métodos de pago electrónico disponibles en el proceso de checkout</li>
          </ul>
          <p className="mt-2">
            Todos los pagos se procesan de forma segura a través de pasarelas de
            pago certificadas. BOXI TECNOLOGÍA SA DE CV no almacena datos
            completos de tarjetas de crédito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            8. Envíos
          </h2>
          <p>
            Los envíos se realizan a todo el territorio nacional mexicano. Para
            información detallada sobre costos, tiempos de entrega y condiciones,
            consulte nuestra{' '}
            <Link
              href="/politicas/envio"
              className="font-semibold hover:underline"
              style={{ color: '#C85A00' }}
            >
              Política de Envío
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            9. Devoluciones y Reembolsos
          </h2>
          <p>
            Si no está satisfecho con su compra, puede solicitar la devolución
            dentro de los primeros 30 días naturales posteriores a la recepción del
            producto. Para más detalles, consulte nuestra{' '}
            <Link
              href="/politicas/devoluciones"
              className="font-semibold hover:underline"
              style={{ color: '#C85A00' }}
            >
              Política de Devoluciones
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            10. Garantía
          </h2>
          <p>
            Todos los productos cuentan con garantía del fabricante conforme a la
            legislación mexicana vigente. Consulte nuestra{' '}
            <Link
              href="/politicas/garantia"
              className="font-semibold hover:underline"
              style={{ color: '#C85A00' }}
            >
              Política de Garantía
            </Link>{' '}
            para más información.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            11. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido del Sitio, incluyendo但不限于 textos, imágenes,
            gráficos, logotipos, iconos, software y código fuente, es propiedad de
            BOXI TECNOLOGÍA SA DE CV o de sus proveedores y está protegido por
            las leyes de propiedad intelectual. Queda prohibida su reproducción,
            distribución o modificación sin autorización previa por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            12. Limitación de Responsabilidad
          </h2>
          <p>
            BOXI TECNOLOGÍA SA DE CV no será responsable por daños directos o
            indirectos derivados del uso del Sitio, incluyendo pero no limitado a,
            errores en las descripciones de productos, interrupciones del servicio,
            virus o contenido dañino.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            13. Legislación Aplicable y Jurisdicción
          </h2>
          <p>
            Los presentes Términos y Condiciones se rigen por las leyes de los
            Estados Unidos Mexicanos. Para la interpretación y cumplimiento de
            estos términos, las partes se someten a la jurisdicción de los
            tribunales competentes en Tecate, Baja California.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            14. Modificaciones
          </h2>
          <p>
            BOXI TECNOLOGÍA SA DE CV se reserva el derecho de modificar estos
            Términos y Condiciones en cualquier momento. Las modificaciones
            entrarán en vigor desde su publicación en el Sitio. El uso continuado
            del Sitio después de dichas modificaciones constituirá la aceptación
            de las mismas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            15. Contacto
          </h2>
          <p>
            Si tiene preguntas sobre estos Términos y Condiciones, puede
            contactarnos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Correo electrónico: boxitec.tech@gmail.com</li>
            <li>Teléfono: +52 665 142 3910</li>
            <li>Dirección: Swapmeet Encinos, Encinos No.800, Local 327, Tecate, Baja California, C.P. 21480</li>
          </ul>
        </section>
      </div>

      {/* Volver Button */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link
          href="/politicas"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90"
          style={{ backgroundColor: '#C85A00' }}
        >
          ← Volver a Políticas
        </Link>
      </div>
    </div>
  );
}
