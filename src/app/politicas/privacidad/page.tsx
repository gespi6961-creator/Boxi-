'use client';

import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad - BoxiTec',
  description:
    'Conoce cómo BOXI TECNOLOGÍA SA DE CV recopila, usa y protege tu información personal en nuestra tienda en línea.',
};

export default function PoliticaPrivacidad() {
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
        <span className="text-gray-800 font-medium">Política de Privacidad</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#C85A00' }}>
        Política de Privacidad
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Última actualización: 01 de septiembre de 2026
      </p>

      <div className="prose prose-orange max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            1. Información del Responsable
          </h2>
          <p>
            <strong>BOXI TECNOLOGÍA SA DE CV</strong>, con domicilio en Swapmeet
            Encinos, Encinos No.800, Local 327, Tecate, Baja California, C.P.
            21480, es responsable del tratamiento de los datos personales que
            recopila a través del sitio web{' '}
            <strong>https://boxi-store.vercel.app</strong> (en adelante, &quot;el
            Sitio&quot;).
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Correo electrónico:</strong> boxitec.tech@gmail.com
            </li>
            <li>
              <strong>Teléfono:</strong> +52 665 142 3910
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            2. Datos Personales que Recopilamos
          </h2>
          <p>Para los fines establecidos en esta Política de Privacidad, recopilamos y tratamos los siguientes datos personales:</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            2.1 Datos de Identificación y Contacto
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número telefónico</li>
            <li>Dirección de envío (calle, número, colonia, ciudad, estado, código postal)</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            2.2 Datos de Pago
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Número de tarjeta de crédito/débito (procesada por pasarelas de pago seguras)</li>
            <li>Nombre del titular de la tarjeta</li>
            <li>Fecha de vencimiento</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            2.3 Datos de Navegación
          </h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dirección IP</li>
            <li>Tipo de navegador y dispositivo</li>
            <li>Páginas visitadas y tiempo de permanencia</li>
            <li>Cookies y tecnologías de rastreo similares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            3. Finalidad del Tratamiento
          </h2>
          <p>Los datos personales recopilados serán utilizados para las siguientes finalidades:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Procesar y gestionar pedidos de productos electrónicos y accesorios tecnológicos.</li>
            <li>Envío y entrega de productos adquiridos.</li>
            <li>Gestión de pagos y emisión de facturas.</li>
            <li>Comunicación relacionada con el estado de pedidos, entregas y atención al cliente.</li>
            <li>Envío de promociones, ofertas y novedades de productos (solo con consentimiento expreso).</li>
            <li>Mejora de la experiencia de navegación en el Sitio.</li>
            <li>Cumplimiento de obligaciones legales y fiscales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            4. Base Legal del Tratamiento
          </h2>
          <p>
            El tratamiento de sus datos personales se fundamenta en: (i) la
            ejecución de un contrato de compraventa; (ii) el consentimiento del
            titular; (iii) el cumplimiento de obligaciones legales; y (iv)
            nuestro legítimo interés en mejorar nuestros servicios, de conformidad
            con la Ley Federal de Protección de Datos Personales en Posesión de
            los Particulares (LFPDPPP).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            5. Consentimiento
          </h2>
          <p>
            Al proporcionar sus datos personales a través del Sitio, usted otorga
            su consentimiento para el tratamiento de los mismos conforme a los
            términos de esta Política de Privacidad. El consentimiento podrá ser
            revocado en cualquier momento a través de los medios establecidos en
            esta Política.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            6. Transferencias de Datos
          </h2>
          <p>
            Sus datos personales podrán ser compartidos con terceros únicamente en
            los siguientes casos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Empresas de paquetería y envío:</strong> Para la entrega de
              productos adquiridos.
            </li>
            <li>
              <strong>Pasarelas de pago:</strong> Para el procesamiento seguro de
              transacciones.
            </li>
            <li>
              <strong>Autoridades fiscales:</strong> Para el cumplimiento de
              obligaciones legales y tributarias.
            </li>
            <li>
              <strong>Proveedores de tecnología:</strong> Para el funcionamiento
              del Sitio y almacenamiento de datos.
            </li>
          </ul>
          <p className="mt-2">
            No realizamos transferencias internacionales de datos personales sin su
            consentimiento previo y expreso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            7. Cookies y Tecnologías de Rastreo
          </h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia
            de navegación, analizar el tráfico del Sitio y personalizar el
            contenido. Puede configurar su navegador para rechazar cookies, aunque
            esto podría afectar algunas funcionalidades del Sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            8. Derechos ARCO
          </h2>
          <p>
            Usted tiene derecho a <strong>Acceder</strong>,{' '}
            <strong>Rectificar</strong>, <strong>CANCELAR</strong> y{' '}
            <strong>Oponerse</strong> al tratamiento de sus datos personales
            (derechos ARCO), así como a revocar en cualquier momento el
            consentimiento que nos haya otorgado. Para ejercer estos derechos,
            puede enviarnos una solicitud a través de:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Correo electrónico:</strong> boxitec.tech@gmail.com
            </li>
            <li>
              <strong>Teléfono:</strong> +52 665 142 3910
            </li>
          </ul>
          <p className="mt-2">
            La solicitud deberá contener: nombre completo, domicilio o correo
            electrónico para recibir notificaciones, descripción clara de los
            datos personales sobre los que desea ejercer algún derecho, y cualquier
            documento que acredite su identidad.
          </p>
          <p className="mt-2">
            Responderemos a su solicitud en un plazo máximo de 20 días hábiles
            conforme a la legislación vigente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            9. Seguridad de los Datos
          </h2>
          <p>
            Implementamos medidas de seguridad administrativas, técnicas y
            físicas para proteger sus datos personales contra daño, pérdida,
            alteración, destrucción o uso no autorizado. Utilizamos conexiones
            cifradas (SSL/TLS) y seguimos las mejores prácticas de la industria
            para la protección de información sensible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            10. Retención de Datos
          </h2>
          <p>
            Sus datos personales serán conservados únicamente por el tiempo
            necesario para cumplir con las finalidades para las que fueron
            recopilados, o mientras exista una relación jurídica, o por el periodo
            que establezcan las disposiciones legales aplicables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            11. Cambios en la Política de Privacidad
          </h2>
          <p>
            Nos reservamos el derecho de modificar esta Política de Privacidad en
            cualquier momento. Los cambios serán publicados en el Sitio con la
            fecha de última actualización. Le recomendamos revisar periódicamente
            esta Política.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            12. Contacto
          </h2>
          <p>
            Si tiene preguntas o comentarios sobre esta Política de Privacidad,
            puede contactarnos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>BOXI TECNOLOGÍA SA DE CV</strong>
            </li>
            <li>Dirección: Swapmeet Encinos, Encinos No.800, Local 327, Tecate, Baja California, C.P. 21480</li>
            <li>Teléfono: +52 665 142 3910</li>
            <li>Correo electrónico: boxitec.tech@gmail.com</li>
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
