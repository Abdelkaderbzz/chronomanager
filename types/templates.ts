import type { ViewType } from '@/types/types';

export type TemplateId =
  | 'developer'
  | 'marketer'
  | 'student'
  | 'designer'
  | 'freelancer'
  | 'blank';

export type TemplateListDef = {
  name: string;
  tags: string[];
  viewType: ViewType;
  isFavorite?: boolean;
  statuses: {
    id: string;
    name: string;
    emoji: string;
    color: string;
    order: number;
  }[];
  tasks: {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueInDays: number | null;
  }[];
};

export type TemplateFolderDef = {
  name: string;
  icon: string;
  color: string;
  isFavorite?: boolean;
  lists: TemplateListDef[];
};

export type RoleTemplate = {
  id: TemplateId;
  label: string;
  tagline: string;
  description: string;
  accent: string;
  accentMuted: string;
  gradient: string;
  icon: string;
  highlights: string[];
  folders: TemplateFolderDef[];
};
