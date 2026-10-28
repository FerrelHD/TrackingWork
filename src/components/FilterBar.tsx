import React from 'react';
import { FilterState, WorkMode, MainStatus, SortOption } from '../types';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'table' | 'kanban';
  setViewMode: (mode: 'table' | 'kanban') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  viewMode,
  setViewMode,
}) => {
  const statuses: Array<{ label: string; value: 'ALL' | MainStatus }> = [
    { label: 'Semua status', value: 'ALL' },
    { label: 'Wishlist', value: 'wishlist' },
    { label: 'Applied', value: 'applied' },
    { label: 'Assessment', value: 'assessment' },
    { label: 'Interview', value: 'interview' },
    { label: 'Offering / Rejected', value: 'offering_rejected' },
  ];

  return (
    <section className="spidey-clay flex flex-wrap gap-3 items-center mb-5 p-3.5 sm:p-4">
      {/* Search Input */}
      <input
        type="search"
        value={filter.search}
        onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
        placeholder="Cari perusahaan atau posisi"
        aria-label="Cari"
        className="spidey-press flex-1 min-w-[200px] text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-theme-blue/50"
      />

      {/* Mode Filter Dropdown */}
      <select
        value={filter.workMode}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, workMode: e.target.value as 'ALL' | WorkMode }))
        }
        aria-label="Mode kerja"
        className="spidey-press text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
      >
        <option value="ALL">Semua mode</option>
        <option value="WFO">WFO</option>
        <option value="Hybrid">Hybrid</option>
        <option value="WFH">WFH</option>
      </select>

      {/* Status Filter Dropdown */}
      <select
        value={filter.status}
        onChange={(e) =>
          setFilter((prev) => ({
            ...prev,
            status: e.target.value as 'ALL' | MainStatus,
          }))
        }
        aria-label="Status"
        className="spidey-press text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Sort Dropdown */}
      <select
        value={filter.sortBy}
        onChange={(e) =>
          setFilter((prev) => ({
            ...prev,
            sortBy: e.target.value as SortOption,
          }))
        }
        aria-label="Urutkan"
        className="spidey-press text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
      >
        <option value="deadline_asc">Deadline terdekat</option>
        <option value="deadline_desc">Deadline terjauh</option>
        <option value="created_desc">Baru ditambahkan</option>
      </select>

      {/* View Switcher Segmented Control (.seg) */}
      <div className="spidey-press flex p-1 gap-1" role="tablist">
        <button
          onClick={() => setViewMode('table')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
            viewMode === 'table'
              ? 'spidey-btn-blue text-white shadow-sm'
              : 'text-theme-mute hover:text-theme-ink'
          }`}
        >
          Tabel
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
            viewMode === 'kanban'
              ? 'spidey-btn-blue text-white shadow-sm'
              : 'text-theme-mute hover:text-theme-ink'
          }`}
        >
          Kanban
        </button>
      </div>
    </section>
  );
};
