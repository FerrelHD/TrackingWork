import React from 'react';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';
import { FilterState, WorkMode, MainStatus, SortOption } from '../types';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  totalResults,
}) => {
  const workModes: Array<{ label: string; value: 'ALL' | WorkMode }> = [
    { label: 'Semua Mode', value: 'ALL' },
    { label: 'WFO', value: 'WFO' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'WFH', value: 'WFH' },
  ];

  const statuses: Array<{ label: string; value: 'ALL' | MainStatus }> = [
    { label: 'Semua Status', value: 'ALL' },
    { label: 'Wishlist / Belum Daftar', value: 'wishlist' },
    { label: 'Applied / Administrasi', value: 'applied' },
    { label: 'Assessment / Tes', value: 'assessment' },
    { label: 'Interview', value: 'interview' },
    { label: 'Offering / Rejected', value: 'offering_rejected' },
  ];

  const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: 'Deadline Terdekat', value: 'deadline_asc' },
    { label: 'Deadline Terjauh', value: 'deadline_desc' },
    { label: 'Baru Ditambahkan', value: 'created_desc' },
  ];

  const handleClearSearch = () => {
    setFilter((prev) => ({ ...prev, search: '' }));
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-3.5 sm:p-4 mb-6 shadow-[0_4px_0_0_#CBD5E1]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.2]" />
          <input
            type="text"
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Cari target perusahaan atau posisi (misal: Telkom, Frontend)..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-spidey-blue transition-all"
          />
          {filter.search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Work Mode Toggle Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-200">
            {workModes.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter((prev) => ({ ...prev, workMode: item.value }))}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  filter.workMode === item.value
                    ? 'bg-spidey-blue text-white shadow-[0_2px_0_0_#1E40AF]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown Filter */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none stroke-[2.2]" />
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  status: e.target.value as 'ALL' | MainStatus,
                }))
              }
              aria-label="Filter berdasarkan status pendaftaran"
              className="pl-8 pr-7 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-spidey-blue cursor-pointer appearance-none shadow-2xs"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none stroke-[2.2]" />
            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value as SortOption,
                }))
              }
              aria-label="Urutkan daftar lowongan"
              className="pl-8 pr-7 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-spidey-blue cursor-pointer appearance-none shadow-2xs"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-bold px-1 hidden sm:block">
            {totalResults} hasil
          </div>
        </div>
      </div>
    </div>
  );
};
