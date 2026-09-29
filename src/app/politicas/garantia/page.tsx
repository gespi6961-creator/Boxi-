import Link from 'next/link';

export const metadata = {
  title: 'Política de Garantía - BoxiTec',
  description:
    'Conoce la política de garantía de BOXI TECNOLOGÍA SA DE CV. Garantía de 1 año del fabricante en todos nuestros productos.',
};

export default function PoliticaGarantia() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline" style={{ color: '#FF6B00' }}>
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/politicas"
          className="hover:underline"
          style={{ color: '#FF6B00' }}
        >
          Políticas
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Política de Garantía</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#FF6B00' }}>
        Política de Garantía
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Última actualización: 01 de septiembre de 2026
      </p>

      <div className="prose prose-orange max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            1. Compromiso de Garantía
          </h2>
          <p>
            En <strong>BOXI TECNOLOGÍA SA DE CV</strong>, todos los productos
            que comercializamos cuentan con la garantía del fabricante conforme a
            la Ley Federal de Protección al Consumidor y demás disposiciones
            legales aplicables en los Estados Unidos Mexicanos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            2. Duración de la Garantía
          </h2>
          <p>
            La garantía tiene una duración de <strong>1 (un) año</strong> a
            partir de la fecha de compra del producto, salvo que el fabricante
            ofrezca un plazo mayor. La fecha de compra se acreditará con la
            factura electrónica emitida por BOXI TECNOLOGÍA SA DE CV.
          </p>
          <div className="bg-orange-50 border-l-4 p-4 rounded-r-lg mt-4" style={{ borderColor: '#FF6B00' }}>
            <p className="font-semibold" style={{ color: '#FF6B00' }}>
              Importante: Conserve su factura electrónica como comprobante de
              compra. Es indispensable para hacer válida la garantía.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            3. Cobertura de Garantía
          </h2>
          <p>
            La garantía cubre defectos de fabricación y fallas que impidan el
            funcionamiento normal del producto, incluyendo:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Defectos en los materiales y/o mano de obra.</li>
            <li>Fallas en componentes electrónicos que impidan el uso normal del producto.</li>
            <li>Baterías que no carguen o no mantengan carga dentro de los primeros 6 meses.</li>
            <li>Pantallas con píxeles muertos o defectos de fábrica (según especificaciones del fabricante).</li>
            <li>Fallas en el software de fábrica que afecten el funcionamiento básico.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            4. Exclusiones de Garantía
          </h2>
          <p>La garantía NO cubre:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Daños causados por mal uso, negligencia, accidentes o caídas.</li>
            <li>Daños causados por líquidos, humedad o agentes externos.</li>
            <li>Desgaste normal por el uso cotidiano (pequeños rasguños, decoloración).</li>
            <li>Daños causados por sobrevoltaje, cortocircuitos o conexiones eléctricas inadecuadas.</li>
            <li>Productos modificados o reparados por personas no autorizadas.</li>
            <li>Daños causados por virus de software o malware.</li>
            <li>Accesorios de terceros no incluidos en la compra original.</li>
            <li>Daños estéticos que no afecten el funcionamiento del producto.</li>
            <li>Productos utilizados con fines comerciales o industriales.</li>
            <li>Daños por desastres naturales o fuerza mayor.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            5. Proceso para Reclamar la Garantía
          </h2>
          <p>Para hacer válida la garantía, siga estos pasos:</p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>
              <strong>Contacte a nuestro equipo:</strong> Envíe un correo a{' '}
              <strong>boxitec.tech@gmail.com</strong> o llame al{' '}
              <strong>+52 665 142 3910</strong> proporcionando: número de pedido,
              descripción del problema y una copia de su factura electrónica.
            </li>
            <li>
              <strong>Diagnóstico remoto:</strong> Nuestro equipo técnico
              realizará un diagnóstico preliminar del problema. En algunos casos,
              podremos resolver la falla de forma remota a través de
              instrucciones técnicas.
            </li>
            <li>
              <strong>Envío del producto:</strong> Si se requiere revisión
              presencial, le proporcionaremos las instrucciones para enviar el
              producto. El envío para garantías cubiertas será sin costo para el
              cliente.
            </li>
            <li>
              <strong>Revisión técnica:</strong> Nuestro equipo técnico revisará
              el producto en un plazo de 5 a 10 días hábiles para determinar si
              la falla está cubierta por la garantía.
            </li>
            <li>
              <strong>Resolución:</strong> Una vez determinado que la falla está
              cubierta por la garantía, procederemos con la reparación o
              reemplazo del producto, según corresponda.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            6. Opciones de Resolución
          </h2>
          <p>Cuando la garantía sea procedente, el cliente podrá elegir entre:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Reparación del producto:</strong> Se reparará el producto
              defectuoso sin costo para el cliente.
            </li>
            <li>
              <strong>Reemplazo del producto:</strong> Se entregará un producto
              nuevo de las mismas características (sujeto a disponibilidad).
            </li>
            <li>
              <strong>Reembolso:</strong> Si no es posible la reparación o
              reemplazo, se emitirá un reembolso del monto pagado.
            </li>
          </ul>
          <p className="mt-2">
            Conforme a los artículos 11 y 23 de la Ley Federal de Protección al
            Consumidor, el consumidor tendrá derecho a elegir la opción que más
            le convenga.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            7. Tiempos de Procesamiento
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Diagnóstico:</strong> 1-3 días hábiles después de recibir
              el producto.
            </li>
            <li>
              <strong>Reparación o reemplazo:</strong> 5-15 días hábiles después
              del diagnóstico (sujeto a disponibilidad de refacciones).
            </li>
            <li>
              <strong>Reembolso:</strong> 5-10 días hábiles después de la
              aprobación.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            8. Garantía Adicional
          </h2>
          <p>
            Para ciertos productos, el fabricante puede ofrecer una garantía
            extendida o adicional. Esta información se especificará en la página
            del producto. La garantía adicional es independiente de la garantía
            legal ofrecida por BOXI TECNOLOGÍA SA DE CV.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            9. Documentos Requeridos
          </h2>
          <p>Para hacer válida la garantía, es necesario presentar:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Factura electrónica o comprobante de compra original.</li>
            <li>Número de pedido.</li>
            <li>Descripción detallada del problema o defecto.</li>
            <li>Fotografías o videos del defecto (si aplica).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            10. Derechos del Consumidor
          </h2>
          <p>
            Esta política de garantía se rige por la Ley Federal de Protección al
            Consumidor. El consumidor tiene derecho a la garantía legal conforme a
            los artículos 7, 11, 23 y 32 de dicha ley. BOXI TECNOLOGÍA SA DE CV
            cumple con todas las disposiciones legales en materia de protección al
            consumidor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            11. Contacto
          </h2>
          <p>
            Para reclamar la garantía o si tiene preguntas sobre esta política,
            puede contactarnos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Correo electrónico:</strong> boxitec.tech@gmail.com
            </li>
            <li>
              <strong>Teléfono:</strong> +52 665 142 3910
            </li>
            <li>
              <strong>Dirección:</strong> Calle San Ignacio No. 105,
              Fraccionamiento Santa Anita, Tecate, Baja California, C.P. 21453
            </li>
          </ul>
        </section>
      </div>

      {/* Volver Button */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link
          href="/politicas"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors hover:opacity-90"
          style={{ backgroundColor: '#FF6B00' }}
        >
          ← Volver a Políticas
        </Link>
      </div>
    </div>
  );
}
