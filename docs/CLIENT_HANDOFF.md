# Migración Plus Academy · Manual de entrega

Documento dirigido al cliente (administrador del sitio). Explica cómo está
construida la plataforma, qué funcionalidades están listas y qué pasos faltan
antes de salir a producción.

---

## Lo que está construido (Sesión 1)

### Sitio público bilingüe

- **Página de inicio** con hero animado, valores diferenciales, cursos destacados, "Cómo funciona", librería, testimoniales, sección del asistente IA, FAQ y CTA final.
- **Catálogo de cursos** (`/cursos`) con filtros por categoría, nivel e idioma; ordenación por popularidad, precio y rating.
- **Detalle de curso** (`/cursos/[slug]`) con currículum colapsable, tabs de descripción/instructor/reseñas, panel de compra adhesivo y cursos relacionados.
- **Tienda de libros** (`/libros`) y detalle (`/libros/[slug]`) con botones de "Comprar digital", "Comprar en Amazon" y "Comprar libro físico".
- **Sobre nosotros** con misión, visión, historia y aviso legal completo (texto exacto del brief).
- **Contacto** con formulario validado.
- **Blog** índice con post destacado + grid (los artículos individuales se construyen en una sesión posterior).
- **Páginas legales** con un banner "Pendiente de revisión legal del cliente" — el contenido debe enviarlo el abogado del cliente.

### Autenticación

- Páginas de **iniciar sesión, registro, recuperar contraseña y verificar email**, conectadas a Supabase Auth (correo + contraseña, Google OAuth y enlaces mágicos).
- **Middleware** que protege las rutas privadas (`/dashboard`, `/admin`, `/aprender`, `/checkout`).

### Diseño

- **Modo claro y oscuro** automático (sigue el sistema operativo, con toggle manual).
- **Idiomas** español (predeterminado) e inglés con cambio en un clic.
- **Tipografías**: Fraunces (encabezados editoriales) + Inter (cuerpo).
- **Animaciones** suaves y respetuosas (se desactivan si el usuario tiene "reducir movimiento" activado).

### Base de datos

- **Esquema completo** en Supabase: usuarios, cursos, módulos, lecciones, cuestionarios, inscripciones, progreso, pagos, suscripciones, libros, asistente IA, leads, campañas SMS, cupones, reseñas y registro de auditoría.
- **Políticas de seguridad por fila (RLS)** para que cada usuario solo vea lo que le corresponde.

---

## Lo que falta (próximas sesiones)

| Funcionalidad | Por qué se difirió |
|---|---|
| Reproductor de video con progreso, transcripción y notas | Requiere proveedor de video (Mux o Cloudflare Stream) ya contratado |
| Pago con Stripe y PayPal | Requiere cuentas de comerciante y claves de producción |
| Asistente IA "Plus" con conocimiento de los cursos | Requiere clave de OpenAI y embebidos de transcripciones |
| Automatización de SMS por Twilio | Requiere registro A2P 10DLC (2-4 semanas con Twilio) |
| Panel de administración completo | Depende de tener cursos y libros reales cargados |
| Plantillas de email transaccional | Requiere cuenta de Resend |
| Pruebas automáticas (E2E con Playwright) | Se ejecutan al final, sobre flujos completos |

---

## Lo que tú (cliente) debes proveer

### Contenido

- **Logos finales** y favicon (los actuales son provisionales).
- **Fotografías** de los instructores y de la oficina.
- **Texto definitivo** de Sobre Nosotros (misión, visión, historia).
- **Páginas legales** revisadas por tu abogado: Términos, Privacidad, Cookies, Aviso legal.
- **Lista final de cursos** con título, subtítulo, descripción, duración, precio, idiomas.
- **Lista final de libros** con cubierta, ISBN, URL de Amazon (con tu tag de afiliado), precio digital.
- **Bios** de los instructores.

### Cuentas y credenciales

- **Supabase** — proyecto creado, claves entregadas al equipo de desarrollo.
- **Stripe** — cuenta verificada y aprobada para pagos en USD.
- **PayPal** — cuenta de business habilitada para suscripciones.
- **Twilio** — cuenta y un número largo (long code) registrado en A2P 10DLC.
- **OpenAI** — clave API con tope de uso definido.
- **Resend** — cuenta y dominio verificado para `hola@migracionplus.academy`.
- **Mux o Cloudflare Stream** — cuenta para alojamiento de video.
- **Amazon Associates** — tag de afiliado (`?tag=migracionplus-20`).
- **Dominio** — confirmar (sugerido: `migracionplus.academy`).

---

## Cómo administrar el sitio (cuando esté listo)

> Estas instrucciones aplican una vez que el panel de administración (deferido) esté construido.

### Iniciar sesión como administrador

1. Ve a `https://tu-dominio.com/iniciar-sesion`.
2. Ingresa el correo `admin@migracionplus.com` y la contraseña inicial.
3. Cambia tu contraseña en el primer acceso desde **Configuración → Cuenta**.

### Crear un curso

1. Entra al panel: `https://tu-dominio.com/admin`.
2. Click en **Cursos → Crear curso**.
3. Sigue el asistente de 5 pasos: información básica, currículum (módulos y lecciones), precio, multimedia (videos y miniaturas) y publicación.

### Subir un video

1. Dentro del curso, abre la lección y arrastra el archivo de video al uploader.
2. El sistema lo enviará a Mux/Cloudflare, generará miniaturas y transcribirá automáticamente con Whisper.
3. La transcripción quedará editable y se usará para alimentar al asistente IA.

### Configurar precios

- En la pestaña **Precio** del curso puedes definir el precio fijo y un precio "tachado" promocional.
- Para crear suscripciones, ve a **Configuración → Pagos** y define los planes (mensual, anual, vitalicio).

### Gestionar leads

1. Abre **Leads** en el panel.
2. Verás un tablero kanban con columnas: Nuevo, Contactado, Calificado, Inscrito, Perdido.
3. Arrastra las tarjetas entre columnas. La IA genera automáticamente un resumen de calificación basado en la información del formulario.

### Enviar campaña SMS

1. **SMS → Crear campaña**.
2. Define el público (todos los inscritos, los que abandonaron, etc.).
3. Escribe la plantilla en español e inglés. Usa `{{firstName}}` para personalizar.
4. Programa o envía al instante.
5. **Importante**: por la ley A2P 10DLC, todos los SMS incluyen "Responde STOP para cancelar".

### Configurar las herramientas de IA

- **Generador de scripts**: pega un tema y la IA propone un guion de curso.
- **Generador de cuestionarios**: pega el contenido de una lección y la IA crea preguntas en JSON.
- **Traductor especializado**: traduce ES↔EN preservando la terminología legal.

---

## Soporte y contacto del equipo de desarrollo

Si encuentras un problema o necesitas una nueva función:

1. Documenta el flujo: qué hiciste, qué esperabas y qué pasó.
2. Adjunta capturas de pantalla si aplica.
3. Envía el reporte al canal de soporte acordado.

Los reportes van directamente al sistema de tickets del equipo y se priorizan
según severidad: P0 (sitio caído) → respuesta en menos de 1 hora; P1 (función
crítica rota) → 4 horas hábiles; P2 (mejoras) → siguiente release.
