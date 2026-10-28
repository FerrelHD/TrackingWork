import React from 'react';
import { Application } from '../types';
import { calculateRemainingDays } from '../utils/date';
import { SpideyIcon } from './SpideyIcon';

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
        <div className="absolute right-3.5 top-3.5 opacity-20 group-hover:opacity-35 transition-opacity">
          <SpideyIcon className="w-8 h-8 spidey-icon-shadow" />
        </div>
        <b className="font-comic text-4xl sm:text-5xl block text-theme-blue tracking-wide">
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
            isSenseActive ? 'opacity-100 scale-110' : 'opacity-20 group-hover:opacity-35'
          }`}
        >
          <SpideyIcon
            className={`w-8 h-8 ${isSenseActive ? 'spidey-icon-urgent' : 'spidey-icon-shadow'}`}
          />
        </div>
        <b className="font-comic text-4xl sm:text-5xl block text-theme-red tracking-wide">
          {urgentDeadlines.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          Deadline Terdekat {isSenseActive && <span className="text-theme-red">&bull; Spider-Sense!</span>}
        </span>
      </div>

      {/* 3. On-Going Process */}
      <div className="spidey-clay p-5 relative overflow-hidden group">
        <div className="absolute right-3.5 top-3.5 opacity-20 group-hover:opacity-35 transition-opacity">
          <SpideyIcon className="w-8 h-8 spidey-icon-shadow" />
        </div>
        <b className="font-comic text-4xl sm:text-5xl block text-theme-blue tracking-wide">
          {ongoingProcess.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          On-Going Process
        </span>
      </div>

      {/* 4. Ready to Submit */}
      <div className="spidey-clay p-5 relative overflow-hidden group">
        <div className="absolute right-3.5 top-3.5 opacity-20 group-hover:opacity-35 transition-opacity">
          <SpideyIcon className="w-8 h-8 spidey-icon-shadow" />
        </div>
        <b className="font-comic text-4xl sm:text-5xl block text-theme-red tracking-wide">
          {readyToSubmit.length}
        </b>
        <span className="text-theme-mute text-xs sm:text-sm font-bold block mt-1">
          Ready to Submit
        </span>
      </div>
    </section>
  );
};
