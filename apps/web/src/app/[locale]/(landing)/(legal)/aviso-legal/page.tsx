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
  return { title: t('notice') };
}

export default async function NoticePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <>
        <h1>Aviso legal y descargo de responsabilidad</h1>
        <p>
          <em>Última actualización: {LEGAL_LAST_UPDATED.es}.</em>
        </p>
        <p>
          <strong>
            {LEGAL_BRAND} brinda servicios de consultoría y educación en el llenado de formularios
            migratorios. No brindamos asesoría legal ni representación en la corte de inmigración.{' '}
            {LEGAL_BRAND} is not a law firm and does not provide legal advice.
          </strong>
        </p>
        <p>
          La información proporcionada por {LEGAL_BRAND} («la Compañía», «nosotros» o «nuestro») en
          este sitio web tiene únicamente fines informativos y educativos generales. Al usar este
          sitio, reconoces y aceptas este Aviso legal.
        </p>

        <h2>1. Sin asesoría profesional</h2>
        <p>
          Todo el contenido —incluidos cursos, materiales, publicaciones del blog, recomendaciones y
          demás información— se proporciona con fines informativos y educativos, y no constituye
          asesoría financiera, legal, fiscal, médica ni de ningún otro tipo profesional. Debes
          consultar a un profesional calificado antes de tomar cualquier decisión basada en la
          información de este sitio.
        </p>

        <h2>2. Sin garantía de resultados</h2>
        <p>
          No ofrecemos garantía alguna respecto de resultados, desenlaces o beneficios específicos
          derivados del uso de nuestro contenido, productos o servicios. Cualquier ejemplo de
          resultados es meramente ilustrativo y no constituye una garantía de desempeño futuro. Tus
          resultados pueden variar según factores individuales como el esfuerzo, la experiencia y
          las condiciones externas.
        </p>

        <h2>3. Uso bajo tu propio riesgo</h2>
        <p>
          El uso del sitio y la confianza en cualquier información son exclusivamente bajo tu propio
          riesgo. No somos responsables de las decisiones que tomes con base en el contenido
          proporcionado.
        </p>

        <h2>4. Descargo sobre afiliados</h2>
        <p>
          Este sitio puede contener enlaces de afiliados, incluidos enlaces a Amazon y otros socios.
          Podemos recibir comisiones por compras calificadas sin costo adicional para ti. No somos
          responsables de la calidad, exactitud o fiabilidad de productos o servicios de terceros.
        </p>

        <h2>5. Enlaces externos</h2>
        <p>
          Este sitio puede contener enlaces a sitios externos que no son operados ni mantenidos por
          nosotros. No garantizamos la exactitud, relevancia ni integridad de la información de esos
          sitios externos.
        </p>

        <h2>6. Sin garantías</h2>
        <p>
          Toda la información de este sitio se proporciona «tal cual», sin garantías de ningún tipo,
          expresas o implícitas, incluidas, entre otras, las de exactitud, integridad, fiabilidad o
          idoneidad para un propósito particular.
        </p>

        <h2>7. Limitación de responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley, {LEGAL_BRAND} no será responsable de daños
          directos, indirectos, incidentales, consecuentes o especiales que surjan de o se
          relacionen con tu uso del sitio o tu confianza en la información proporcionada.
        </p>

        <h2>8. Testimonios y resultados</h2>
        <p>
          Cualquier testimonio o ejemplo en este sitio representa experiencias individuales y no
          garantiza que obtengas los mismos resultados.
        </p>

        <h2>9. Ley aplicable</h2>
        <p>
          Este Aviso legal se rige e interpreta conforme a las leyes del Estado de California,
          Estados Unidos.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Si tienes preguntas sobre este Aviso legal, puedes contactarnos en{' '}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Disclaimer</h1>
      <p>
        <em>Last updated: {LEGAL_LAST_UPDATED.en}.</em>
      </p>
      <p>
        <strong>
          {LEGAL_BRAND} provides consulting and education services on completing immigration forms.
          We do not provide legal advice or representation in immigration court. {LEGAL_BRAND} is
          not a law firm and does not provide legal advice.
        </strong>
      </p>
      <p>
        The information provided by {LEGAL_BRAND} (“the Company,” “we,” “us,” or “our”) on this
        website is for general informational and educational purposes only. By using this website,
        you acknowledge and agree to this Disclaimer.
      </p>

      <h2>1. No professional advice</h2>
      <p>
        All content, including courses, materials, blog posts, recommendations, and other
        information, is provided for informational and educational purposes only and does not
        constitute financial, legal, tax, medical, or other professional advice. You should consult
        with a qualified professional before making any decisions based on the information provided
        on this website.
      </p>

      <h2>2. No guarantees of results</h2>
      <p>
        We make no guarantees regarding any specific results, outcomes, or earnings from the use of
        our content, products, or services. Any examples of results, income, or success are
        illustrative only and are not guarantees of future performance. Your results may vary based
        on individual factors, including effort, experience, and external conditions.
      </p>

      <h2>3. Use at your own risk</h2>
      <p>
        Your use of the website and reliance on any information is solely at your own risk. We are
        not responsible for any decisions you make based on the content provided.
      </p>

      <h2>4. Affiliate disclaimer</h2>
      <p>
        This website may contain affiliate links, including links to Amazon and other partners. We
        may earn commissions from qualifying purchases at no additional cost to you. We are not
        responsible for the quality, accuracy, or reliability of third-party products or services.
      </p>

      <h2>5. External links disclaimer</h2>
      <p>
        This website may contain links to external websites that are not provided or maintained by
        us. We do not guarantee the accuracy, relevance, or completeness of any information on these
        external websites.
      </p>

      <h2>6. No warranties</h2>
      <p>
        All information on this website is provided “as is” without any warranties of any kind,
        express or implied, including but not limited to warranties of accuracy, completeness,
        reliability, or fitness for a particular purpose.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {LEGAL_BRAND} shall not be liable for any direct,
        indirect, incidental, consequential, or special damages arising out of or related to your
        use of the website or reliance on any information provided.
      </p>

      <h2>8. Testimonials and results</h2>
      <p>
        Any testimonials or examples on this website represent individual experiences and are not
        guarantees that you will achieve the same results.
      </p>

      <h2>9. Governing law</h2>
      <p>
        This Disclaimer shall be governed by and construed in accordance with the laws of the State
        of California, United States.
      </p>

      <h2>10. Contact</h2>
      <p>
        If you have any questions regarding this Disclaimer, you may contact us at{' '}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> — {LEGAL_BRAND}.
      </p>
    </>
  );
}
