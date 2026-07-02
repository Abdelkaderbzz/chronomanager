import type React from 'react';
import '@/app/globals.css';
import { Syne, DM_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

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

export const metadata = {
  title: 'ChronoManager - Master Your Time, Command Your Tasks',
  description:
    'An intuitive task management app featuring folders, lists, drag-and-drop, and three powerful views: Kanban, Priority, and Checklist — designed to keep you organized and in control.',
  keywords: [
    'task management',
    'productivity',
    'kanban',
    'todo app',
    'project management',
  ],
  authors: [{ name: 'ChronoManager Team' }],
  openGraph: {
    title: 'ChronoManager - Task Management App',
    description: 'Organize your tasks with folders, lists, and powerful views.',
    images: ['/opengraph-image.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChronoManager - Task Management App',
    description: 'Organize your tasks with folders, lists, and powerful views.',
    images: ['/opengraph-image.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/icons/favicon-16x16.svg',
    apple: '/icons/apple-touch-icon.svg',
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/icons/favicon-32x32.svg',
        sizes: '32x32',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
        <link
          rel='alternate icon'
          href='/icons/favicon-16x16.svg'
          sizes='16x16'
          type='image/svg+xml'
        />
        <link
          rel='alternate icon'
          href='/icons/favicon-32x32.svg'
          sizes='32x32'
          type='image/svg+xml'
        />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon.svg' />
      </head>
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
