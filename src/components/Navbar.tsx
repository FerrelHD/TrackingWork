import React, { useRef } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';
import { Application } from '../types';
import { exportBackupJSON, resetToDefaultData, saveStoredApplications } from '../utils/storage';
import { SpideyIcon } from './SpideyIcon';

interface NavbarProps {
  onOpenAddModal: () => void;
  applications: Application[];
  onDataReload: (apps: Application[]) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  applications,
  onDataReload,
  theme,
  onToggleTheme,
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
    if (window.confirm('Kosongkan semua data lowongan dan mulai dari awal?')) {
      const defaultData = resetToDefaultData();
      onDataReload(defaultData);
    }
  };

  return (
    <header className="flex flex-wrap gap-3.5 items-center justify-between mb-5">
      {/* Brand & Purpose Title */}
      <div className="flex gap-3.5 items-center">
        {/* Spidey Mask Logo */}
        <div
          className="w-11 h-14 flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          title="MagangHub Tracker"
        >
          <SpideyIcon className="w-full h-full" />
        </div>

        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-theme-ink">
            MagangHub Tracker
          </h1>
          <div className="text-theme-mute text-xs sm:text-sm font-bold mt-1">
            Rapikan jaring lamaranmu, jangan ada deadline yang lolos.
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-2 items-center flex-wrap">
        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="spidey-btn px-3.5 py-2 text-xs flex items-center gap-1.5"
          title="Ganti Tema (Terang / Gelap)"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 stroke-[2.5]" />
              <span>Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-700 stroke-[2.5]" />
              <span>Gelap</span>
            </>
          )}
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExport}
          className="spidey-btn px-3.5 py-2 text-xs flex items-center gap-1.5"
          title="Download Cadangan JSON"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export JSON</span>
        </button>

        {/* Import JSON */}
        <button
          onClick={handleImportClick}
          className="spidey-btn px-3.5 py-2 text-xs flex items-center gap-1.5"
          title="Restore dari file JSON"
        >
          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Import JSON</span>
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="spidey-btn p-2 text-theme-mute hover:text-theme-red"
          title="Kosongkan data"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        {/* Add Application Button */}
        <button
          onClick={onOpenAddModal}
          className="spidey-btn spidey-btn-red px-5 py-2.5 text-sm font-extrabold flex items-center gap-1.5"
        >
          <span>+ Tambah lowongan</span>
        </button>
      </div>
    </header>
  );
};
