import type { Metadata } from 'next';
import { rootMetadata } from '@/lib/site-config';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Syne, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${syne.variable} ${dmSans.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Script id='feeduser-widget' strategy='afterInteractive'>
          {`
            window.Fu = window.Fu || {};
            Fu.access_token = "c73c052759e3602ca716ff469cde44";
            (function (d) {
              const s = d.createElement("script");
              s.async = true;
              s.src = "https://widget.feeduser.me/widget/v1.js";
              (d.head || d.body).appendChild(s);
            })(document);
          `}
        </Script>
      </body>
    </html>
  );
}
