import React from 'react';
import { 
  Building2, 
  MapPin, 
  ExternalLink, 
  Clock, 
  CheckSquare, 
  ChevronRight, 
  Trash2,
  Edit2
} from 'lucide-react';
import { Application, MainStatus } from '../types';
import { calculateRemainingDays, formatRemainingDays, formatDisplayDate } from '../utils/date';

interface TableViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (id: string) => void;
  onOpenAddModal?: () => void;
}

export const TableView: React.FC<TableViewProps> = ({
  applications,
  onSelectApplication,
  onEditApplication,
  onDeleteApplication,
  onOpenAddModal,
}) => {
  const getStatusBadge = (status: MainStatus) => {
    switch (status) {
      case 'wishlist':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border-2 border-slate-300">
            Belum Daftar
          </span>
        );
      case 'applied':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border-2 border-blue-200">
            Administrasi
          </span>
        );
      case 'assessment':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border-2 border-amber-300">
            Assessment / Tes
          </span>
        );
      case 'interview':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border-2 border-purple-200">
            Interview
          </span>
        );
      case 'offering_rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border-2 border-emerald-300">
            Offering / Done
          </span>
        );
      default:
        return null;
    }
  };

  const getWorkModeBadge = (mode: string) => {
    switch (mode) {
      case 'WFO':
        return 'bg-amber-50 text-amber-800 border-2 border-amber-200';
      case 'Hybrid':
        return 'bg-spidey-blue-light text-spidey-blue-dark border-2 border-spidey-blue-border';
      case 'WFH':
        return 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-2 border-slate-200';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center shadow-[0_4px_0_0_#CBD5E1]">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.8]" />
        <h3 className="text-base font-bold text-slate-800">
          Belum ada lowongan yang dicatat
        </h3>
        <p className="text-sm text-slate-500 font-medium mt-1 max-w-sm mx-auto">
          Mulai pantau target magang Anda dari MagangHub, LinkedIn, atau media sosial.
        </p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="clay-btn-primary mt-4 inline-flex items-center space-x-2 px-4 py-2 text-xs text-yellow-300 font-extrabold"
          >
            <span>+ Catat Lowongan Pertama</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 px-4 sm:px-6">Perusahaan & Posisi</th>
              <th className="py-3.5 px-4">Mode & Lokasi</th>
              <th className="py-3.5 px-4">Deadline & Countdown</th>
              <th className="py-3.5 px-4">Status & Tahap Saat Ini</th>
              <th className="py-3.5 px-4">Berkas (Req)</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-100 text-sm">
            {applications.map((app) => {
              const remainingDays = calculateRemainingDays(app.deadlineDate);
              const countdown = formatRemainingDays(remainingDays);
              const totalReq = app.requirements?.length || 0;
              const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
              const currentStage = app.selectionStages?.find((s) => s.isCurrent)?.name || '-';

              return (
                <tr
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="group hover:bg-spidey-blue-light/50 cursor-pointer transition-colors"
                >
                  {/* 1. Perusahaan & Posisi */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-300 shadow-[0_2px_0_0_#CBD5E1] text-spidey-ink flex items-center justify-center font-extrabold text-sm flex-shrink-0 group-hover:border-spidey-blue group-hover:text-spidey-blue transition-colors">
                        {app.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 group-hover:text-spidey-blue transition-colors flex items-center gap-1.5">
                          <span className="truncate">{app.companyName}</span>
                          {app.sourceUrl && (
                            <a
                              href={app.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-spidey-blue p-0.5 inline-flex"
                              title="Buka Link Sumber"
                            >
                              <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                          {app.position}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Mode & Lokasi */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-lg ${getWorkModeBadge(
                          app.workMode
                        )}`}
                      >
                        {app.workMode}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 stroke-[2.2]" />
                        {app.locationCity}
                      </span>
                    </div>
                  </td>

                  {/* 3. Deadline & Countdown */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">
                        {formatDisplayDate(app.deadlineDate)}
                      </span>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${
                          countdown.status === 'urgent'
                            ? 'text-spidey-red'
                            : countdown.status === 'warning'
                            ? 'text-spidey-amber'
                            : countdown.status === 'expired'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-600'
                        }`}
                      >
                        <Clock className="w-3 h-3 stroke-[2.2]" />
                        {countdown.text}
                      </span>
                    </div>
                  </td>

                  {/* 4. Status & Tahap Saat Ini */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(app.mainStatus)}
                      <span className="text-xs text-slate-600 font-semibold max-w-[140px] truncate" title={currentStage}>
                        Tahap: <span className="text-spidey-ink font-bold">{currentStage}</span>
                      </span>
                    </div>
                  </td>

                  {/* 5. Progress Requirements */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span className="flex items-center gap-1 text-[11px]">
                          <CheckSquare className="w-3 h-3 text-slate-500 stroke-[2.2]" />
                          Berkas
                        </span>
                        <span className={`text-[11px] ${
                          totalReq > 0 && completedReq === totalReq ? 'text-emerald-700' : 'text-slate-800'
                        }`}>
                          {completedReq}/{totalReq}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
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
                  </td>

                  {/* 6. Aksi & Arrow */}
                  <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onEditApplication(app)}
                        className="clay-btn-secondary p-1.5 text-slate-600 hover:text-spidey-blue"
                        title="Edit Info Cepat"
                      >
                        <Edit2 className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus lowongan ${app.companyName}?`)) {
                            onDeleteApplication(app.id);
                          }
                        }}
                        className="clay-btn-secondary p-1.5 text-slate-600 hover:text-spidey-red hover:border-spidey-red"
                        title="Hapus Lowongan"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="clay-btn-secondary p-1.5 text-slate-600 group-hover:text-spidey-blue group-hover:border-spidey-blue"
                        title="Buka Laci Detail"
                      >
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
