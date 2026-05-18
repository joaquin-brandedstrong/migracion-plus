import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LEGAL_BRAND, LEGAL_EMAIL, LEGAL_LAST_UPDATED } from '@/data/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('refund') };
}

export default async function RefundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <>
        <h1>Política de reembolso</h1>
        <p>
          <em>
            Última actualización: {LEGAL_LAST_UPDATED.es}. Conforme a las leyes de California /
            EE.&nbsp;UU.
          </em>
        </p>
        <p>
          Esta Política de reembolso («Política») forma parte de los Términos y condiciones de{' '}
          {LEGAL_BRAND} («la Compañía», «nosotros» o «nuestro») y rige todas las compras realizadas
          a través de nuestro sitio web, productos y servicios. Al completar una compra, reconoces
          que has leído, entendido y aceptado esta Política.
        </p>

        <h2>1. Definiciones</h2>
        <ul>
          <li>
            <strong>«Productos digitales»</strong> son cursos en línea, membresías, materiales
            descargables o contenido digital.
          </li>
          <li>
            <strong>«Compra»</strong> es cualquier transacción completada para acceder a nuestros
            productos o servicios.
          </li>
          <li>
            <strong>«Acceso»</strong> es el otorgamiento de credenciales de inicio de sesión, acceso
            de streaming o disponibilidad del contenido.
          </li>
        </ul>

        <h2>2. Todas las ventas son finales</h2>
        <p>
          En la máxima medida permitida por la ley aplicable, todas las ventas son finales y no
          reembolsables. Una vez completada una compra y otorgado el acceso, reconoces y aceptas
          expresamente que:
        </p>
        <ul>
          <li>Renuncias a cualquier derecho de reembolso o cancelación.</li>
          <li>No se emitirán reembolsos por uso parcial, no uso o insatisfacción.</li>
          <li>
            No se emitirán reembolsos por la imposibilidad de alcanzar los resultados deseados.
          </li>
        </ul>

        <h2>3. Sin garantía de resultados</h2>
        <p>
          Reconoces que los resultados varían y dependen de factores individuales. No garantizamos
          ningún resultado específico, incluidos, entre otros, resultados financieros, desempeño de
          negocio o éxito personal.
        </p>

        <h2>4. Excepciones limitadas (solo discrecionales)</h2>
        <p>
          Podrán otorgarse reembolsos únicamente a discreción de la Compañía en circunstancias
          limitadas, incluidas:
        </p>
        <ul>
          <li>Transacciones duplicadas causadas por un error del sistema.</li>
          <li>
            Errores técnicos de facturación verificados atribuibles a nosotros o a nuestro
            procesador de pagos.
          </li>
          <li>Cargos fraudulentos o no autorizados confirmados mediante investigación.</li>
        </ul>
        <p>
          Todos los reembolsos discrecionales son no obligatorios, se evalúan caso por caso y se
          emiten únicamente al método de pago original.
        </p>

        <h2>5. Reconocimiento de entrega digital</h2>
        <p>
          Aceptas que el contenido digital se entrega de forma inmediata o poco después de la
          compra. Al completar el pago, consientes expresamente la ejecución y entrega inmediatas, y
          renuncias a cualquier derecho de desistimiento o periodo de reflexión aplicable en la
          medida permitida por la ley.
        </p>

        <h2>6. Contracargos y disputas de pago</h2>
        <p>
          Al realizar una compra, aceptas contactarnos primero directamente para resolver cualquier
          problema antes de iniciar un contracargo o disputa de pago. Si se inicia un contracargo:
        </p>
        <ul>
          <li>
            Nos reservamos el derecho de revocar el acceso a todos los productos y servicios.
          </li>
          <li>
            Podemos presentar al procesador de pagos evidencia de acceso, uso y aceptación de los
            términos.
          </li>
          <li>
            Podemos perseguir la recuperación de comisiones y costos asociados donde la ley lo
            permita.
          </li>
        </ul>

        <h2>7. Suscripciones (si aplica)</h2>
        <ul>
          <li>
            Las suscripciones se renuevan automáticamente salvo que se cancelen antes de la fecha de
            renovación.
          </li>
          <li>La cancelación detiene únicamente la facturación futura.</li>
          <li>No se proporcionan reembolsos parciales o prorrateados por periodos no usados.</li>
          <li>El acceso continúa hasta el final del ciclo de facturación.</li>
        </ul>

        <h2>8. Sin derechos implícitos</h2>
        <p>
          En la máxima medida permitida por la ley, no se implican reembolsos ni cancelaciones, y se
          renuncia expresamente a todas las garantías o condiciones implícitas (incluidas las de
          comerciabilidad o idoneidad para un propósito particular).
        </p>

        <h2>9. Ley aplicable y resolución de disputas</h2>
        <p>
          Esta Política se rige por las leyes del Estado de California, Estados Unidos, sin atender a
          los principios de conflicto de leyes. Cualquier disputa que surja de o se relacione con
          esta Política se resolverá mediante arbitraje vinculante, en lugar de los tribunales,
          salvo donde la ley lo prohíba. Aceptas renunciar a cualquier derecho de participar en una
          demanda colectiva o arbitraje colectivo.
        </p>

        <h2>10. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar o actualizar esta Política de reembolso en
          cualquier momento. El uso continuado de nuestros servicios tras los cambios constituye la
          aceptación de la Política actualizada.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta Política de reembolso, contáctanos en{' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Refund policy</h1>
      <p>
        <em>
          Last updated: {LEGAL_LAST_UPDATED.en}. California / U.S. compliant.
        </em>
      </p>
      <p>
        This Refund Policy (“Policy”) forms part of the Terms and Conditions of {LEGAL_BRAND} (“the
        Company,” “we,” “us,” or “our”) and governs all purchases made through our website,
        products, and services. By completing a purchase, you acknowledge that you have read,
        understood, and agreed to this Refund Policy.
      </p>

      <h2>1. Definitions</h2>
      <ul>
        <li>
          <strong>“Digital Products”</strong> means any online courses, memberships, downloadable
          materials, or digital content.
        </li>
        <li>
          <strong>“Purchase”</strong> means any completed transaction for access to our Products or
          Services.
        </li>
        <li>
          <strong>“Access”</strong> means the granting of login credentials, streaming access, or
          availability of content.
        </li>
      </ul>

      <h2>2. All sales are final</h2>
      <p>
        To the maximum extent permitted by applicable law, all sales are final and non-refundable.
        Once a purchase is completed and access is granted, you expressly acknowledge and agree
        that:
      </p>
      <ul>
        <li>You waive any right to a refund or cancellation.</li>
        <li>No refunds will be issued for partial use, non-use, or dissatisfaction.</li>
        <li>No refunds will be issued for inability to achieve desired results.</li>
      </ul>

      <h2>3. No warranty of outcome</h2>
      <p>
        You acknowledge that results vary and depend on individual factors. We do not guarantee any
        specific outcome, including but not limited to financial results, business performance, or
        personal success.
      </p>

      <h2>4. Limited exceptions (discretionary only)</h2>
      <p>
        Refunds may be granted solely at the Company’s discretion in limited circumstances,
        including:
      </p>
      <ul>
        <li>Duplicate transactions caused by system error.</li>
        <li>
          Verified technical billing errors attributable to us or our payment processor.
        </li>
        <li>Fraudulent or unauthorized charges confirmed through investigation.</li>
      </ul>
      <p>
        All discretionary refunds are non-obligatory, evaluated case-by-case, and issued only to the
        original payment method.
      </p>

      <h2>5. Digital delivery acknowledgment</h2>
      <p>
        You agree that digital content is delivered immediately or shortly after purchase. By
        completing payment, you expressly consent to immediate performance and delivery, and you
        waive any applicable cooling-off or withdrawal rights to the extent permitted by law.
      </p>

      <h2>6. Chargebacks and payment disputes</h2>
      <p>
        By making a purchase, you agree to first contact us directly to resolve any issue before
        initiating a chargeback or payment dispute. If a chargeback is initiated:
      </p>
      <ul>
        <li>We reserve the right to revoke access to all Products and Services.</li>
        <li>
          We may submit evidence of access, usage, and acceptance of terms to the payment
          processor.
        </li>
        <li>
          We may pursue recovery of fees and associated costs where legally permitted.
        </li>
      </ul>

      <h2>7. Subscriptions (if applicable)</h2>
      <ul>
        <li>Subscriptions renew automatically unless cancelled prior to the renewal date.</li>
        <li>Cancellation stops future billing only.</li>
        <li>No partial or prorated refunds are provided for unused periods.</li>
        <li>Access continues until the end of the billing cycle.</li>
      </ul>

      <h2>8. No implied rights</h2>
      <p>
        To the fullest extent permitted by law, no refunds or cancellations are implied, and all
        implied warranties or conditions (including merchantability or fitness for a particular
        purpose) are expressly disclaimed.
      </p>

      <h2>9. Governing law and dispute resolution</h2>
      <p>
        This Policy shall be governed by the laws of the State of California, United States, without
        regard to conflict of law principles. Any dispute arising out of or relating to this Policy
        shall be resolved through binding arbitration, rather than in court, except where prohibited
        by law. You agree to waive any right to participate in a class action lawsuit or class-wide
        arbitration.
      </p>

      <h2>10. Modifications</h2>
      <p>
        We reserve the right to modify or update this Refund Policy at any time. Continued use of
        our services after changes constitutes acceptance of the updated Policy.
      </p>

      <h2>11. Contact information</h2>
      <p>
        If you have any questions regarding this Refund Policy, please contact us at{' '}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
      </p>
    </>
  );
}
