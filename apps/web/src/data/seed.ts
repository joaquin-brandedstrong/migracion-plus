/**
 * Static seed data used by marketing pages until Supabase is wired up.
 * Once the migrations are applied and the seed script is run, replace
 * imports of these arrays with typed Supabase queries.
 *
 * Bilingual fields use { es, en } shape to match DB columns name_es / name_en.
 */

export type Bilingual = { es: string; en: string };

export interface CourseSeed {
  slug: string;
  category: { slug: string; label: Bilingual };
  title: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  lessonCount: number;
  language: ('es' | 'en')[];
  priceCents: number;
  compareAtCents?: number;
  badge?: Bilingual;
  rating: number;
  ratingCount: number;
  instructor: { name: string; avatar: string };
  whatYouWillLearn: Bilingual[];
  requirements: Bilingual[];
  audience: Bilingual[];
  modules: {
    title: Bilingual;
    lessons: { title: Bilingual; duration: number; preview?: boolean }[];
  }[];
}

const familia: CourseSeed['category'] = {
  slug: 'familia',
  label: { es: 'Inmigración Familiar', en: 'Family Immigration' },
};
const ciudadania: CourseSeed['category'] = {
  slug: 'ciudadania',
  label: { es: 'Ciudadanía y Naturalización', en: 'Citizenship & Naturalization' },
};
const visas: CourseSeed['category'] = {
  slug: 'visas',
  label: { es: 'Visas y Permisos de Trabajo', en: 'Visas & Work Permits' },
};

export const courses: CourseSeed[] = [
  {
    slug: 'i-130-peticion-familiar',
    category: familia,
    title: {
      es: 'Petición Familiar I-130 paso a paso',
      en: 'I-130 Family Petition Step by Step',
    },
    subtitle: {
      es: 'Aprende a llenar la petición para familiares directos sin contratar abogado.',
      en: 'Learn to file the petition for direct family members without hiring an attorney.',
    },
    description: {
      es: 'Curso práctico que te guía página por página en el formulario I-130 de USCIS, con plantillas, listas de verificación y ejemplos reales de documentos de respaldo.',
      en: 'Practical course that guides you page by page through the USCIS I-130 form, with templates, checklists, and real examples of supporting documents.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=80',
    level: 'beginner',
    durationMinutes: 240,
    lessonCount: 18,
    language: ['es', 'en'],
    priceCents: 9900,
    compareAtCents: 14900,
    badge: { es: 'Best Seller', en: 'Best Seller' },
    rating: 4.8,
    ratingCount: 312,
    instructor: { name: 'Lic. Daniela Restrepo', avatar: '/brand/instructor-1.svg' },
    whatYouWillLearn: [
      { es: 'Identificar quién califica como familiar directo', en: 'Identify who qualifies as a direct family member' },
      { es: 'Reunir y organizar todos los documentos de respaldo', en: 'Gather and organize all supporting documents' },
      { es: 'Llenar correctamente cada sección del I-130', en: 'Correctly fill out each section of the I-130' },
      { es: 'Pagar las tarifas y enviar la petición a USCIS', en: 'Pay the fees and submit the petition to USCIS' },
      { es: 'Hacer seguimiento al case status en línea', en: 'Track the case status online' },
      { es: 'Responder a un Request for Evidence (RFE)', en: 'Respond to a Request for Evidence (RFE)' },
      { es: 'Entender los tiempos típicos de procesamiento', en: 'Understand typical processing times' },
      { es: 'Evitar los 10 errores más comunes', en: 'Avoid the 10 most common mistakes' },
    ],
    requirements: [
      { es: 'Acceso a internet y un dispositivo (computadora, tablet o teléfono).', en: 'Internet access and a device (computer, tablet, or phone).' },
      { es: 'Documentos de identidad del peticionario y beneficiario.', en: 'Identity documents of the petitioner and beneficiary.' },
    ],
    audience: [
      { es: 'Ciudadanos y residentes permanentes que quieren peticionar a un familiar.', en: 'Citizens and permanent residents who want to petition for a family member.' },
      { es: 'Personas que prefieren entender el proceso antes de contratar a un consultor.', en: 'People who prefer to understand the process before hiring a consultant.' },
    ],
    modules: [
      {
        title: { es: 'Antes de empezar', en: 'Before you start' },
        lessons: [
          { title: { es: 'Bienvenida y cómo usar el curso', en: 'Welcome and how to use the course' }, duration: 6, preview: true },
          { title: { es: '¿Quién puede peticionar?', en: 'Who can petition?' }, duration: 12, preview: true },
          { title: { es: 'Categorías y tiempos de espera', en: 'Categories and waiting times' }, duration: 14 },
        ],
      },
      {
        title: { es: 'El formulario I-130 sección por sección', en: 'The I-130 form section by section' },
        lessons: [
          { title: { es: 'Datos del peticionario', en: 'Petitioner data' }, duration: 18 },
          { title: { es: 'Datos del beneficiario', en: 'Beneficiary data' }, duration: 22 },
          { title: { es: 'Información biográfica G-325A', en: 'G-325A biographic information' }, duration: 16 },
          { title: { es: 'Documentos de respaldo', en: 'Supporting documents' }, duration: 24 },
          { title: { es: 'Firma, pago y envío', en: 'Signature, payment, and submission' }, duration: 18 },
        ],
      },
      {
        title: { es: 'Después de enviar', en: 'After you file' },
        lessons: [
          { title: { es: 'Recibo de USCIS y seguimiento', en: 'USCIS receipt and tracking' }, duration: 12 },
          { title: { es: 'Cómo responder un RFE', en: 'How to respond to an RFE' }, duration: 20 },
          { title: { es: 'Próximos pasos: NVC y entrevista', en: 'Next steps: NVC and interview' }, duration: 18 },
        ],
      },
    ],
  },
  {
    slug: 'ajuste-de-estatus-i-485',
    category: familia,
    title: { es: 'Ajuste de estatus I-485', en: 'Adjustment of Status I-485' },
    subtitle: {
      es: 'Cómo solicitar la residencia permanente desde Estados Unidos.',
      en: 'How to apply for permanent residence from inside the United States.',
    },
    description: {
      es: 'Curso completo sobre el proceso de ajuste de estatus, incluyendo la elegibilidad, los formularios complementarios y la entrevista en USCIS.',
      en: 'Complete course on the adjustment of status process, including eligibility, supplemental forms, and the USCIS interview.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    level: 'intermediate',
    durationMinutes: 320,
    lessonCount: 22,
    language: ['es'],
    priceCents: 14900,
    rating: 4.9,
    ratingCount: 198,
    instructor: { name: 'Lic. Daniela Restrepo', avatar: '/brand/instructor-1.svg' },
    whatYouWillLearn: [
      { es: 'Verificar tu elegibilidad para ajuste', en: 'Verify your adjustment eligibility' },
      { es: 'Preparar I-485, I-864, I-693 y formularios relacionados', en: 'Prepare I-485, I-864, I-693, and related forms' },
      { es: 'Reunir evidencia de relación bona fide', en: 'Gather bona fide relationship evidence' },
      { es: 'Prepararte para la entrevista', en: 'Prepare for the interview' },
    ],
    requirements: [
      { es: 'Tener una petición I-130 aprobada o categoría de elegibilidad.', en: 'Have an approved I-130 petition or eligibility category.' },
    ],
    audience: [
      { es: 'Beneficiarios de una petición familiar dentro de EE.UU.', en: 'Beneficiaries of a family petition inside the U.S.' },
    ],
    modules: [
      {
        title: { es: 'Elegibilidad y estrategia', en: 'Eligibility and strategy' },
        lessons: [
          { title: { es: '¿Calificas para ajustar?', en: 'Do you qualify to adjust?' }, duration: 14, preview: true },
          { title: { es: 'Reglas de admisibilidad', en: 'Admissibility rules' }, duration: 18 },
        ],
      },
      {
        title: { es: 'Paquete completo de formularios', en: 'Full forms package' },
        lessons: [
          { title: { es: 'Formulario I-485 detallado', en: 'I-485 form in detail' }, duration: 28 },
          { title: { es: 'Affidavit of Support I-864', en: 'Affidavit of Support I-864' }, duration: 22 },
          { title: { es: 'Examen médico I-693', en: 'I-693 medical exam' }, duration: 16 },
        ],
      },
    ],
  },
  {
    slug: 'naturalizacion-n-400',
    category: ciudadania,
    title: { es: 'Naturalización N-400', en: 'Naturalization N-400' },
    subtitle: {
      es: 'De residente a ciudadano: prepárate para la entrevista y el examen cívico.',
      en: 'From resident to citizen: prepare for the interview and civics test.',
    },
    description: {
      es: 'Aprende a llenar el formulario N-400, organiza tus documentos y practica las 100 preguntas del examen de civismo en español o inglés.',
      en: 'Learn to fill out the N-400, organize your documents, and practice the 100 civics questions in Spanish or English.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1494172961521-33799ddd43a5?auto=format&fit=crop&w=1200&q=80',
    level: 'beginner',
    durationMinutes: 280,
    lessonCount: 20,
    language: ['es', 'en'],
    priceCents: 12900,
    badge: { es: 'Nuevo', en: 'New' },
    rating: 4.7,
    ratingCount: 145,
    instructor: { name: 'Lic. Mauricio Pinilla', avatar: '/brand/instructor-2.svg' },
    whatYouWillLearn: [
      { es: 'Determinar si calificas para naturalización', en: 'Determine if you qualify for naturalization' },
      { es: 'Llenar correctamente el N-400', en: 'Correctly fill out the N-400' },
      { es: 'Practicar las 100 preguntas de civismo', en: 'Practice the 100 civics questions' },
      { es: 'Hacer una entrevista simulada con feedback', en: 'Take a mock interview with feedback' },
    ],
    requirements: [
      { es: 'Ser residente permanente con tiempo suficiente.', en: 'Be a permanent resident with sufficient time.' },
    ],
    audience: [{ es: 'Residentes permanentes listos para la ciudadanía.', en: 'Permanent residents ready for citizenship.' }],
    modules: [
      {
        title: { es: 'Preparación', en: 'Preparation' },
        lessons: [
          { title: { es: 'Requisitos para naturalizar', en: 'Naturalization requirements' }, duration: 14, preview: true },
          { title: { es: 'Documentos que necesitas', en: 'Documents you need' }, duration: 16 },
        ],
      },
      {
        title: { es: 'El examen cívico', en: 'The civics test' },
        lessons: [
          { title: { es: 'Las 100 preguntas (parte 1 de 4)', en: 'The 100 questions (part 1 of 4)' }, duration: 22 },
          { title: { es: 'Las 100 preguntas (parte 2 de 4)', en: 'The 100 questions (part 2 of 4)' }, duration: 22 },
        ],
      },
    ],
  },
  {
    slug: 'examen-de-civismo-en-espanol',
    category: ciudadania,
    title: { es: 'Examen de civismo en español', en: 'Civics test in Spanish' },
    subtitle: {
      es: 'Domina las 100 preguntas con audios, flashcards y simulacros.',
      en: 'Master the 100 questions with audio, flashcards, and mock tests.',
    },
    description: {
      es: 'Prepárate para el examen de civismo con explicaciones claras, audios para escuchar mientras manejas y simulacros cronometrados.',
      en: 'Prepare for the civics test with clear explanations, audio to listen on the go, and timed mock tests.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1517176118179-65244903d13c?auto=format&fit=crop&w=1200&q=80',
    level: 'beginner',
    durationMinutes: 180,
    lessonCount: 16,
    language: ['es'],
    priceCents: 4900,
    rating: 4.9,
    ratingCount: 421,
    instructor: { name: 'Lic. Mauricio Pinilla', avatar: '/brand/instructor-2.svg' },
    whatYouWillLearn: [
      { es: 'Memorizar las respuestas oficiales', en: 'Memorize the official answers' },
      { es: 'Entender el contexto histórico de cada pregunta', en: 'Understand the historical context of each question' },
    ],
    requirements: [{ es: 'Ninguno.', en: 'None.' }],
    audience: [{ es: 'Residentes que se preparan para la entrevista.', en: 'Residents preparing for the interview.' }],
    modules: [
      {
        title: { es: 'Bloque 1: principios democráticos', en: 'Block 1: democratic principles' },
        lessons: [{ title: { es: 'Preguntas 1-25', en: 'Questions 1-25' }, duration: 26, preview: true }],
      },
    ],
  },
  {
    slug: 'visa-h-1b-trabajo',
    category: visas,
    title: { es: 'Visa H-1B de trabajo', en: 'H-1B Work Visa' },
    subtitle: {
      es: 'Lo que empleados y empleadores deben saber para una solicitud exitosa.',
      en: 'What employees and employers need to know for a successful application.',
    },
    description: {
      es: 'Curso enfocado en el lado del beneficiario: requisitos, lotería, transferencia de patrocinador y renovaciones.',
      en: 'Course focused on the beneficiary side: requirements, lottery, sponsor transfer, and renewals.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    level: 'advanced',
    durationMinutes: 200,
    lessonCount: 14,
    language: ['es', 'en'],
    priceCents: 17900,
    rating: 4.6,
    ratingCount: 87,
    instructor: { name: 'Lic. Daniela Restrepo', avatar: '/brand/instructor-1.svg' },
    whatYouWillLearn: [
      { es: 'Entender la lotería H-1B', en: 'Understand the H-1B lottery' },
      { es: 'Preparar el LCA y la petición I-129', en: 'Prepare the LCA and I-129 petition' },
    ],
    requirements: [{ es: 'Tener oferta laboral o estar buscando una.', en: 'Have a job offer or be looking for one.' }],
    audience: [{ es: 'Profesionales con título universitario.', en: 'Professionals with a university degree.' }],
    modules: [
      {
        title: { es: 'Visión general', en: 'Overview' },
        lessons: [{ title: { es: '¿Qué es la H-1B?', en: 'What is the H-1B?' }, duration: 16, preview: true }],
      },
    ],
  },
  {
    slug: 'permiso-de-trabajo-i-765',
    category: visas,
    title: { es: 'Permiso de trabajo I-765', en: 'Work Permit I-765' },
    subtitle: {
      es: 'Solicita tu Authorization for Employment (EAD) sin errores.',
      en: 'Apply for your Employment Authorization Document (EAD) without mistakes.',
    },
    description: {
      es: 'Tutorial enfocado en cómo seleccionar la categoría correcta y reunir las pruebas necesarias.',
      en: 'Tutorial focused on choosing the right category and gathering the required evidence.',
    },
    thumbnail:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    level: 'intermediate',
    durationMinutes: 150,
    lessonCount: 12,
    language: ['es'],
    priceCents: 7900,
    rating: 4.7,
    ratingCount: 154,
    instructor: { name: 'Lic. Mauricio Pinilla', avatar: '/brand/instructor-2.svg' },
    whatYouWillLearn: [
      { es: 'Identificar tu categoría de elegibilidad', en: 'Identify your eligibility category' },
      { es: 'Llenar el formulario I-765', en: 'Fill out the I-765 form' },
    ],
    requirements: [{ es: 'Tener una base de elegibilidad.', en: 'Have an eligibility basis.' }],
    audience: [{ es: 'Personas con caso pendiente que necesitan EAD.', en: 'People with pending cases who need an EAD.' }],
    modules: [
      {
        title: { es: 'Categorías y elegibilidad', en: 'Categories and eligibility' },
        lessons: [{ title: { es: 'Tabla de categorías', en: 'Categories table' }, duration: 14, preview: true }],
      },
    ],
  },
];

export interface BookSeed {
  slug: string;
  title: Bilingual;
  author: string;
  description: Bilingual;
  cover: string;
  format: 'physical' | 'digital' | 'both';
  amazonUrl?: string;
  priceCents?: number;
}

export const books: BookSeed[] = [
  {
    slug: 'guia-i-130',
    title: { es: 'Guía completa del I-130', en: 'Complete I-130 Guide' },
    author: 'Lic. Daniela Restrepo',
    description: {
      es: 'Manual de referencia con plantillas, listas de verificación y casos de estudio reales.',
      en: 'Reference manual with templates, checklists, and real case studies.',
    },
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    format: 'both',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE-1',
    priceCents: 2900,
  },
  {
    slug: 'manual-de-naturalizacion',
    title: { es: 'Manual de naturalización', en: 'Naturalization Handbook' },
    author: 'Lic. Mauricio Pinilla',
    description: {
      es: 'Todo lo que necesitas para presentar el N-400 y aprobar la entrevista.',
      en: 'Everything you need to file the N-400 and pass the interview.',
    },
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    format: 'digital',
    priceCents: 1900,
  },
  {
    slug: 'flashcards-civismo',
    title: { es: 'Flashcards de civismo (físico)', en: 'Civics Flashcards (physical)' },
    author: 'Migración Plus',
    description: {
      es: 'Las 100 preguntas oficiales en formato de bolsillo, con audio QR.',
      en: 'The 100 official questions in pocket format, with QR audio.',
    },
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    format: 'physical',
    amazonUrl: 'https://www.amazon.com/dp/EXAMPLE-2',
  },
  {
    slug: 'guia-h-1b',
    title: { es: 'Guía esencial H-1B', en: 'Essential H-1B Guide' },
    author: 'Lic. Daniela Restrepo',
    description: {
      es: 'Estrategias para la lotería, transferencia y extensiones.',
      en: 'Strategies for the lottery, transfer, and extensions.',
    },
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    format: 'digital',
    priceCents: 3900,
  },
];

export interface TestimonialSeed {
  name: string;
  role: Bilingual;
  quote: Bilingual;
  avatar: string;
}

export const testimonials: TestimonialSeed[] = [
  {
    name: 'Raquel León',
    role: { es: 'Estudiante de naturalización', en: 'Naturalization student' },
    quote: {
      es: 'Pasé mi entrevista a la primera. El curso explica todo en términos que cualquiera entiende.',
      en: 'I passed my interview on the first try. The course explains everything in terms anyone can understand.',
    },
    avatar: 'https://i.pravatar.cc/120?img=1',
  },
  {
    name: 'Mónica Salas',
    role: { es: 'Residente permanente', en: 'Permanent resident' },
    quote: {
      es: 'Llené el I-130 yo misma siguiendo el curso. Ahorré miles de dólares en honorarios.',
      en: 'I filled out the I-130 myself by following the course. I saved thousands of dollars in fees.',
    },
    avatar: 'https://i.pravatar.cc/120?img=2',
  },
  {
    name: 'Lisette Basalo',
    role: { es: 'Beneficiaria de ajuste de estatus', en: 'Adjustment of status beneficiary' },
    quote: {
      es: 'El asistente IA me respondió a las 2 a.m. cuando estaba en pánico. Es como tener un consultor 24/7.',
      en: 'The AI assistant answered me at 2 a.m. when I was panicking. It is like having a consultant 24/7.',
    },
    avatar: 'https://i.pravatar.cc/120?img=3',
  },
];

export interface FaqSeed {
  q: Bilingual;
  a: Bilingual;
}

export const faqs: FaqSeed[] = [
  {
    q: { es: '¿Necesito un abogado para llenar mis formularios?', en: 'Do I need a lawyer to fill out my forms?' },
    a: {
      es: 'No es obligatorio. Nuestros cursos te enseñan a hacerlo correctamente, pero recuerda: no brindamos asesoría legal.',
      en: 'It is not required. Our courses teach you how to do it correctly, but remember: we do not provide legal advice.',
    },
  },
  {
    q: { es: '¿Los cursos están en español o inglés?', en: 'Are the courses in Spanish or English?' },
    a: {
      es: 'La mayoría tiene ambos idiomas. Cada ficha de curso indica los idiomas disponibles.',
      en: 'Most have both languages. Each course card indicates the available languages.',
    },
  },
  {
    q: { es: '¿Cuánto duran los cursos?', en: 'How long are the courses?' },
    a: {
      es: 'Entre 2 y 6 horas de video, divididas en lecciones cortas para que avances a tu ritmo.',
      en: 'Between 2 and 6 hours of video, divided into short lessons so you can progress at your own pace.',
    },
  },
  {
    q: { es: '¿Puedo ver los cursos en mi teléfono?', en: 'Can I watch the courses on my phone?' },
    a: {
      es: 'Sí, la plataforma funciona en cualquier dispositivo y guarda tu progreso automáticamente.',
      en: 'Yes, the platform works on any device and saves your progress automatically.',
    },
  },
  {
    q: { es: '¿Recibo certificado al terminar?', en: 'Do I get a certificate when I finish?' },
    a: {
      es: 'Sí. Al completar todos los módulos descargas un certificado verificable.',
      en: 'Yes. After completing all modules you can download a verifiable certificate.',
    },
  },
  {
    q: { es: '¿Hay garantía de devolución?', en: 'Is there a money-back guarantee?' },
    a: {
      es: 'Tienes 14 días para solicitar el reembolso si el curso no cumple tus expectativas.',
      en: 'You have 14 days to request a refund if the course does not meet your expectations.',
    },
  },
  {
    q: { es: '¿Migración Plus es un bufete de abogados?', en: 'Is Migración Plus a law firm?' },
    a: {
      es: 'No. Migración Plus brinda servicios de consultoría y educación. No somos un bufete y no brindamos asesoría legal.',
      en: 'No. Migración Plus provides consulting and education services. We are not a law firm and do not provide legal advice.',
    },
  },
  {
    q: { es: '¿Cómo funciona el asistente IA?', en: 'How does the AI assistant work?' },
    a: {
      es: 'Plus, nuestro asistente, conoce el contenido de cada lección y responde tus dudas. No reemplaza a un consultor humano.',
      en: 'Plus, our assistant, knows the content of each lesson and answers your questions. It does not replace a human consultant.',
    },
  },
];

export interface BlogPostSeed {
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  cover: string;
  category: Bilingual;
  author: string;
  publishedAt: string;
  readMinutes: number;
}

export const blogPosts: BlogPostSeed[] = [
  {
    slug: 'rfe-como-responder',
    title: { es: 'Cómo responder un RFE sin perder los nervios', en: 'How to respond to an RFE without losing your nerves' },
    excerpt: {
      es: 'Una guía paso a paso para entender qué pide USCIS y cómo organizar tu respuesta.',
      en: 'A step-by-step guide to understanding what USCIS is asking and how to organize your response.',
    },
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Procesos', en: 'Processes' },
    author: 'Lic. Daniela Restrepo',
    publishedAt: '2026-04-12',
    readMinutes: 8,
  },
  {
    slug: 'examen-civismo-tips',
    title: { es: '7 tips para aprobar el examen de civismo', en: '7 tips to pass the civics test' },
    excerpt: {
      es: 'Trucos que usan nuestros estudiantes para llegar relajados a la entrevista.',
      en: 'Tricks our students use to arrive at the interview relaxed.',
    },
    cover: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Naturalización', en: 'Naturalization' },
    author: 'Lic. Mauricio Pinilla',
    publishedAt: '2026-03-28',
    readMinutes: 6,
  },
  {
    slug: 'documentos-traduccion-certificada',
    title: { es: 'Documentos que necesitan traducción certificada', en: 'Documents that need certified translation' },
    excerpt: {
      es: 'Lista práctica para no perder tiempo enviando documentos sin traducir.',
      en: 'Practical list so you don\'t waste time sending untranslated documents.',
    },
    cover: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Documentos', en: 'Documents' },
    author: 'Migración Plus',
    publishedAt: '2026-03-10',
    readMinutes: 5,
  },
  {
    slug: 'i-485-ajuste-rapido',
    title: { es: 'I-485: cómo acelerar tu ajuste de estatus', en: 'I-485: how to speed up your adjustment of status' },
    excerpt: {
      es: 'Estrategias prácticas para evitar retrasos comunes en USCIS.',
      en: 'Practical strategies to avoid common USCIS delays.',
    },
    cover: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Procesos', en: 'Processes' },
    author: 'Lic. Daniela Restrepo',
    publishedAt: '2026-02-22',
    readMinutes: 9,
  },
  {
    slug: 'h1b-loteria-2026',
    title: { es: 'H-1B 2026: lo que cambió en la lotería', en: 'H-1B 2026: what changed in the lottery' },
    excerpt: {
      es: 'Las nuevas reglas de USCIS para evitar duplicados y favorecer al beneficiario.',
      en: 'The new USCIS rules to avoid duplicates and favor the beneficiary.',
    },
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Trabajo', en: 'Work' },
    author: 'Lic. Daniela Restrepo',
    publishedAt: '2026-01-30',
    readMinutes: 7,
  },
  {
    slug: 'asistente-ia-uso',
    title: { es: 'Cómo aprovechar al máximo el asistente IA', en: 'How to make the most of the AI assistant' },
    excerpt: {
      es: 'Plus aprende del contenido del curso. Aquí van 10 prompts útiles.',
      en: 'Plus learns from the course content. Here are 10 useful prompts.',
    },
    cover: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    category: { es: 'Tecnología', en: 'Technology' },
    author: 'Migración Plus',
    publishedAt: '2026-01-15',
    readMinutes: 4,
  },
];

export const categories = [familia, ciudadania, visas];
