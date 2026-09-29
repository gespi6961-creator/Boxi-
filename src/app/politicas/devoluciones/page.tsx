import Link from 'next/link';

export const metadata = {
  title: 'Política de Devoluciones - BoxiTec',
  description:
    'Conoce la política de devoluciones y reembolsos de BOXI TECNOLOGÍA SA DE CV. Devoluciones dentro de los 30 días posteriores a la compra.',
};

export default function PoliticaDevoluciones() {
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
        <span className="text-gray-800 font-medium">
          Política de Devoluciones
        </span>
      </nav>

      <h1 className="text-3xl font-bold mb-2" style={{ color: '#FF6B00' }}>
        Política de Devoluciones
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Última actualización: 01 de septiembre de 2026
      </p>

      <div className="prose prose-orange max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            1. Compromiso con la Satisfacción del Cliente
          </h2>
          <p>
            En <strong>BOXI TECNOLOGÍA SA DE CV</strong>, nos comprometemos a
            ofrecer productos de calidad y un excelente servicio al cliente. Si
            por cualquier motivo no está completamente satisfecho con su compra,
            le ofrecemos la posibilidad de solicitar una devolución conforme a los
            términos establecidos en esta política.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            2. Plazo para Devoluciones
          </h2>
          <p>
            El cliente podrá solicitar la devolución de un producto dentro de los{' '}
            <strong>30 (treinta) días naturales</strong> contados a partir de la
            fecha de recepción del producto. Pasado este plazo, no se aceptarán
            devoluciones salvo en los casos previstos por la legislación vigente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            3. Condiciones para la Devolución
          </h2>
          <p>Para que una devolución sea aceptada, el producto deberá cumplir con las siguientes condiciones:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Estar en su estado original, sin uso, sin daños ni señales de desgaste.</li>
            <li>Incluir todos los accesorios, manuales y empaque original.</li>
            <li>Contener todas las etiquetas y sellos de seguridad intactos.</li>
            <li>No haber sido instalado, configurado o registrado por el usuario.</li>
            <li>Estar dentro del plazo de 30 días naturales desde la recepción.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            4. Productos No Retornables
          </h2>
          <p>
            No se aceptarán devoluciones en los siguientes casos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Productos con signos de uso, daño o manipulación por parte del cliente.</li>
            <li>Productos sin su empaque original o que no incluyan todos los accesorios.</li>
            <li>Software, códigos de descarga o tarjetas de regalo.</li>
            <li>Productos personalizados o fabricados bajo pedido especial.</li>
            <li>Accesorios de higiene personal (como auriculares in-ear) que hayan sido abiertos.</li>
            <li>Productos adquiridos en periodos de preventa o liquidación.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            5. Proceso de Devolución
          </h2>
          <p>Para solicitar una devolución, siga estos pasos:</p>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>
              <strong>Solicite la devolución:</strong> Contáctenos a través de
              nuestro correo electrónico{' '}
              <strong>boxitec.tech@gmail.com</strong> o al teléfono{' '}
              <strong>+52 665 142 3910</strong>, proporcionando su número de
              pedido y el motivo de la devolución.
            </li>
            <li>
              <strong>Reciba autorización:</strong> Nuestro equipo revisará su
              solicitud y le proporcionará un número de autorización de devolución
              y las instrucciones para el envío del producto.
            </li>
            <li>
              <strong>Empaque el producto:</strong> Coloque el producto en su
              empaque original con todos los accesorios y documentación.
            </li>
            <li>
              <strong>Envíe el producto:</strong> Enviaremos un mensajero a la
              dirección indicada para recoger el producto, o le proporcionaremos
              una etiqueta de envío prepagada.
            </li>
            <li>
              <strong>Recepción y revisión:</strong> Una vez recibido el producto,
              lo revisaremos en un plazo de 3 a 5 días hábiles para verificar que
              cumple con las condiciones de devolución.
            </li>
            <li>
              <strong>Reembolso:</strong> Si la devolución es aprobada, se
              procesará el reembolso según el método de pago utilizado en un plazo
              de 5 a 10 días hábiles.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            6. Costos de Envío para Devoluciones
          </h2>
          <p>
            El costo de envío para la devolución del producto será cubierto por{' '}
            <strong>BOXI TECNOLOGÍA SA DE CV</strong> cuando la devolución se
            deba a un defecto de fabricación, un error en el pedido o un producto
            dañado durante el envío.
          </p>
          <p className="mt-2">
            En caso de devolución por cambio de opinión o preferencia personal, el
            costo de envío correrá por cuenta del cliente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            7. Opciones de Reembolso
          </h2>
          <p>Una vez aprobada la devolución, el cliente podrá elegir entre las siguientes opciones:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>
              <strong>Reembolso al método de pago original:</strong> Se devolverá
              el monto total pagado, incluyendo el costo de envío original (cuando
              aplique), en un plazo de 5 a 10 días hábiles.
            </li>
            <li>
              <strong>Cambio por otro producto:</strong> Podrá solicitar el cambio
              por otro producto de igual o mayor valor (pagando la diferencia).
            </li>
            <li>
              <strong>Crédito en tienda:</strong> Recibirá un cupón de crédito
              con el valor de la compra para usar en futuras adquisiciones.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            8. Productos Defectuosos o Dañados
          </h2>
          <p>
            Si recibió un producto con defectos de fabricación o dañado durante el
            envío, contáctenos dentro de las primeras{' '}
            <strong>48 horas</strong> posteriores a la recepción. En estos casos:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>El envío de devolución será completamente gratuito.</li>
            <li>Se ofrecerá reemplazo inmediato (sujeto a disponibilidad) o reembolso total.</li>
            <li>No será necesario devolver el producto sin antes recibir autorización.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            9. Plazos de Procesamiento
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Autorización de devolución:</strong> 1-2 días hábiles.</li>
            <li><strong>Recepción y revisión del producto:</strong> 3-5 días hábiles.</li>
            <li><strong>Procesamiento del reembolso:</strong> 5-10 días hábiles después de la aprobación.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            10. Legislación Aplicable
          </h2>
          <p>
            Esta política de devoluciones se rige por la Ley Federal de
            Protección al Consumidor y demás legislación aplicable en los Estados
            Unidos Mexicanos. El cliente tiene derecho a la garantía legal conforme
            a los artículos 7, 11, 23 y 32 de dicha ley.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mt-8 mb-3" style={{ color: '#FF6B00' }}>
            11. Contacto
          </h2>
          <p>
            Si tiene preguntas sobre nuestra política de devoluciones o desea
            iniciar una devolución, puede contactarnos:
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
