'use client';

import Link from 'next/link';

export const metadata = {
  title: 'Política de Envío - BoxiTec',
  description:
    'Conoce la política de envío de BOXI TECNOLOGÍA SA DE CV. Envío gratis en compras mayores a $1,000 MXN, $99 MXN en pedidos menores.',
};

export default function PoliticaEnvio() {
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
        <span className="text-gray-800 font-medium">Política de Envío</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#C85A00' }}>
        Política de Envío
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Última actualización: 01 de septiembre de 2026
      </p>

      <div className="prose prose-orange max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            1. Cobertura de Envío
          </h2>
          <p>
            <strong>BOXI TECNOLOGÍA SA DE CV</strong> realiza envíos a todo el
            territorio nacional mexicano. Actualmente no realizamos envíos
            internacionales. La cobertura incluye las 32 entidades federativas
            del país.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            2. Costos de Envío
          </h2>

          <div className="bg-orange-50 border-l-4 p-4 rounded-r-lg my-4" style={{ borderColor: '#C85A00' }}>
            <p className="font-bold text-lg mb-1" style={{ color: '#C85A00' }}>
              Envío GRATIS en compras mayores a $1,000 MXN
            </p>
            <p className="text-sm text-gray-600">
              En pedidos menores a $1,000 MXN, el costo de envío es de{' '}
              <strong>$99 MXN</strong> para todo el país.
            </p>
          </div>

          <p className="mt-4">
            Los costos de envío se calculan automáticamente al momento del
            checkout, antes de confirmar su pedido. El costo final se basa en el
            peso, dimensiones y destino del paquete.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            3. Tiempos de Entrega
          </h2>
          <p>
            Los tiempos de entrega estimados son los siguientes (a partir de la
            confirmación del pedido y disponibilidad del producto):
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="text-white" style={{ backgroundColor: '#C85A00' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Zona
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Tiempo Estimado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-sm">
                    Zona Metropolitana (Tijuana, Tecate, Mexicali)
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    1 - 3 días hábiles
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    Baja California y Baja California Sur
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    2 - 4 días hábiles
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 text-sm">
                    Noroeste de México (Sonora, Sinaloa, Chihuahua, Durango)
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    3 - 5 días hábiles
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    Resto del país
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    4 - 7 días hábiles
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            * Los tiempos de entrega son estimados y pueden variar por causas
            ajenas como condiciones climáticas, festividades o direcciones en
            zonas rurales o de difícil acceso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            4. Seguimiento del Pedido
          </h2>
          <p>
            Una vez que su pedido haya sido enviado, recibirá un correo
            electrónico con el número de rastreo y las instrucciones para seguir
            el estado de su envío. También puede consultar el estado de su pedido
            desde su cuenta en nuestro sitio web.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            5. Empaque y Protección
          </h2>
          <p>
            Todos los productos se empaquetan cuidadosamente para garantizar que
            lleguen en perfectas condiciones. Utilizamos material de protección
            adecuado para cada tipo de producto, incluyendo cajas reforzadas,
            material amortiguador y sellos de seguridad.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            6. Dirección de Envío
          </h2>
          <p>
            Es responsabilidad del cliente proporcionar una dirección de envío
            completa y correcta. BOXI TECNOLOGÍA SA DE CV no se hace responsable
            por envíos no entregados debido a información incompleta o incorrecta
            en la dirección proporcionada.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Incluir número exterior e interior (si aplica).</li>
            <li>Especificar referencias del lugar de entrega.</li>
            <li>Asegurar que haya una persona disponible para recibir el paquete.</li>
            <li>Proporcionar un número telefónico de contacto.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            7. Paquetes No Entregados
          </h2>
          <p>
            Si el paquete no puede ser entregado por ausencia del destinatario o
            por una dirección incorrecta, el servicio de paquetería intentará la
            entrega en un máximo de 3 ocasiones. Si no es posible entregar el
            paquete, este será devuelto a nuestras instalaciones y nos
            pondremos en contacto con usted para coordinar una nueva entrega,
            la cual podrá tener un costo adicional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            8. Envíos a Zonas Rurales
          </h2>
          <p>
            Para direcciones en zonas rurales o de difícil acceso, los tiempos
            de entrega pueden extenderse de 2 a 5 días hábiles adicionales a los
            tiempos estimados. En algunos casos, puede ser necesario recoger el
            paquete en la oficina de paquetería más cercana.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            9. Pedidos de Preventa o Productos sin Stock
          </h2>
          <p>
            Si un producto se encuentra en preventa o sin disponibilidad
            inmediata, el tiempo de envío se especificará en la página del
            producto. El tiempo de entrega comenzará a contarse a partir de la
            fecha de llegada del producto a nuestro almacén.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#C85A00' }}>
            10. Contacto
          </h2>
          <p>
            Si tiene preguntas sobre el envío de su pedido, puede contactarnos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Correo electrónico:</strong> boxitec.tech@gmail.com
            </li>
            <li>
              <strong>Teléfono:</strong> +52 665 142 3910
            </li>
            <li>
              <strong>Dirección:</strong> Swapmeet Encinos, Encinos No.800, Local
              327, Tecate, Baja California, C.P. 21480
            </li>
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
