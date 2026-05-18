import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { LEGAL_BRAND, LEGAL_LAST_UPDATED } from '@/data/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('terms') };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <>
        <h1>Términos y condiciones</h1>
        <p>
          <em>Última actualización: {LEGAL_LAST_UPDATED.es}.</em>
        </p>
        <p>
          Estos Términos y condiciones («Términos») constituyen un acuerdo legalmente vinculante
          entre tú y {LEGAL_BRAND} («la Compañía», «nosotros» o «nuestro») que rige tu acceso y uso
          de este sitio web, incluido cualquier contenido, funcionalidad, productos y servicios
          ofrecidos. Al acceder o usar este sitio, reconoces que has leído, entendido y aceptado
          quedar obligado por estos Términos. Si no estás de acuerdo, no debes acceder ni usar el
          sitio.
        </p>

        <h2>1. Elegibilidad y uso del sitio</h2>
        <p>
          Este sitio está dirigido a personas de al menos 18 años. Aceptas usarlo solo con fines
          lícitos y conforme a estos Términos. Ofrecemos cursos en línea, materiales educativos y
          recomendaciones de productos estrictamente con fines informativos y educativos. No se
          brinda asesoría profesional (financiera, legal, médica ni de ningún otro tipo).
        </p>

        <h2>2. Licencia y acceso a los cursos</h2>
        <p>
          Tras la compra, se te concede una licencia limitada, no exclusiva, intransferible y
          revocable para acceder al contenido adquirido únicamente para uso personal. Aceptas no
          copiar, reproducir, distribuir, compartir, revender ni explotar ningún contenido de los
          cursos en ninguna forma sin nuestro consentimiento previo por escrito. Consulta también
          nuestra{' '}
          <Link href={`/${locale}/uso-de-contenido`}>Política de uso de contenido y antipiratería</Link>.
        </p>

        <h2>3. Derechos de propiedad intelectual</h2>
        <p>
          Todo el contenido, materiales, marca, diseño y propiedad intelectual de este sitio son
          propiedad de {LEGAL_BRAND} o están licenciados a su favor, y están protegidos por las
          leyes de derechos de autor, marcas y propiedad intelectual aplicables.
        </p>

        <h2>4. Sin garantía de resultados</h2>
        <p>
          No ofrecemos garantía alguna respecto de resultados, ganancias, ingresos o desenlaces
          específicos derivados del uso de nuestros productos, servicios o información. Cualquier
          ejemplo de resultados es meramente ilustrativo y no constituye una garantía.
        </p>

        <h2>5. Divulgación de afiliados</h2>
        <p>
          Este sitio puede contener enlaces de afiliados, incluido, entre otros, Amazon. Podemos
          recibir una comisión por compras calificadas sin costo adicional para ti.
        </p>

        <h2>6. Limitación de responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley, {LEGAL_BRAND} no será responsable de daños
          indirectos, incidentales, consecuentes, especiales o punitivos, incluidos, entre otros, la
          pérdida de ganancias, datos u oportunidades de negocio, que surjan de o se relacionen con
          tu uso del sitio o los servicios.
        </p>

        <h2>7. Servicios y enlaces de terceros</h2>
        <p>
          No somos responsables de sitios, servicios o contenidos de terceros enlazados o
          referenciados en este sitio. Acceder a recursos de terceros es bajo tu propio riesgo.
        </p>

        <h2>8. Pagos</h2>
        <p>
          Todos los pagos se procesan a través de procesadores de pago de terceros seguros. No
          almacenamos ni tenemos acceso a los datos completos de tu pago, incluida la información de
          tarjeta de crédito.
        </p>

        <h2>9. Modificaciones de los Términos</h2>
        <p>
          Nos reservamos el derecho de modificar, actualizar o reemplazar estos Términos en
          cualquier momento. El uso continuado del sitio tras los cambios constituye la aceptación
          de los Términos revisados.
        </p>

        <h2>10. Ley aplicable y jurisdicción</h2>
        <p>
          Estos Términos se rigen e interpretan conforme a las leyes del Estado de California,
          Estados Unidos, sin atender a los principios de conflicto de leyes. Cualquier disputa
          estará sujeta a la jurisdicción exclusiva de los tribunales ubicados en dicha
          jurisdicción.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Terms and conditions</h1>
      <p>
        <em>Last updated: {LEGAL_LAST_UPDATED.en}.</em>
      </p>
      <p>
        These Terms and Conditions (“Terms”) constitute a legally binding agreement between you and{' '}
        {LEGAL_BRAND} (“the Company,” “we,” “us,” or “our”) governing your access to and use of this
        website, including any content, functionality, products, and services offered. By accessing
        or using this website, you acknowledge that you have read, understood, and agree to be bound
        by these Terms. If you do not agree, you must not access or use the website.
      </p>

      <h2>1. Eligibility and website use</h2>
      <p>
        This website is intended for individuals who are at least 18 years old. You agree to use
        this website only for lawful purposes and in accordance with these Terms. We provide online
        courses, educational materials, and product recommendations strictly for informational and
        educational purposes. No professional advice (financial, legal, medical, or otherwise) is
        provided.
      </p>

      <h2>2. License and course access</h2>
      <p>
        Upon purchase, you are granted a limited, non-exclusive, non-transferable, revocable license
        to access the purchased content for personal use only. You agree not to copy, reproduce,
        distribute, share, resell, or exploit any course content in any form without our prior
        written consent. See also our{' '}
        <Link href={`/${locale}/uso-de-contenido`}>Content Use and Anti-Piracy Policy</Link>.
      </p>

      <h2>3. Intellectual property rights</h2>
      <p>
        All content, materials, branding, design, and intellectual property on this website are
        owned by or licensed to {LEGAL_BRAND} and are protected under applicable copyright,
        trademark, and intellectual property laws.
      </p>

      <h2>4. No guarantee of results</h2>
      <p>
        We make no guarantees regarding any specific results, earnings, income, or outcomes from the
        use of our products, services, or information. Any examples of results are illustrative only
        and not guarantees.
      </p>

      <h2>5. Affiliate disclosure</h2>
      <p>
        This website may contain affiliate links, including but not limited to Amazon. We may earn a
        commission from qualifying purchases at no additional cost to you.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {LEGAL_BRAND} shall not be liable for any indirect,
        incidental, consequential, special, or punitive damages, including but not limited to loss
        of profits, data, or business opportunities, arising out of or related to your use of the
        website or services.
      </p>

      <h2>7. Third-party services and links</h2>
      <p>
        We are not responsible for any third-party websites, services, or content linked or
        referenced on this website. Accessing third-party resources is at your own risk.
      </p>

      <h2>8. Payments</h2>
      <p>
        All payments are processed through secure third-party payment processors. We do not store or
        have access to your full payment details, including credit card information.
      </p>

      <h2>9. Modifications to Terms</h2>
      <p>
        We reserve the right to modify, update, or replace these Terms at any time. Continued use of
        the website after changes constitutes acceptance of the revised Terms.
      </p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the State of
        California, United States, without regard to conflict of law principles. Any disputes shall
        be subject to the exclusive jurisdiction of the courts located within that jurisdiction.
      </p>
    </>
  );
}
