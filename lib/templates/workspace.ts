import type { Folder, List, Task } from '@/types/types';
import type { TemplateId } from '@/types/templates';
import { getTemplateById } from '@/lib/templates/data';
import {
  ONBOARDING_COMPLETE_KEY,
  TEMPLATE_STORAGE_KEY,
} from '@/lib/templates/constants';

function newId(): string {
  return crypto.randomUUID();
}

function dueDateFromDays(dueInDays: number | null): string | null {
  if (dueInDays === null) return null;
  return new Date(Date.now() + dueInDays * 86400000).toISOString();
}

export function buildFoldersFromTemplate(templateId: TemplateId): Folder[] {
  const template = getTemplateById(templateId);
  const now = Date.now();

  return template.folders.map((folderDef) => ({
    id: newId(),
    name: folderDef.name,
    icon: folderDef.icon,
    color: folderDef.color,
    isFavorite: folderDef.isFavorite ?? false,
    lists: folderDef.lists.map((listDef): List => ({
      id: newId(),
      name: listDef.name,
      tags: listDef.tags,
      viewType: listDef.viewType,
      isFavorite: listDef.isFavorite ?? false,
      statuses: listDef.statuses.map((s) => ({ ...s })),
      tasks: listDef.tasks.map(
        (taskDef): Task => ({
          id: newId(),
          title: taskDef.title,
          description: taskDef.description,
          status: taskDef.status,
          priority: taskDef.priority,
          dueDate: dueDateFromDays(taskDef.dueInDays),
          createdAt: now,
          updatedAt: now,
        })
      ),
    })),
  }));
}

export function applyTemplate(templateId: TemplateId): Folder[] {
  const folders = buildFoldersFromTemplate(templateId);
  localStorage.setItem('folders', JSON.stringify(folders));
  localStorage.setItem(TEMPLATE_STORAGE_KEY, templateId);
  localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');

  if (folders[0]) {
    localStorage.setItem('activeFolder', folders[0].id);
    if (folders[0].lists[0]) {
      localStorage.setItem('activeList', folders[0].lists[0].id);
    }
  }
  localStorage.setItem('activeAppView', 'list');

  return folders;
}

export function clearWorkspaceForTemplatePicker() {
  localStorage.removeItem('folders');
  localStorage.removeItem('activeFolder');
  localStorage.removeItem('activeList');
  localStorage.removeItem('activeAppView');
  localStorage.removeItem(TEMPLATE_STORAGE_KEY);
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
}
