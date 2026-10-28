import React, { useState } from 'react';
import { Application, MainStatus } from '../types';
import { calculateRemainingDays, formatRemainingDays } from '../utils/date';

interface KanbanViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onUpdateStatus: (id: string, newStatus: MainStatus) => void;
}

interface ColumnConfig {
  id: MainStatus;
  title: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'wishlist', title: 'Wishlist' },
  { id: 'applied', title: 'Applied' },
  { id: 'assessment', title: 'Assessment' },
  { id: 'interview', title: 'Interview' },
  { id: 'offering_rejected', title: 'Offering / Rejected' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
}) => {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<MainStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent, colId: MainStatus) => {
    e.preventDefault();
    if (activeDropColumn !== colId) {
      setActiveDropColumn(colId);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: MainStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (id) {
      onUpdateStatus(id, targetStatus);
    }
    setDraggedAppId(null);
    setActiveDropColumn(null);
  };

  const renderDeadlineBadge = (app: Application) => {
    if (app.mainStatus === 'offering_rejected') {
      return <span className="spidey-badge">Selesai</span>;
    }
    const days = calculateRemainingDays(app.deadlineDate);
    const countdown = formatRemainingDays(days);

    if (countdown.status === 'expired') {
      return <span className="spidey-badge line-through text-theme-mute">Lewat</span>;
    }
    if (countdown.status === 'urgent') {
      const label = days === 0 ? 'Hari ini' : `H-${days}`;
      return (
        <span className="spidey-badge spidey-badge-urgent font-extrabold">
          {label}
        </span>
      );
    }
    return <span className="spidey-badge text-theme-blue">{days} hari lagi</span>;
  };

  const getWorkModeClass = (mode: string) => {
    switch (mode) {
      case 'WFO':
        return 'text-theme-blue';
      case 'Hybrid':
        return 'text-[#8A35C8]';
      case 'WFH':
        return 'text-[#0F8A6A]';
      default:
        return 'text-theme-mute';
    }
  };

  return (
    <div className="flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
      {COLUMNS.map((column) => {
        const columnApps = applications.filter((app) => app.mainStatus === column.id);
        const isTarget = activeDropColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`spidey-clay p-3.5 min-h-[300px] flex flex-col transition-all w-[84vw] sm:w-[320px] lg:w-auto shrink-0 lg:shrink snap-center ${
              isTarget ? 'outline-3 outline-dashed outline-theme-red -outline-offset-4' : ''
            }`}
          >
            {/* Column Header */}
            <h3 className="font-comic text-2xl tracking-wide text-theme-ink m-1 mb-3 flex justify-between items-center">
              <span>{column.title}</span>
              <span className="spidey-badge text-xs font-bold">{columnApps.length}</span>
            </h3>

            {/* Cards Container */}
            <div className="flex flex-col gap-3 flex-1">
              {columnApps.map((app) => {
                const totalReq = app.requirements?.length || 0;
                const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
                const isFull = totalReq > 0 && completedReq === totalReq;
                const isDragging = draggedAppId === app.id;

                return (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => onSelectApplication(app)}
                    className={`spidey-card p-3.5 cursor-grab active:cursor-grabbing select-none ${
                      isDragging ? 'opacity-40 scale-95' : ''
                    }`}
                  >
                    <b className="text-theme-ink font-bold block text-sm">{app.companyName}</b>
                    <small className="text-theme-mute font-semibold block text-xs mt-0.5">
                      {app.position}
                    </small>

                    {/* Badges */}
                    <div className="flex gap-1.5 flex-wrap my-2.5">
                      <span className={`spidey-badge ${getWorkModeClass(app.workMode)}`}>
                        {app.workMode}
                      </span>
                      {renderDeadlineBadge(app)}
                    </div>

                    {/* Progress Bar */}
                    <div className="spidey-progress w-full mb-2">
                      <div
                        className={`spidey-progress-bar ${isFull ? 'spidey-progress-bar-full' : ''}`}
                        style={{
                          width: `${totalReq === 0 ? 0 : (completedReq / totalReq) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Footer Row: Progress & Quick Changer */}
                    <div
                      className="flex justify-between items-center gap-1.5 pt-1 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <small className="text-theme-mute font-bold">
                        {completedReq}/{totalReq} Berkas
                      </small>
                      <select
                        value={app.mainStatus}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as MainStatus)}
                        aria-label="Pindah status"
                        className="font-extrabold text-[11px] border-0 rounded-lg px-2 py-1 bg-theme-card text-theme-ink max-w-[125px] cursor-pointer outline-none"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}

              {columnApps.length === 0 && (
                <div className="text-theme-mute text-center p-6 text-xs font-semibold my-auto">
                  Tarik kartu ke sini
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
