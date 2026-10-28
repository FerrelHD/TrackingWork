import React from 'react';
import { Application, MainStatus } from '../types';
import { calculateRemainingDays, formatRemainingDays } from '../utils/date';
import { SpideyIcon } from './SpideyIcon';

interface TableViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (id: string) => void;
  onOpenAddModal?: () => void;
}

const STAGE_NAMES: Record<MainStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  assessment: 'Assessment',
  interview: 'Interview',
  offering_rejected: 'Offering / Done',
};

export const TableView: React.FC<TableViewProps> = ({
  applications,
  onSelectApplication,
  onOpenAddModal,
}) => {
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

  if (applications.length === 0) {
    return (
      <div className="spidey-clay p-12 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
          <SpideyIcon className="w-full h-full" />
        </div>
        <h3 className="font-comic text-2xl sm:text-3xl text-theme-ink tracking-wide text-comic-shadow">
          Belum ada lowongan yang dicatat
        </h3>
        <p className="text-sm text-theme-mute font-bold mt-1 max-w-sm mx-auto">
          Mulai pasang jaring lamaranmu. Tambahkan lowongan magang incaran pertama sekarang.
        </p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="spidey-btn spidey-btn-red mt-5 px-5 py-2.5 text-xs font-extrabold"
          >
            <span>+ Catat Lowongan Pertama</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="spidey-clay py-2 px-1 sm:px-3 overflow-x-auto">
      <table className="w-full border-separate" style={{ borderSpacing: '0 10px' }}>
        <thead>
          <tr>
            <th className="text-left text-theme-mute text-xs font-extrabold px-3.5 py-1.5">
              Perusahaan
            </th>
            <th className="text-left text-theme-mute text-xs font-extrabold px-3.5 py-1.5">
              Lokasi
            </th>
            <th className="text-left text-theme-mute text-xs font-extrabold px-3.5 py-1.5">
              Deadline
            </th>
            <th className="text-left text-theme-mute text-xs font-extrabold px-3.5 py-1.5">
              Tahap saat ini
            </th>
            <th className="text-left text-theme-mute text-xs font-extrabold px-3.5 py-1.5">
              Berkas
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const totalReq = app.requirements?.length || 0;
            const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
            const currentStage = app.selectionStages?.find((s) => s.isCurrent)?.name || 'Belum mulai';
            const isFull = totalReq > 0 && completedReq === totalReq;

            return (
              <tr
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="group cursor-pointer transition-colors"
              >
                {/* 1. Perusahaan */}
                <td className="p-3.5 bg-theme-bg rounded-l-2xl group-hover:brightness-95 transition-all">
                  <b className="text-theme-ink font-bold block">{app.companyName}</b>
                  <small className="text-theme-mute font-semibold block mt-0.5">
                    {app.position}
                  </small>
                </td>

                {/* 2. Lokasi */}
                <td className="p-3.5 bg-theme-bg group-hover:brightness-95 transition-all whitespace-nowrap">
                  <span className={`spidey-badge ${getWorkModeClass(app.workMode)}`}>
                    {app.workMode}
                  </span>{' '}
                  <small className="text-theme-mute font-bold">{app.locationCity}</small>
                </td>

                {/* 3. Deadline */}
                <td className="p-3.5 bg-theme-bg group-hover:brightness-95 transition-all whitespace-nowrap">
                  {renderDeadlineBadge(app)}
                </td>

                {/* 4. Tahap saat ini */}
                <td className="p-3.5 bg-theme-bg group-hover:brightness-95 transition-all">
                  <small className="text-theme-mute font-bold block">
                    {STAGE_NAMES[app.mainStatus]}
                  </small>
                  <span className="text-theme-ink font-bold text-sm block mt-0.5">
                    {currentStage}
                  </span>
                </td>

                {/* 5. Berkas Progress */}
                <td className="p-3.5 bg-theme-bg rounded-r-2xl group-hover:brightness-95 transition-all whitespace-nowrap">
                  <div className="spidey-progress min-w-[80px] w-28 mb-1">
                    <div
                      className={`spidey-progress-bar ${isFull ? 'spidey-progress-bar-full' : ''}`}
                      style={{
                        width: `${totalReq === 0 ? 0 : (completedReq / totalReq) * 100}%`,
                      }}
                    />
                  </div>
                  <small className="text-theme-mute font-bold">
                    {completedReq}/{totalReq} Berkas
                  </small>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
