import esMessages from '../messages/es.json';
import enMessages from '../messages/en.json';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const messages: Record<Locale, typeof esMessages> = {
  es: esMessages,
  en: enMessages,
};

export function getMessages(locale: Locale): typeof esMessages {
  return messages[locale];
}
