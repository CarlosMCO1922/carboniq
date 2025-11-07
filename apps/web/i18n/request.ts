import {getRequestConfig} from 'next-intl/server';

// Provide messages and locale for locale-based routing
export default getRequestConfig(async ({requestLocale}) => {
  // requestLocale may be a string or a Promise in Next 15/16 — resolve safely
  let resolved: unknown = requestLocale;
  if (resolved && typeof resolved !== 'string') {
    try {
      resolved = await (resolved as Promise<string>);
    } catch {
      resolved = undefined;
    }
  }
  const locale = (resolved as 'pt' | 'en') ?? 'pt';
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {locale, messages};
});
