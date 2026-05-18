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
  return { title: t('privacy') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <>
        <h1>Política de privacidad</h1>
        <p>
          <em>
            Última actualización: {LEGAL_LAST_UPDATED.es}. Conforme a la CCPA / CPRA de California.
          </em>
        </p>
        <p>
          Esta Política de privacidad describe cómo {LEGAL_BRAND} («la Compañía», «nosotros» o
          «nuestro») recopila, usa y comparte tu información personal cuando usas nuestro sitio web,
          servicios o interactúas con nuestro contenido. Al usar este sitio, aceptas las prácticas
          descritas en esta Política.
        </p>

        <h2>1. Información que recopilamos</h2>
        <p>
          Recopilamos información personal que te identifica, se relaciona contigo, te describe o
          podría asociarse razonablemente contigo.
        </p>
        <h3>1.1 Información que proporcionas</h3>
        <p>
          Información que aportas voluntariamente, incluidos tu nombre, correo electrónico, datos de
          facturación (procesados de forma segura por proveedores externos) y cualquier información
          enviada mediante formularios, compras o comunicaciones.
        </p>
        <h3>1.2 Información recopilada automáticamente</h3>
        <p>
          Al usar el sitio podemos recopilar automáticamente datos como tu dirección IP,
          información del dispositivo y navegador, sistema operativo, páginas vistas, URL de
          referencia, datos de interacción y marcas de tiempo.
        </p>
        <h3>1.3 Cookies y tecnologías de seguimiento</h3>
        <p>
          Usamos cookies, píxeles y tecnologías similares para mejorar la funcionalidad del sitio,
          analizar el tráfico, rastrear conversiones de afiliados y apoyar iniciativas de marketing.
        </p>

        <h2>2. Cómo usamos tu información</h2>
        <p>
          Usamos tu información personal para prestar y entregar servicios y cursos, procesar pagos,
          comunicarnos contigo, mejorar el desempeño del sitio, enviar actualizaciones y
          comunicaciones de marketing (puedes darte de baja en cualquier momento), prevenir fraude o
          abuso, y rastrear el desempeño de afiliados.
        </p>

        <h2>3. Compartir información</h2>
        <p>
          No vendemos tu información personal. Podemos compartir tus datos con proveedores de
          servicios externos de confianza, incluidos procesadores de pago, plataformas de email
          marketing, proveedores de analítica, servicios de alojamiento y redes de seguimiento de
          afiliados. Estos terceros solo pueden usar tu información para prestar servicios en
          nuestro nombre.
        </p>

        <h2>4. Divulgación de afiliados</h2>
        <p>
          Este sitio contiene enlaces de afiliados, incluido Amazon. Podemos recibir comisiones por
          compras calificadas sin costo adicional para ti.
        </p>

        <h2>5. Derechos de privacidad de California (CCPA / CPRA)</h2>
        <p>
          Si eres residente de California, tienes derechos específicos respecto de tu información
          personal.
        </p>
        <ul>
          <li>
            <strong>Derecho a saber:</strong> solicitar información sobre las categorías de datos
            personales que recopilamos, sus fuentes, los fines de la recopilación y los terceros con
            quienes se comparten.
          </li>
          <li>
            <strong>Derecho a eliminar:</strong> solicitar la eliminación de tu información
            personal, sujeto a excepciones legales.
          </li>
          <li>
            <strong>Derecho a corregir:</strong> solicitar la corrección de información personal
            inexacta.
          </li>
          <li>
            <strong>Derecho a no vender ni compartir:</strong> no vendemos información personal; sin
            embargo, tienes derecho a indicarnos que no compartamos tu información personal para
            publicidad conductual entre contextos.
          </li>
          <li>
            <strong>Derecho a la no discriminación:</strong> no te discriminaremos por ejercer
            cualquiera de tus derechos de privacidad.
          </li>
        </ul>
        <p>
          Para ejercer estos derechos, escríbenos a{' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> con el asunto «No vender ni compartir
          mi información personal».
        </p>

        <h2>6. Retención de datos</h2>
        <p>
          Conservamos la información personal solo durante el tiempo necesario para prestar
          servicios, cumplir obligaciones legales, resolver disputas y hacer cumplir acuerdos.
        </p>

        <h2>7. Seguridad de los datos</h2>
        <p>
          Implementamos medidas de seguridad técnicas, administrativas y físicas razonables para
          proteger tu información personal. No obstante, ningún método de transmisión o
          almacenamiento es completamente seguro.
        </p>

        <h2>8. Servicios de terceros</h2>
        <p>
          Podemos usar servicios de terceros para operar el sitio y nuestras funciones de negocio.
          Estos servicios tienen sus propias políticas de privacidad y no somos responsables de sus
          prácticas.
        </p>

        <h2>9. Privacidad de menores</h2>
        <p>
          Este sitio no está dirigido a personas menores de 18 años. No recopilamos
          conscientemente información personal de menores.
        </p>

        <h2>10. Usuarios internacionales</h2>
        <p>
          Si accedes a este sitio desde fuera de los Estados Unidos, reconoces que tu información
          puede procesarse en los Estados Unidos u otras jurisdicciones.
        </p>

        <h2>11. Cambios a esta Política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta Política de privacidad en cualquier momento.
          Las actualizaciones se publicarán en esta página con una fecha de «Última actualización»
          revisada.
        </p>

        <h2>12. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta Política o tus derechos sobre datos personales, contáctanos
          en <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Privacy policy</h1>
      <p>
        <em>
          Last updated: {LEGAL_LAST_UPDATED.en}. California compliant (CCPA / CPRA).
        </em>
      </p>
      <p>
        This Privacy Policy describes how {LEGAL_BRAND} (“the Company,” “we,” “us,” or “our”)
        collects, uses, and shares your personal information when you use our website, services, or
        interact with our content. By using this website, you agree to the practices described in
        this Privacy Policy.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        We collect personal information that identifies, relates to, describes, or could reasonably
        be associated with you.
      </p>
      <h3>1.1 Information you provide</h3>
      <p>
        We may collect information you voluntarily provide, including your name, email address,
        billing details (processed securely by third-party providers), and any information submitted
        through forms, purchases, or communications.
      </p>
      <h3>1.2 Automatically collected information</h3>
      <p>
        When you use our website, we may automatically collect data such as your IP address, device
        and browser information, operating system, pages viewed, referring URLs, interaction data,
        and timestamps.
      </p>
      <h3>1.3 Cookies and tracking technologies</h3>
      <p>
        We use cookies, pixels, and similar technologies to improve website functionality, analyze
        traffic, track affiliate conversions, and support marketing efforts.
      </p>

      <h2>2. How we use your information</h2>
      <p>
        We use your personal information to provide and deliver services and courses, process
        payments, communicate with you, improve website performance, send updates and marketing
        communications (you may opt out at any time), prevent fraud or abuse, and track affiliate
        performance.
      </p>

      <h2>3. Sharing of information</h2>
      <p>
        We do not sell your personal information. We may share your data with trusted third-party
        service providers, including payment processors, email marketing platforms, analytics
        providers, hosting services, and affiliate tracking networks. These third parties are only
        permitted to use your information to perform services on our behalf.
      </p>

      <h2>4. Affiliate disclosure</h2>
      <p>
        This website contains affiliate links, including Amazon. We may earn commissions from
        qualifying purchases at no additional cost to you.
      </p>

      <h2>5. California privacy rights (CCPA / CPRA)</h2>
      <p>
        If you are a California resident, you have specific rights regarding your personal
        information.
      </p>
      <ul>
        <li>
          <strong>Right to know:</strong> request information about the categories of personal data
          we collect, their sources, the purposes for collection, and the third parties with whom it
          is shared.
        </li>
        <li>
          <strong>Right to delete:</strong> request the deletion of your personal information,
          subject to legal exceptions.
        </li>
        <li>
          <strong>Right to correct:</strong> request correction of inaccurate personal information.
        </li>
        <li>
          <strong>Right to opt out of sale or sharing:</strong> we do not sell personal information;
          however, you have the right to direct us not to share your personal information for
          cross-context behavioral advertising.
        </li>
        <li>
          <strong>Right to non-discrimination:</strong> we will not discriminate against you for
          exercising any of your privacy rights.
        </li>
      </ul>
      <p>
        To exercise these rights, contact us at{' '}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with the subject “Do not sell or share my
        personal information.”
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal information only for as long as necessary to provide services, comply
        with legal obligations, resolve disputes, and enforce agreements.
      </p>

      <h2>7. Data security</h2>
      <p>
        We implement reasonable technical, administrative, and physical security measures to protect
        your personal information. However, no method of transmission or storage is completely
        secure.
      </p>

      <h2>8. Third-party services</h2>
      <p>
        We may use third-party services to operate our website and business functions. These
        services have their own privacy policies, and we are not responsible for their practices.
      </p>

      <h2>9. Children’s privacy</h2>
      <p>
        This website is not intended for individuals under the age of 18. We do not knowingly
        collect personal information from minors.
      </p>

      <h2>10. International users</h2>
      <p>
        If you access this website from outside the United States, you acknowledge that your
        information may be processed in the United States or other jurisdictions.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We reserve the right to update this Privacy Policy at any time. Updates will be posted on
        this page with a revised “Last updated” date.
      </p>

      <h2>12. Contact information</h2>
      <p>
        If you have any questions about this Privacy Policy or your personal data rights, you may
        contact us at <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
      </p>
    </>
  );
}
