import React from 'react';
import { Briefcase, AlertCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Application } from '../types';
import { calculateRemainingDays } from '../utils/date';

interface MetricsStripProps {
  applications: Application[];
  onFilterClick?: (filterType: string) => void;
}

export const MetricsStrip: React.FC<MetricsStripProps> = ({ applications }) => {
  // 1. Total Incaran
  const totalCount = applications.length;

  // 2. Deadline Terdekat (deadline <= 3 hari dan belum expired/lewat lama atau masih relevan)
  const urgentDeadlines = applications.filter((app) => {
    const days = calculateRemainingDays(app.deadlineDate);
    return days >= 0 && days <= 3 && app.mainStatus !== 'offering_rejected';
  });

  // 3. On-Going Process (Assessment / Tes atau Interview)
  const ongoingProcess = applications.filter(
    (app) => app.mainStatus === 'assessment' || app.mainStatus === 'interview'
  );

  // 4. Ready to Submit (Requirements 100% lengkap dan status wishlist/applied)
  const readyToSubmit = applications.filter((app) => {
    if (!app.requirements || app.requirements.length === 0) return false;
    return app.requirements.every((req) => req.isCompleted);
  });

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 my-6">
      {/* 1. Total Incaran */}
      <div className="clay-surface rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Incaran
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">perusahaan</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Semua lowongan tersimpan
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Deadline Terdekat */}
      <div className={`clay-surface rounded-2xl p-4 sm:p-5 relative overflow-hidden border ${
        urgentDeadlines.length > 0 ? 'border-amber-200/90' : 'border-slate-200/80'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Deadline Terdekat
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
            {urgentDeadlines.length}
          </span>
          <span className="text-xs text-amber-700/80 font-medium">lowongan</span>
        </div>
        <div className="mt-2 text-[11px] text-amber-700/80 font-medium">
          Tenggat waktu &le; 3 hari ke depan
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 3. On-Going Process */}
      <div className="clay-surface rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-indigo-200/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            On-Going Process
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <PlayCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
            {ongoingProcess.length}
          </span>
          <span className="text-xs text-indigo-700/80 font-medium">aktif</span>
        </div>
        <div className="mt-2 text-[11px] text-indigo-700/80 font-medium">
          Tahap Tes / Assessment & Wawancara
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4. Ready to Submit */}
      <div className="clay-surface rounded-2xl p-4 sm:p-5 relative overflow-hidden border border-emerald-200/70">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Ready to Submit
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
            {readyToSubmit.length}
          </span>
          <span className="text-xs text-emerald-700/80 font-medium">siap kirim</span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-700/80 font-medium">
          Berkas requirements sudah 100% lengkap
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>
    </section>
  );
};

