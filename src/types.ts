export type WorkMode = 'WFO' | 'Hybrid' | 'WFH';

export type MainStatus =
  | 'wishlist'           // Wishlist / Belum Daftar
  | 'applied'            // Applied / Administrasi
  | 'assessment'         // Assessment / Tes
  | 'interview'          // Interview
  | 'offering_rejected'; // Offering / Rejected

export interface SelectionStage {
  id: string;
  name: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface RequirementItem {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface Application {
  id: string;
  companyName: string;
  position: string;
  workMode: WorkMode;
  locationCity: string;
  sourceUrl?: string;
  deadlineDate: string; // YYYY-MM-DD
  mainStatus: MainStatus;
  selectionStages: SelectionStage[];
  requirements: RequirementItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'deadline_asc' | 'deadline_desc' | 'created_desc';

export interface FilterState {
  search: string;
  workMode: 'ALL' | WorkMode;
  status: 'ALL' | MainStatus;
  sortBy: SortOption;
}
