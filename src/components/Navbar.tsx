import React, { useRef } from 'react';
import { 
  Plus, 
  LayoutGrid, 
  Table as TableIcon, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles
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
          alert('Data berhasil di-restore dari backup!');
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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  MagangHub<span className="text-indigo-600">.</span>Tracker
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pantau proses pendaftaran magang tanpa ribet spreadsheet
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Action CTA */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* View Mode Toggle Pill */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          {/* Backup / Export / Import Tools */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleExport}
              title="Download Cadangan JSON"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleImportClick}
              title="Restore dari JSON"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/60 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Reset ke Sampel Awal"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Lowongan</span>
          </button>
        </div>
      </div>
    </header>
  );
};

