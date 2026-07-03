import type { RoleTemplate, TemplateId } from '@/types/templates';

const KANBAN_STATUSES = [
  { id: 'todo', name: 'To Do', emoji: '🚀', color: '#3b82f6', order: 0 },
  { id: 'pending', name: 'In Progress', emoji: '⏳', color: '#f59e0b', order: 1 },
  { id: 'done', name: 'Done', emoji: '✅', color: '#10b981', order: 2 },
];

const CHECKLIST_STATUSES = [
  { id: 'todo', name: 'To Do', emoji: '🚀', color: '#3b82f6', order: 0 },
  { id: 'done', name: 'Done', emoji: '✅', color: '#10b981', order: 1 },
];

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'developer',
    label: 'Developer',
    tagline: 'Ship code, squash bugs, stay in flow',
    description:
      'Sprint board, bug triage, and code review lists — tuned for engineering workflows.',
    accent: '#2dd4bf',
    accentMuted: 'rgba(45,212,191,0.12)',
    gradient: 'from-teal-500/25 via-cyan-400/15',
    icon: '⌨️',
    highlights: ['Sprint kanban', 'Bug priority table', 'PR checklist'],
    folders: [
      {
        name: 'Engineering',
        icon: '⚙️',
        color: '#14b8a6',
        isFavorite: true,
        lists: [
          {
            name: 'Sprint Board',
            tags: ['#sprint', '#dev'],
            viewType: 'kanban',
            isFavorite: true,
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Implement auth middleware',
                description: 'Add JWT validation to protected API routes',
                status: 'pending',
                priority: 'high',
                dueInDays: 2,
              },
              {
                title: 'Write unit tests for user service',
                description: 'Cover create, update, and delete flows',
                status: 'todo',
                priority: 'medium',
                dueInDays: 5,
              },
              {
                title: 'Refactor database queries',
                description: 'Optimize N+1 queries in list endpoints',
                status: 'todo',
                priority: 'low',
                dueInDays: null,
              },
            ],
          },
          {
            name: 'Bug Triage',
            tags: ['#bugs'],
            viewType: 'priority',
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Fix login redirect loop on Safari',
                description: 'Reproduces on mobile Safari 17+',
                status: 'todo',
                priority: 'high',
                dueInDays: 1,
              },
              {
                title: 'Toast notifications stacking incorrectly',
                description: 'Multiple toasts overlap on small screens',
                status: 'todo',
                priority: 'medium',
                dueInDays: 4,
              },
            ],
          },
          {
            name: 'Code Reviews',
            tags: ['#review'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Review PR #42 — dashboard refactor',
                description: 'Check performance and accessibility',
                status: 'todo',
                priority: 'high',
                dueInDays: 0,
              },
              {
                title: 'Review PR #39 — API pagination',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueInDays: 1,
              },
            ],
          },
        ],
      },
      {
        name: 'Learning',
        icon: '📚',
        color: '#6366f1',
        lists: [
          {
            name: 'Tech Reading',
            tags: ['#learning'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Read React 19 release notes',
                description: '',
                status: 'todo',
                priority: 'low',
                dueInDays: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'marketer',
    label: 'Marketer',
    tagline: 'Launch campaigns that convert',
    description:
      'Campaign pipeline, content calendar, and analytics tracker for growth teams.',
    accent: '#fb7185',
    accentMuted: 'rgba(251,113,133,0.12)',
    gradient: 'from-rose-500/25 via-pink-400/15',
    icon: '📣',
    highlights: ['Campaign pipeline', 'Content calendar', 'KPI tracker'],
    folders: [
      {
        name: 'Campaigns',
        icon: '🎯',
        color: '#f43f5e',
        isFavorite: true,
        lists: [
          {
            name: 'Campaign Pipeline',
            tags: ['#campaigns', '#growth'],
            viewType: 'kanban',
            isFavorite: true,
            statuses: [
              { id: 'todo', name: 'Planning', emoji: '💡', color: '#8b5cf6', order: 0 },
              { id: 'pending', name: 'Live', emoji: '🚀', color: '#f59e0b', order: 1 },
              { id: 'done', name: 'Completed', emoji: '✅', color: '#10b981', order: 2 },
            ],
            tasks: [
              {
                title: 'Q3 product launch email sequence',
                description: '5-email drip for new feature announcement',
                status: 'pending',
                priority: 'high',
                dueInDays: 3,
              },
              {
                title: 'LinkedIn ads — retargeting setup',
                description: 'Audience: trial users who did not convert',
                status: 'todo',
                priority: 'medium',
                dueInDays: 7,
              },
              {
                title: 'A/B test landing page headline',
                description: 'Test benefit-led vs feature-led copy',
                status: 'todo',
                priority: 'medium',
                dueInDays: 5,
              },
            ],
          },
          {
            name: 'Content Calendar',
            tags: ['#content'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Write blog post: productivity tips',
                description: 'Target keyword: time management for remote teams',
                status: 'todo',
                priority: 'high',
                dueInDays: 2,
              },
              {
                title: 'Schedule 4 social posts for next week',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueInDays: 1,
              },
              {
                title: 'Record product demo video',
                description: '2-minute walkthrough for homepage',
                status: 'todo',
                priority: 'low',
                dueInDays: 10,
              },
            ],
          },
        ],
      },
      {
        name: 'Analytics',
        icon: '📊',
        color: '#ec4899',
        lists: [
          {
            name: 'Weekly KPIs',
            tags: ['#metrics'],
            viewType: 'priority',
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Review conversion funnel drop-off',
                description: 'Focus on signup → activation step',
                status: 'todo',
                priority: 'high',
                dueInDays: 0,
              },
              {
                title: 'Update marketing dashboard',
                description: 'Add MQL and SQL counts',
                status: 'todo',
                priority: 'medium',
                dueInDays: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'student',
    label: 'Student',
    tagline: 'Stay on top of classes and deadlines',
    description:
      'Assignment tracker, study schedule, and exam prep — built for academic life.',
    accent: '#fbbf24',
    accentMuted: 'rgba(251,191,36,0.12)',
    gradient: 'from-amber-500/25 via-yellow-400/15',
    icon: '🎓',
    highlights: ['Assignment board', 'Study checklist', 'Exam tracker'],
    folders: [
      {
        name: 'Courses',
        icon: '📖',
        color: '#f59e0b',
        isFavorite: true,
        lists: [
          {
            name: 'Assignments',
            tags: ['#school', '#deadlines'],
            viewType: 'kanban',
            isFavorite: true,
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'History essay — Industrial Revolution',
                description: '1500 words, MLA format, due Friday',
                status: 'pending',
                priority: 'high',
                dueInDays: 4,
              },
              {
                title: 'Calculus problem set #7',
                description: 'Sections 4.1–4.3',
                status: 'todo',
                priority: 'high',
                dueInDays: 2,
              },
              {
                title: 'Group presentation slides',
                description: 'Biology — cell division unit',
                status: 'todo',
                priority: 'medium',
                dueInDays: 9,
              },
            ],
          },
          {
            name: 'Study Schedule',
            tags: ['#study'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Review lecture notes — Monday',
                description: 'Psychology chapter 6',
                status: 'todo',
                priority: 'medium',
                dueInDays: 0,
              },
              {
                title: 'Practice flashcards — Spanish vocab',
                description: 'Unit 12 words',
                status: 'todo',
                priority: 'low',
                dueInDays: 1,
              },
            ],
          },
        ],
      },
      {
        name: 'Life',
        icon: '🏠',
        color: '#8b5cf6',
        lists: [
          {
            name: 'Exams & Deadlines',
            tags: ['#exams'],
            viewType: 'priority',
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Midterm — Computer Science',
                description: 'Covers algorithms and data structures',
                status: 'todo',
                priority: 'high',
                dueInDays: 14,
              },
              {
                title: 'Register for spring courses',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueInDays: 7,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'designer',
    label: 'Designer',
    tagline: 'From brief to polished deliverables',
    description:
      'Design pipeline, client feedback, and asset library for creative workflows.',
    accent: '#a78bfa',
    accentMuted: 'rgba(167,139,250,0.12)',
    gradient: 'from-violet-500/25 via-purple-400/15',
    icon: '🎨',
    highlights: ['Design pipeline', 'Feedback tracker', 'Asset checklist'],
    folders: [
      {
        name: 'Client Work',
        icon: '💼',
        color: '#8b5cf6',
        isFavorite: true,
        lists: [
          {
            name: 'Design Pipeline',
            tags: ['#design', '#client'],
            viewType: 'kanban',
            isFavorite: true,
            statuses: [
              { id: 'todo', name: 'Brief', emoji: '📝', color: '#6366f1', order: 0 },
              { id: 'pending', name: 'In Design', emoji: '🎨', color: '#f59e0b', order: 1 },
              { id: 'done', name: 'Delivered', emoji: '✅', color: '#10b981', order: 2 },
            ],
            tasks: [
              {
                title: 'Brand identity — logo concepts',
                description: '3 directions for Acme Corp rebrand',
                status: 'pending',
                priority: 'high',
                dueInDays: 3,
              },
              {
                title: 'Mobile app UI — onboarding screens',
                description: '5 screens, light + dark mode',
                status: 'todo',
                priority: 'high',
                dueInDays: 6,
              },
              {
                title: 'Social media template pack',
                description: 'Instagram + LinkedIn formats',
                status: 'todo',
                priority: 'medium',
                dueInDays: null,
              },
            ],
          },
          {
            name: 'Client Feedback',
            tags: ['#feedback'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Revise homepage mockup v2',
                description: 'Client asked for bolder typography',
                status: 'todo',
                priority: 'high',
                dueInDays: 1,
              },
              {
                title: 'Export final assets for dev handoff',
                description: 'Figma + SVG icons',
                status: 'todo',
                priority: 'medium',
                dueInDays: 4,
              },
            ],
          },
        ],
      },
      {
        name: 'Portfolio',
        icon: '✨',
        color: '#d946ef',
        lists: [
          {
            name: 'Personal Projects',
            tags: ['#portfolio'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Case study — e-commerce redesign',
                description: 'Write process + outcomes',
                status: 'todo',
                priority: 'low',
                dueInDays: null,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    tagline: 'Manage clients, projects, and business',
    description:
      'Active projects board, invoice tracker, and lead pipeline for independent work.',
    accent: '#34d399',
    accentMuted: 'rgba(52,211,153,0.12)',
    gradient: 'from-emerald-500/25 via-green-400/15',
    icon: '💡',
    highlights: ['Project board', 'Invoice tracker', 'Lead pipeline'],
    folders: [
      {
        name: 'Clients',
        icon: '🤝',
        color: '#10b981',
        isFavorite: true,
        lists: [
          {
            name: 'Active Projects',
            tags: ['#clients', '#projects'],
            viewType: 'kanban',
            isFavorite: true,
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Website rebuild — Studio Nova',
                description: 'Phase 2: product pages',
                status: 'pending',
                priority: 'high',
                dueInDays: 5,
              },
              {
                title: 'Monthly retainer — content updates',
                description: 'Blog + newsletter for TechFlow',
                status: 'todo',
                priority: 'medium',
                dueInDays: 2,
              },
              {
                title: 'Logo delivery — Bloom Café',
                description: 'Final files + brand guidelines PDF',
                status: 'todo',
                priority: 'high',
                dueInDays: 1,
              },
            ],
          },
          {
            name: 'Invoices & Admin',
            tags: ['#admin'],
            viewType: 'checklist',
            statuses: CHECKLIST_STATUSES,
            tasks: [
              {
                title: 'Send invoice #104 — Studio Nova',
                description: 'Milestone 2 payment',
                status: 'todo',
                priority: 'high',
                dueInDays: 0,
              },
              {
                title: 'Follow up on overdue invoice #101',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueInDays: 1,
              },
            ],
          },
        ],
      },
      {
        name: 'Business',
        icon: '📈',
        color: '#059669',
        lists: [
          {
            name: 'Lead Pipeline',
            tags: ['#leads'],
            viewType: 'priority',
            statuses: KANBAN_STATUSES,
            tasks: [
              {
                title: 'Proposal for GreenLeaf startup',
                description: 'Full brand + web package',
                status: 'todo',
                priority: 'high',
                dueInDays: 3,
              },
              {
                title: 'Discovery call — Marcus (referral)',
                description: 'Needs e-commerce consulting',
                status: 'todo',
                priority: 'medium',
                dueInDays: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'blank',
    label: 'Blank slate',
    tagline: 'Start fresh with a clean workspace',
    description: 'One empty folder and list — no sample tasks, full creative freedom.',
    accent: '#94a3b8',
    accentMuted: 'rgba(148,163,184,0.12)',
    gradient: 'from-slate-400/20 via-zinc-400/10',
    icon: '✦',
    highlights: ['Empty workspace', 'No sample data', 'Your rules'],
    folders: [
      {
        name: 'My Workspace',
        icon: '📁',
        color: '#64748b',
        lists: [
          {
            name: 'Tasks',
            tags: ['#tasks'],
            viewType: 'kanban',
            statuses: KANBAN_STATUSES,
            tasks: [],
          },
        ],
      },
    ],
  },
];

export function getTemplateById(id: TemplateId): RoleTemplate {
  return ROLE_TEMPLATES.find((t) => t.id === id) ?? ROLE_TEMPLATES[0];
}

export function getTemplateStats(template: RoleTemplate) {
  const folderCount = template.folders.length;
  const listCount = template.folders.reduce((n, f) => n + f.lists.length, 0);
  const taskCount = template.folders.reduce(
    (n, f) => n + f.lists.reduce((m, l) => m + l.tasks.length, 0),
    0
  );
  return { folderCount, listCount, taskCount };
}
