import React, { useRef } from 'react';
import { 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Download, 
  Upload, 
  RotateCcw,
  Target
} from 'lucide-react';
import { Application } from '../types';
import { exportBackupJSON, resetToDefaultData, saveStoredApplications } from '../utils/storage';

interface NavbarProps {
  viewMode: 'table' | 'kanban';
  setViewMode: (mode: 'table' | 'kanban') => void;
  onOpenAddModal: () => void;
  applications: Application[];
  onDataReload: (apps: Application[]) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  onOpenAddModal,
  applications,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportBackupJSON(applications);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          saveStoredApplications(parsed);
          onDataReload(parsed);
          alert('Data berhasil di-restore dari backup.');
        } else {
          alert('Format file JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan ke data contoh default? Perubahan kustom Anda akan di-reset.')) {
      const defaultData = resetToDefaultData();
      onDataReload(defaultData);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-slate-200/90 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Purpose Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-spidey-blue border-2 border-spidey-blue-dark shadow-[0_3px_0_0_#1E40AF] flex items-center justify-center text-yellow-300 flex-shrink-0">
            <Target className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xl font-extrabold tracking-tight text-spidey-ink">
                MagangHub<span className="text-spidey-blue">.Tracker</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Radar dan pantauan pendaftaran magang mandiri
            </p>
          </div>
        </div>

        {/* View Switcher & Action CTA */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* View Mode Toggle (Solid Clay Switcher with High Contrast Dark Text) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border-2 border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
                viewMode === 'table'
                  ? 'bg-white text-spidey-ink border-2 border-spidey-blue shadow-[0_2px_0_0_#1D4ED8]'
                  : 'text-slate-600 hover:text-slate-900 border-2 border-transparent'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-150 ${
                viewMode === 'kanban'
                  ? 'bg-white text-spidey-ink border-2 border-spidey-blue shadow-[0_2px_0_0_#1D4ED8]'
                  : 'text-slate-600 hover:text-slate-900 border-2 border-transparent'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Backup / Export / Import Tools */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleExport}
              title="Download Cadangan JSON"
              className="clay-btn-secondary p-2 text-slate-700"
            >
              <Download className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={handleImportClick}
              title="Restore dari JSON"
              className="clay-btn-secondary p-2 text-slate-700"
            >
              <Upload className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              onClick={handleReset}
              title="Reset ke Sampel Awal"
              className="clay-btn-secondary p-2 text-slate-700 hover:text-spidey-red hover:border-spidey-red"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Primary CTA (Solid Web-Blue with High-Contrast Text) */}
          <button
            onClick={onOpenAddModal}
            className="clay-btn-primary flex items-center space-x-2 px-4 py-2 text-sm text-yellow-300"
          >
            <Plus className="w-4 h-4 stroke-[2.8]" />
            <span>Catat Lowongan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
