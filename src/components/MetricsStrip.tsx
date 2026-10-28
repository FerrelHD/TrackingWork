import React from 'react';
import { Briefcase, Clock, Activity, FileCheck } from 'lucide-react';
import { Application } from '../types';
import { calculateRemainingDays } from '../utils/date';

interface MetricsStripProps {
  applications: Application[];
}

export const MetricsStrip: React.FC<MetricsStripProps> = ({ applications }) => {
  // 1. Total Incaran
  const totalCount = applications.length;

  // 2. Deadline Terdekat (deadline <= 3 hari dan belum expired atau completed)
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

  const isSenseActive = urgentDeadlines.length > 0;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {/* 1. Total Incaran */}
      <div className="spidey-clay p-5 relative overflow-hidden group">
        <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-40 text-theme-blue transition-opacity">
          <Briefcase className="w-8 h-8 stroke-[2.2]" />
        </div>
        <b className="font-extrabold text-3xl sm:text-4xl block text-theme-blue tracking-tight">
          {totalCount}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          Total Incaran
        </span>
      </div>

      {/* 2. Deadline Terdekat (With Spider-Sense Pulse if urgent) */}
      <div
        className={`spidey-clay p-5 relative overflow-hidden group ${
          isSenseActive ? 'spider-sense' : ''
        }`}
      >
        <div
          className={`absolute right-3.5 top-3.5 transition-all ${
            isSenseActive
              ? 'opacity-100 scale-110 text-theme-red'
              : 'opacity-25 group-hover:opacity-40 text-theme-mute'
          }`}
        >
          <Clock className="w-8 h-8 stroke-[2.2]" />
        </div>
        <b className="font-extrabold text-3xl sm:text-4xl block text-theme-red tracking-tight">
          {urgentDeadlines.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          Deadline Terdekat {isSenseActive && <span className="text-theme-red">&bull; Spider-Sense!</span>}
        </span>
      </div>

      {/* 3. On-Going Process */}
      <div className="spidey-clay p-5 relative overflow-hidden group">
        <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-40 text-theme-blue transition-opacity">
          <Activity className="w-8 h-8 stroke-[2.2]" />
        </div>
        <b className="font-extrabold text-3xl sm:text-4xl block text-theme-blue tracking-tight">
          {ongoingProcess.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          On-Going Process
        </span>
      </div>

      {/* 4. Ready to Submit */}
      <div className="spidey-clay p-5 relative overflow-hidden group">
        <div className="absolute right-3.5 top-3.5 opacity-25 group-hover:opacity-40 text-theme-red transition-opacity">
          <FileCheck className="w-8 h-8 stroke-[2.2]" />
        </div>
        <b className="font-extrabold text-3xl sm:text-4xl block text-theme-red tracking-tight">
          {readyToSubmit.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          Ready to Submit
        </span>
      </div>
    </section>
  );
};
