# ChronoManager

<div align="center">
  <img src="public/chronomanager-logo.svg" alt="ChronoManager Logo" width="120" />

  <p><em>Task management, focus timer, and role-based templates — all in your browser.</em></p>

  <p>
    <a href="https://chronomanager.netlify.app">Live demo</a>
    ·
    <a href="https://github.com/Abdelkaderbzz/chronomanager">GitHub</a>
  </p>
</div>

## Overview

ChronoManager is a free productivity app built with Next.js. Organize work in folders and lists, switch between Kanban / checklist / priority views, track due dates with a Today view, and stay focused with a pomodoro timer and plant gamification.

All data is stored locally in your browser — no account required.

## Features

### Task organization
- **Folders & lists** with tags, favorites, and drag-and-drop reordering
- **Three views**: Kanban board, checklist, priority table
- **Custom statuses** per list (emoji, color, order)
- **Global search** across all tasks
- **Today view** — overdue, due today, and upcoming tasks in one place

### Role-based templates
Pick a template on first launch and start with a pre-built workspace:
- Developer · Marketer · Student · Designer · Freelancer · Blank slate

Each template includes tailored folders, lists, and starter tasks.

### Focus & gamification
- **Pomodoro timer** with configurable focus/break cycles
- **Plant growth** — complete sessions to grow from seed to bloom
- **Focus mode** at `/app/focus` for distraction-free sessions
- Link pomodoro sessions to specific tasks

### Data & settings
- **localStorage** persistence (auto-save)
- **Export / import** JSON backups
- **Dark / light theme** toggle
- **Template switcher** in settings

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/) + shadcn/ui components

## Getting started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Install & run

```bash
git clone https://github.com/Abdelkaderbzz/chronomanager.git
cd chronomanager
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
pnpm build
pnpm start
```

> Stop the dev server before running `pnpm build` to avoid `.next` cache conflicts.

### Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO | `https://chronomanager.netlify.app` |

## Project structure

```
chronomanager/
├── app/                      # Next.js routes
│   ├── page.tsx              # Landing page
│   ├── app/                  # Task workspace
│   │   ├── page.tsx          # Main app shell
│   │   └── focus/            # Pomodoro focus mode
│   ├── layout.tsx            # Root layout + SEO metadata
│   ├── robots.ts             # robots.txt
│   └── sitemap.ts            # sitemap.xml
├── components/
│   ├── landing/              # Marketing landing page
│   ├── templates/            # Role template picker
│   ├── pomodoro/             # Timer, plant, focus UI
│   ├── views/                # Kanban, checklist, priority, today
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── templates/            # Template data & workspace builder
│   ├── site-config.ts        # SEO & site metadata
│   └── task-dates.ts         # Today view date helpers
├── hooks/                    # React hooks (pomodoro, toast, etc.)
└── types/                    # TypeScript definitions
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/app` | Task workspace (template picker on first visit) |
| `/app/focus` | Full-screen pomodoro focus mode |

## License

MIT

## Author

[Abdelkader Bouzomita](https://abdelkader.work) · [LinkedIn](https://www.linkedin.com/in/bouzomita-abdelkader-928953234/)
