import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LEGAL_BRAND, LEGAL_LAST_UPDATED } from '@/data/legal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return { title: t('contentUse') };
}

export default async function ContentUsePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale === 'es';

  if (isEs) {
    return (
      <>
        <h1>Política de uso de contenido y antipiratería</h1>
        <p>
          <em>Última actualización: {LEGAL_LAST_UPDATED.es}.</em>
        </p>
        <p>
          Todo el contenido proporcionado por {LEGAL_BRAND}, incluidos, entre otros, cursos, videos,
          documentos, descargas, audio, gráficos y materiales (en conjunto, el «Contenido»), está
          protegido por las leyes de derechos de autor y propiedad intelectual.
        </p>

        <h2>1. Licencia solo personal</h2>
        <p>
          Tras la compra, se te concede una licencia limitada, no exclusiva, intransferible y
          revocable para acceder y usar el Contenido estrictamente para tu uso personal y no
          comercial. No adquieres derechos de propiedad sobre ningún Contenido.
        </p>

        <h2>2. Prohibiciones estrictas</h2>
        <p>Aceptas que, bajo ninguna circunstancia:</p>
        <ul>
          <li>Copiarás, reproducirás ni duplicarás el Contenido.</li>
          <li>Compartirás credenciales de inicio de sesión con otras personas.</li>
          <li>Distribuirás, publicarás ni transmitirás el Contenido.</li>
          <li>Venderás, revenderás, sublicenciarás ni explotarás comercialmente el Contenido.</li>
          <li>
            Subirás el Contenido a plataformas de intercambio de archivos, redes sociales o sitios
            web de terceros.
          </li>
          <li>
            Grabarás, descargarás (salvo que se permita expresamente) ni capturarás en pantalla los
            materiales del curso.
          </li>
          <li>Crearás obras derivadas basadas en el Contenido.</li>
        </ul>

        <h2>3. Uso no autorizado y aplicación</h2>
        <p>
          Cualquier uso, reproducción o distribución no autorizada del Contenido constituye una
          violación de la ley de derechos de autor y puede resultar en:
        </p>
        <ul>
          <li>Terminación inmediata del acceso sin reembolso.</li>
          <li>Acciones legales, incluidas reclamaciones por daños y pérdida de ingresos.</li>
          <li>Reporte a las plataformas o autoridades correspondientes.</li>
        </ul>
        <p>
          Monitoreamos activamente la distribución no autorizada y hacemos valer nuestros derechos
          en la máxima medida permitida por la ley.
        </p>

        <h2>4. Seguimiento y monitoreo digital</h2>
        <p>
          Nos reservamos el derecho de usar tecnologías de seguimiento digital, marcas de agua y
          monitoreo para detectar el uso o la distribución no autorizada de nuestro Contenido.
        </p>

        <h2>5. Medidas cautelares</h2>
        <p>
          Aceptas que cualquier violación de esta Política puede causar un daño irreparable a la
          Compañía, y nos reservamos el derecho de solicitar medidas cautelares y otros recursos
          legales sin necesidad de constituir fianza.
        </p>

        <h2>6. Aceptación</h2>
        <p>
          Al comprar o acceder a nuestro Contenido, reconoces y aceptas cumplir con esta Política.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Content use and anti-piracy policy</h1>
      <p>
        <em>Last updated: {LEGAL_LAST_UPDATED.en}.</em>
      </p>
      <p>
        All content provided by {LEGAL_BRAND}, including but not limited to courses, videos,
        documents, downloads, audio, graphics, and materials (collectively, the “Content”), is
        protected by copyright and intellectual property laws.
      </p>

      <h2>1. Personal license only</h2>
      <p>
        Upon purchase, you are granted a limited, non-exclusive, non-transferable, revocable license
        to access and use the Content strictly for your personal, non-commercial use. You do not
        acquire ownership rights to any Content.
      </p>

      <h2>2. Strict prohibitions</h2>
      <p>You agree that you will NOT, under any circumstances:</p>
      <ul>
        <li>Copy, reproduce, or duplicate the Content.</li>
        <li>Share login credentials with others.</li>
        <li>Distribute, publish, or transmit the Content.</li>
        <li>Sell, resell, sublicense, or commercially exploit the Content.</li>
        <li>
          Upload the Content to file-sharing platforms, social media, or third-party websites.
        </li>
        <li>
          Record, download (unless explicitly permitted), or screen-capture course materials.
        </li>
        <li>Create derivative works based on the Content.</li>
      </ul>

      <h2>3. Unauthorized use and enforcement</h2>
      <p>
        Any unauthorized use, reproduction, or distribution of the Content constitutes a violation
        of copyright law and may result in:
      </p>
      <ul>
        <li>Immediate termination of access without refund.</li>
        <li>Legal action, including claims for damages and lost revenue.</li>
        <li>Reporting to relevant platforms or authorities.</li>
      </ul>
      <p>
        We actively monitor for unauthorized distribution and enforce our rights to the fullest
        extent permitted by law.
      </p>

      <h2>4. Digital tracking and monitoring</h2>
      <p>
        We reserve the right to use digital tracking, watermarking, and monitoring technologies to
        detect unauthorized use or distribution of our Content.
      </p>

      <h2>5. Injunctive relief</h2>
      <p>
        You agree that any violation of this Policy may cause irreparable harm to the Company, and
        we reserve the right to seek injunctive relief and other legal remedies without the need to
        post bond.
      </p>

      <h2>6. Agreement</h2>
      <p>
        By purchasing or accessing our Content, you acknowledge and agree to comply with this
        Policy.
      </p>
    </>
  );
}
