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
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1,0_6px_12px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Incaran
          </span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-700 flex items-center justify-center">
            <Briefcase className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-spidey-ink tracking-tight">
            {totalCount}
          </span>
          <span className="text-xs text-slate-500 font-semibold">perusahaan</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 font-medium">
          Semua lowongan tersimpan di radar
        </div>
      </div>

      {/* 2. Deadline Terdekat (Solid Spider-Sense Amber / Red) */}
      <div className={`bg-white rounded-2xl p-4 sm:p-5 border-2 relative overflow-hidden ${
        urgentDeadlines.length > 0
          ? 'border-spidey-red shadow-[0_4px_0_0_#B91C1C,0_6px_12px_-2px_rgba(185,28,28,0.12)]'
          : 'border-slate-200 shadow-[0_4px_0_0_#CBD5E1,0_6px_12px_-2px_rgba(15,23,42,0.06)]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            urgentDeadlines.length > 0 ? 'text-spidey-red' : 'text-slate-600'
          }`}>
            Deadline Terdekat
          </span>
          <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center ${
            urgentDeadlines.length > 0
              ? 'bg-spidey-red-light border-spidey-red-border text-spidey-red'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            <AlertCircle className="w-4 h-4 stroke-[2.4]" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            urgentDeadlines.length > 0 ? 'text-spidey-red' : 'text-slate-800'
          }`}>
            {urgentDeadlines.length}
          </span>
          <span className={`text-xs font-semibold ${
            urgentDeadlines.length > 0 ? 'text-spidey-red' : 'text-slate-500'
          }`}>
            lowongan
          </span>
        </div>
        <div className={`mt-2 text-[11px] font-semibold ${
          urgentDeadlines.length > 0 ? 'text-spidey-red' : 'text-slate-500'
        }`}>
          Tenggat waktu &le; 3 hari ke depan
        </div>
      </div>

      {/* 3. On-Going Process (Solid Web-Blue) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-spidey-blue-border shadow-[0_4px_0_0_#93C5FD,0_6px_12px_-2px_rgba(29,78,216,0.08)] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-spidey-blue">
            On-Going Process
          </span>
          <div className="w-8 h-8 rounded-xl bg-spidey-blue-light border-2 border-spidey-blue-border text-spidey-blue flex items-center justify-center">
            <PlayCircle className="w-4 h-4 stroke-[2.4]" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-spidey-blue tracking-tight">
            {ongoingProcess.length}
          </span>
          <span className="text-xs text-spidey-blue font-semibold">tahap aktif</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 font-semibold">
          Assessment, tes online, atau interview
        </div>
      </div>

      {/* 4. Ready to Submit (Solid Emerald Clay) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-300 shadow-[0_4px_0_0_#86EFAC,0_6px_12px_-2px_rgba(16,185,129,0.08)] relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Ready to Submit
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
            {readyToSubmit.length}
          </span>
          <span className="text-xs text-emerald-700 font-semibold">siap kirim</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 font-semibold">
          Persyaratan berkas 100% lengkap
        </div>
      </div>
    </section>
  );
};
