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
}

export const TableView: React.FC<TableViewProps> = ({
  applications,
  onSelectApplication,
  onEditApplication,
  onDeleteApplication,
}) => {
  const getStatusBadge = (status: MainStatus) => {
    switch (status) {
      case 'wishlist':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Belum Daftar
          </span>
        );
      case 'applied':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Administrasi
          </span>
        );
      case 'assessment':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Assessment / Tes
          </span>
        );
      case 'interview':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            Interview
          </span>
        );
      case 'offering_rejected':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
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
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Hybrid':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'WFH':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          Tidak ada lowongan yang cocok
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Coba ubah kata kunci pencarian atau reset filter untuk melihat lowongan lain.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Perusahaan & Posisi</th>
              <th className="py-3.5 px-4">Mode & Lokasi</th>
              <th className="py-3.5 px-4">Deadline & Countdown</th>
              <th className="py-3.5 px-4">Status & Tahap Saat Ini</th>
              <th className="py-3.5 px-4">Berkas (Req)</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
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
                  className="group hover:bg-indigo-50/40 cursor-pointer transition-colors"
                >
                  {/* 1. Perusahaan & Posisi */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:border-indigo-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {app.companyName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          <span className="truncate">{app.companyName}</span>
                          {app.sourceUrl && (
                            <a
                              href={app.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-400 hover:text-indigo-600 p-0.5 inline-flex"
                              title="Buka Link Sumber"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                          {app.position}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Mode & Lokasi */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getWorkModeBadge(
                          app.workMode
                        )}`}
                      >
                        {app.workMode}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {app.locationCity}
                      </span>
                    </div>
                  </td>

                  {/* 3. Deadline & Countdown */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-700">
                        {formatDisplayDate(app.deadlineDate)}
                      </span>
                      <span
                        className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${
                          countdown.status === 'urgent'
                            ? 'text-rose-600'
                            : countdown.status === 'warning'
                            ? 'text-amber-600'
                            : countdown.status === 'expired'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-500'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {countdown.text}
                      </span>
                    </div>
                  </td>

                  {/* 4. Status & Tahap Saat Ini */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(app.mainStatus)}
                      <span className="text-xs text-slate-500 font-medium max-w-[140px] truncate" title={currentStage}>
                        Tahap: <span className="text-slate-800">{currentStage}</span>
                      </span>
                    </div>
                  </td>

                  {/* 5. Progress Requirements */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                        <span className="flex items-center gap-1 text-[11px]">
                          <CheckSquare className="w-3 h-3 text-slate-400" />
                          Berkas
                        </span>
                        <span className={`text-[11px] font-semibold ${
                          totalReq > 0 && completedReq === totalReq ? 'text-emerald-600' : 'text-slate-700'
                        }`}>
                          {completedReq}/{totalReq}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
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
                  </td>

                  {/* 6. Aksi & Arrow */}
                  <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onEditApplication(app)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Info Cepat"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus lowongan ${app.companyName}?`)) {
                            onDeleteApplication(app.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Lowongan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="p-1.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"
                        title="Buka Laci Detail"
                      >
                        <ChevronRight className="w-4 h-4" />
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
