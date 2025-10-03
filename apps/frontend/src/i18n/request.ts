import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from headers or default to 'tr'
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  // Simple locale detection - you can make this more sophisticated
  const locale = acceptLanguage.includes('en') ? 'en' : 'tr';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});