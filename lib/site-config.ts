import type { Metadata } from 'next';

export const siteConfig = {
  name: 'ChronoManager',
  tagline: 'Master Your Time, Command Your Tasks',
  description:
    'Free task manager with Kanban, checklist, and priority views. Role-based templates, pomodoro focus timer, plant gamification, and a Today view — all in your browser with local storage.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'https://chronomanager.netlify.app',
  author: 'Abdelkader Bouzomita',
  authorUrl: 'https://abdelkader.work',
  githubUrl: 'https://github.com/Abdelkaderbzz/chronomanager',
  keywords: [
    'task management',
    'productivity app',
    'kanban board',
    'pomodoro timer',
    'todo list',
    'project management',
    'focus timer',
    'student planner',
    'developer workflow',
  ],
  ogImage: '/chronomanager-portfolio-thumbnail.png',
};

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.authorUrl }],
  creator: siteConfig.author,
  applicationName: siteConfig.name,
  category: 'productivity',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Task Management & Focus Timer`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — productivity app preview`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Task Management & Focus Timer`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export const appMetadata: Metadata = {
  title: 'Workspace',
  description:
    'Manage folders, lists, and tasks with Kanban, checklist, or priority views. Includes pomodoro focus mode and role-based templates.',
  openGraph: {
    title: `Workspace | ${siteConfig.name}`,
    description:
      'Your personal task workspace with templates, Today view, and focus timer.',
  },
};

export const focusMetadata: Metadata = {
  title: 'Focus Mode',
  description:
    'Full-screen pomodoro focus mode with plant gamification. Stay in the zone and track completed sessions.',
};
