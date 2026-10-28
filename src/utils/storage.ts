import type { Application } from '../types.ts';

const STORAGE_KEY = 'maganghub_tracker_data_v1';

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    companyName: 'PT Telkom Indonesia',
    position: 'Product Management Intern (MagangHub)',
    workMode: 'Hybrid',
    locationCity: 'Jakarta Selatan',
    sourceUrl: 'https://maganghub.kemnaker.go.id',
    deadlineDate: '2026-10-31',
    mainStatus: 'applied',
    selectionStages: [
      { id: 's1', name: 'Administrasi MagangHub', isCompleted: true, isCurrent: false },
      { id: 's2', name: 'Tes Kebangsaan & Logika', isCompleted: false, isCurrent: true },
      { id: 's3', name: 'Wawancara User', isCompleted: false, isCurrent: false },
      { id: 's4', name: 'Offering & Onboarding', isCompleted: false, isCurrent: false },
    ],
    requirements: [
      { id: 'r1', label: 'CV ATS Format Terbaru', isCompleted: true },
      { id: 'r2', label: 'Transkrip Nilai (IPK >= 3.25)', isCompleted: true },
      { id: 'r3', label: 'Surat Rekomendasi Fakultas / Kampus', isCompleted: true },
      { id: 'r4', label: 'Portofolio PRD / Product Case Study', isCompleted: false },
      { id: 'r5', label: 'Surat SPTJM Bermaterai', isCompleted: true },
    ],
    notes: 'Infonya tes logika ada numerik 30 soal dalam 45 menit. Cek referensi di X @kemnaker.',
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-25T14:30:00.000Z',
  },
  {
    id: 'app-2',
    companyName: 'Bank Central Asia (BCA)',
    position: 'IT Specialist Intern - Web Developer',
    workMode: 'WFO',
    locationCity: 'Jakarta Barat',
    sourceUrl: 'https://karir.bca.co.id/magang',
    deadlineDate: '2026-10-29',
    mainStatus: 'assessment',
    selectionStages: [
      { id: 's1', name: 'CV Screening', isCompleted: true, isCurrent: false },
      { id: 's2', name: 'Online Coding Test (HackerRank)', isCompleted: false, isCurrent: true },
      { id: 's3', name: 'HR Interview', isCompleted: false, isCurrent: false },
      { id: 's4', name: 'User & Head Interview', isCompleted: false, isCurrent: false },
    ],
    requirements: [
      { id: 'r1', label: 'CV Bahasa Inggris', isCompleted: true },
      { id: 'r2', label: 'GitHub Repository Link & Live Demo', isCompleted: true },
      { id: 'r3', label: 'Sertifikat Keahlian React/Node.js', isCompleted: true },
    ],
    notes: 'Deadline coding test 48 jam setelah link dikirimkan ke email. Siapkan materi DS&A dasar.',
    createdAt: '2026-10-22T08:30:00.000Z',
    updatedAt: '2026-10-27T09:15:00.000Z',
  },
  {
    id: 'app-3',
    companyName: 'GoTo Financial',
    position: 'Software Engineering Intern (Frontend)',
    workMode: 'Hybrid',
    locationCity: 'Jakarta Selatan',
    sourceUrl: 'https://linkedin.com/jobs/view/goto-intern',
    deadlineDate: '2026-11-10',
    mainStatus: 'wishlist',
    selectionStages: [
      { id: 's1', name: 'Resume Drop', isCompleted: false, isCurrent: true },
      { id: 's2', name: 'Take-home Assessment', isCompleted: false, isCurrent: false },
      { id: 's3', name: 'System Design & Code Pairing', isCompleted: false, isCurrent: false },
      { id: 's4', name: 'Culture Fit & Offer', isCompleted: false, isCurrent: false },
    ],
    requirements: [
      { id: 'r1', label: 'CV ATS Frontend Focus', isCompleted: true },
      { id: 'r2', label: 'Portfolio Website aktif', isCompleted: true },
      { id: 'r3', label: 'Kontribusi Open Source / Repo Publik', isCompleted: false },
    ],
    notes: 'Dapat info dari postingan LinkedIn HR lead GoTo. Butuh kemampuan TypeScript & Tailwind.',
    createdAt: '2026-10-24T11:00:00.000Z',
    updatedAt: '2026-10-24T11:00:00.000Z',
  },
  {
    id: 'app-4',
    companyName: 'Glints Indonesia',
    position: 'UI/UX Design Intern',
    workMode: 'WFH',
    locationCity: 'Remote',
    sourceUrl: 'https://glints.com',
    deadlineDate: '2026-10-30',
    mainStatus: 'interview',
    selectionStages: [
      { id: 's1', name: 'Portfolio Review', isCompleted: true, isCurrent: false },
      { id: 's2', name: 'Design Challenge', isCompleted: true, isCurrent: false },
      { id: 's3', name: 'Design Lead Interview', isCompleted: false, isCurrent: true },
      { id: 's4', name: 'Offering', isCompleted: false, isCurrent: false },
    ],
    requirements: [
      { id: 'r1', label: 'Link Figma / Behance Case Study', isCompleted: true },
      { id: 'r2', label: 'Resume', isCompleted: true },
      { id: 'r3', label: 'Cover Letter singkat', isCompleted: true },
    ],
    notes: 'Interview dijadwalkan besok jam 14:00 WIB via Google Meet. Persiapkan deck presentasi studi kasus 10 menit.',
    createdAt: '2026-10-18T13:45:00.000Z',
    updatedAt: '2026-10-27T16:20:00.000Z',
  },
  {
    id: 'app-5',
    companyName: 'PT Kereta Api Indonesia (Persero)',
    position: 'Data Analyst Intern',
    workMode: 'WFO',
    locationCity: 'Bandung',
    sourceUrl: 'https://recruitment.kai.id',
    deadlineDate: '2026-11-05',
    mainStatus: 'wishlist',
    selectionStages: [
      { id: 's1', name: 'Pemberkasan Online', isCompleted: false, isCurrent: true },
      { id: 's2', name: 'Tes Potensi Akademik', isCompleted: false, isCurrent: false },
      { id: 's3', name: 'Wawancara Internal', isCompleted: false, isCurrent: false },
    ],
    requirements: [
      { id: 'r1', label: 'Surat Pengantar Magang dari Kampus', isCompleted: true },
      { id: 'r2', label: 'Proposal Magang / Rencana Riset', isCompleted: false },
      { id: 'r3', label: 'Portofolio SQL & Python/PowerBI', isCompleted: false },
    ],
    notes: 'Lokasi di kantor pusat KAI Bandung. Hubungi BAAK untuk minta surat pengantar resmi.',
    createdAt: '2026-10-25T09:20:00.000Z',
    updatedAt: '2026-10-25T09:20:00.000Z',
  }
];

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
  saveStoredApplications(INITIAL_APPLICATIONS);
  return INITIAL_APPLICATIONS;
}
