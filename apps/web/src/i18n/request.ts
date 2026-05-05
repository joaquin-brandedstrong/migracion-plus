import { getRequestConfig } from 'next-intl/server';
import { getMessages, type Locale } from '@migracionplus/i18n';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: getMessages(locale as Locale),
    timeZone: 'America/New_York',
    now: new Date(),
  };
});
