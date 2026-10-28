import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckSquare, 
  MoveRight
} from 'lucide-react';
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
  dotColor: string;
  badgeBg: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'wishlist',
    title: 'Wishlist / Belum Daftar',
    dotColor: 'bg-slate-400',
    badgeBg: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'applied',
    title: 'Applied / Administrasi',
    dotColor: 'bg-blue-500',
    badgeBg: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'assessment',
    title: 'Assessment / Tes',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'interview',
    title: 'Interview',
    dotColor: 'bg-purple-500',
    badgeBg: 'bg-purple-50 text-purple-700',
  },
  {
    id: 'offering_rejected',
    title: 'Offering / Rejected',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700',
  },
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start pb-8">
      {COLUMNS.map((column) => {
        const columnApps = applications.filter((app) => app.mainStatus === column.id);
        const isTarget = activeDropColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col bg-slate-100/70 rounded-2xl p-3 border transition-colors min-h-[480px] ${
              isTarget
                ? 'border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-400/20'
                : 'border-slate-200/70'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                <h3 className="text-xs font-bold text-slate-800 tracking-tight">
                  {column.title}
                </h3>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${column.badgeBg}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col space-y-2.5 flex-1">
              {columnApps.map((app) => {
                const remainingDays = calculateRemainingDays(app.deadlineDate);
                const countdown = formatRemainingDays(remainingDays);
                const totalReq = app.requirements?.length || 0;
                const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
                const isDragging = draggedAppId === app.id;

                return (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => onSelectApplication(app)}
                    className={`clay-surface-interactive rounded-xl p-3.5 cursor-grab active:cursor-grabbing relative select-none ${
                      isDragging ? 'opacity-40 scale-95 border-dashed border-indigo-400' : ''
                    }`}
                  >
                    {/* Header: Company & Work Mode */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                        {app.companyName}
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 flex-shrink-0">
                        {app.workMode}
                      </span>
                    </div>

                    {/* Position */}
                    <div className="text-xs text-slate-600 font-medium line-clamp-1 mb-2.5">
                      {app.position}
                    </div>

                    {/* Metadata: Location & Countdown */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-1 truncate max-w-[120px]">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{app.locationCity}</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 font-semibold ${
                          countdown.status === 'urgent'
                            ? 'text-rose-600'
                            : countdown.status === 'warning'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{countdown.text}</span>
                      </div>
                    </div>

                    {/* Requirements Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          Berkas
                        </span>
                        <span className={`font-semibold ${
                          totalReq > 0 && completedReq === totalReq ? 'text-emerald-600' : 'text-slate-700'
                        }`}>
                          {completedReq}/{totalReq}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${
                            totalReq > 0 && completedReq === totalReq
                              ? 'bg-emerald-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{
                            width: `${totalReq === 0 ? 0 : (completedReq / totalReq) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Quick Move Status Selector */}
                    <div
                      className="flex items-center justify-between pt-2 border-t border-slate-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <MoveRight className="w-3 h-3" />
                        <span>Pindah:</span>
                      </div>
                      <select
                        value={app.mainStatus}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as MainStatus)}
                        aria-label={`Ubah status untuk ${app.companyName}`}
                        className="text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {COLUMNS.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.title.split('/')[0].trim()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}

              {columnApps.length === 0 && (
                <div className="border border-dashed border-slate-300/80 rounded-xl p-4 text-center text-xs text-slate-400 my-auto">
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
