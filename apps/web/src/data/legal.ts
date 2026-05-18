// Shared constants for the legal pages. The long-form copy lives inline in each
// page (matching the sobre-nosotros bilingual pattern); only the values that
// repeat across documents are centralized here.
//
// Source: client-provided docs under "MIGRACION PLUS/TERMINOS Y CONDICIONES".
// Brand name and contact email substituted for the [Brand Name]/[Email Address]
// placeholders in the source. Keep the Disclaimer wording in sync with the
// canonical block in sobre-nosotros (see CLAUDE.md "Hard rules").

export const LEGAL_BRAND = 'Migración Plus Academy';
export const LEGAL_EMAIL = 'hola@migracionplus.academy';

/** Last-reviewed date for the legal documents, localized. */
export const LEGAL_LAST_UPDATED = {
  es: '15 de mayo de 2026',
  en: 'May 15, 2026',
} as const;
