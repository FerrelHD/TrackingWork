import type { Application } from '../types.ts';

const STORAGE_KEY = 'maganghub_tracker_data_v2';

export const INITIAL_APPLICATIONS: Application[] = [];

export function getStoredApplications(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredApplications(INITIAL_APPLICATIONS);
      return INITIAL_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_APPLICATIONS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load applications from localStorage:', err);
    return INITIAL_APPLICATIONS;
  }
}

export function saveStoredApplications(apps: Application[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications to localStorage:', err);
  }
}

export function exportBackupJSON(apps: Application[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `maganghub-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function resetToDefaultData(): Application[] {
  saveStoredApplications([]);
  return [];
}
