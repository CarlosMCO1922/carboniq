import {setRequestLocale, getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import '../globals.css';
import {CurrencyProvider} from '../../components/CurrencyProvider';
import {Header} from '../../components/Header';

export function generateStaticParams() {
  return [{locale: 'pt'}, {locale: 'en'}];
}

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: 'pt' | 'en'}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header locale={locale} />
          <CurrencyProvider>
            <div className="mx-auto max-w-6xl px-4">
              {children}
            </div>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
