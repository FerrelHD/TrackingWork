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
    badgeBg: 'bg-slate-100 text-slate-700 border-2 border-slate-200',
  },
  {
    id: 'applied',
    title: 'Applied / Administrasi',
    dotColor: 'bg-spidey-blue',
    badgeBg: 'bg-spidey-blue-light text-spidey-blue-dark border-2 border-spidey-blue-border',
  },
  {
    id: 'assessment',
    title: 'Assessment / Tes',
    dotColor: 'bg-spidey-amber',
    badgeBg: 'bg-spidey-amber-light text-spidey-amber border-2 border-spidey-amber-border',
  },
  {
    id: 'interview',
    title: 'Interview',
    dotColor: 'bg-purple-600',
    badgeBg: 'bg-purple-50 text-purple-800 border-2 border-purple-200',
  },
  {
    id: 'offering_rejected',
    title: 'Offering / Done',
    dotColor: 'bg-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200',
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
            className={`flex flex-col bg-white rounded-2xl p-3 border-2 transition-all min-h-[500px] shadow-[0_3px_0_0_#CBD5E1] ${
              isTarget
                ? 'border-spidey-blue bg-spidey-blue-light/30 shadow-[0_5px_0_0_#93C5FD]'
                : 'border-slate-300/90'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 py-2 mb-2 border-b-2 border-slate-100">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full border border-black/10 ${column.dotColor}`} />
                <h3 className="text-xs font-extrabold text-slate-800 tracking-tight">
                  {column.title}
                </h3>
              </div>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${column.badgeBg}`}>
                {columnApps.length}
              </span>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col space-y-3 flex-1">
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
                    className={`clay-interactive p-3.5 cursor-grab active:cursor-grabbing select-none relative ${
                      isDragging ? 'opacity-40 scale-95 border-dashed border-spidey-blue' : ''
                    }`}
                  >
                    {/* Header: Company & Work Mode */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="font-bold text-sm text-slate-900 group-hover:text-spidey-blue line-clamp-1">
                        {app.companyName}
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border-2 border-slate-200 flex-shrink-0">
                        {app.workMode}
                      </span>
                    </div>

                    {/* Position */}
                    <div className="text-xs text-slate-600 font-semibold line-clamp-1 mb-2.5">
                      {app.position}
                    </div>

                    {/* Metadata: Location & Countdown */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5 pt-2 border-t border-slate-150">
                      <div className="flex items-center space-x-1 truncate max-w-[120px] font-medium">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 stroke-[2.2]" />
                        <span className="truncate">{app.locationCity}</span>
                      </div>
                      <div
                        className={`flex items-center space-x-1 font-bold ${
                          countdown.status === 'urgent'
                            ? 'text-spidey-red'
                            : countdown.status === 'warning'
                            ? 'text-spidey-amber'
                            : 'text-slate-600'
                        }`}
                      >
                        <Clock className="w-3 h-3 stroke-[2.2]" />
                        <span>{countdown.text}</span>
                      </div>
                    </div>

                    {/* Requirements Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-slate-500 stroke-[2.2]" />
                          Berkas
                        </span>
                        <span className={totalReq > 0 && completedReq === totalReq ? 'text-emerald-700' : 'text-slate-800'}>
                          {completedReq}/{totalReq}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className={`h-full rounded-full transition-all duration-200 ${
                            totalReq > 0 && completedReq === totalReq
                              ? 'bg-emerald-600'
                              : 'bg-spidey-blue'
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
                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-bold">
                        <MoveRight className="w-3 h-3 stroke-[2.2]" />
                        <span>Pindah:</span>
                      </div>
                      <select
                        value={app.mainStatus}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as MainStatus)}
                        aria-label={`Ubah status untuk ${app.companyName}`}
                        className="text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-200 rounded-lg px-2 py-0.5 focus:outline-none focus:border-spidey-blue cursor-pointer"
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
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-400 font-semibold my-auto">
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
