import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { Application, MainStatus, SelectionStage, RequirementItem } from '../types';
import { calculateRemainingDays, formatRemainingDays } from '../utils/date';

interface DetailDrawerProps {
  application: Application | null;
  onClose: () => void;
  onSave: (updated: Application) => void;
  onDelete: (id: string) => void;
}

const STAGES: Array<[MainStatus, string]> = [
  ['wishlist', 'Wishlist'],
  ['applied', 'Applied'],
  ['assessment', 'Assessment'],
  ['interview', 'Interview'],
  ['offering_rejected', 'Offering / Rejected'],
];

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  application,
  onClose,
  onSave,
  onDelete,
}) => {
  const [app, setApp] = useState<Application | null>(application);
  const [newStageName, setNewStageName] = useState('');
  const [showAddStage, setShowAddStage] = useState(false);
  const [newReqLabel, setNewReqLabel] = useState('');
  const [showAddReq, setShowAddReq] = useState(false);

  useEffect(() => {
    setApp(application);
  }, [application]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!app) return null;

  const totalReq = app.requirements?.length || 0;
  const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
  const isFull = totalReq > 0 && completedReq === totalReq;

  const days = calculateRemainingDays(app.deadlineDate);
  const countdown = formatRemainingDays(days);

  const handleStatusChange = (status: MainStatus) => {
    const updated = { ...app, mainStatus: status, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  // Stepper handlers
  const handleStepClick = (index: number) => {
    const updatedStages = app.selectionStages.map((s, j) => ({
      ...s,
      isCompleted: j < index,
      isCurrent: j === index,
    }));
    const updated = { ...app, selectionStages: updatedStages, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;
    const newStage: SelectionStage = {
      id: `stage-${Date.now()}`,
      name: newStageName.trim(),
      isCompleted: false,
      isCurrent: app.selectionStages.length === 0,
    };
    const updated = {
      ...app,
      selectionStages: [...app.selectionStages, newStage],
      updatedAt: new Date().toISOString(),
    };
    setApp(updated);
    onSave(updated);
    setNewStageName('');
    setShowAddStage(false);
  };

  const handleDeleteStage = (stageId: string) => {
    const updatedStages = app.selectionStages.filter((s) => s.id !== stageId);
    const updated = { ...app, selectionStages: updatedStages, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  // Requirements handlers
  const handleToggleRequirement = (index: number) => {
    const updatedReqs = [...app.requirements];
    updatedReqs[index] = {
      ...updatedReqs[index],
      isCompleted: !updatedReqs[index].isCompleted,
    };
    const updated = { ...app, requirements: updatedReqs, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqLabel.trim()) return;
    const newReq: RequirementItem = {
      id: `req-${Date.now()}`,
      label: newReqLabel.trim(),
      isCompleted: false,
    };
    const updated = {
      ...app,
      requirements: [...app.requirements, newReq],
      updatedAt: new Date().toISOString(),
    };
    setApp(updated);
    onSave(updated);
    setNewReqLabel('');
    setShowAddReq(false);
  };

  const handleDeleteRequirement = (reqId: string) => {
    const updatedReqs = app.requirements.filter((r) => r.id !== reqId);
    const updated = { ...app, requirements: updatedReqs, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  const handleNotesChange = (text: string) => {
    const updated = { ...app, notes: text, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto grid place-items-center p-4">
      {/* Scrim Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#080c28]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Centered Clay Modal */}
      <div
        className="relative w-full max-w-[580px] spidey-clay p-6 sm:p-7 max-h-[92vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-theme-ink tracking-tight leading-tight">
              {app.companyName}
            </h2>
            <div className="text-theme-ink font-bold text-sm mt-1">{app.position}</div>
          </div>
          <button onClick={onClose} className="spidey-btn px-3 py-1.5 text-xs font-extrabold flex-shrink-0">
            Tutup
          </button>
        </div>

        {/* Badges Bar */}
        <div className="mt-3 flex gap-2 flex-wrap items-center">
          <span className="spidey-badge font-extrabold text-theme-blue">{app.workMode}</span>
          <span className="spidey-badge">{app.locationCity}</span>
          {countdown.status === 'urgent' ? (
            <span className="spidey-badge spidey-badge-urgent font-extrabold">
              {days === 0 ? 'Hari ini' : `H-${days}`}
            </span>
          ) : (
            <span className="spidey-badge text-theme-blue">{days} hari lagi</span>
          )}

          {app.sourceUrl && (
            <a
              href={app.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="spidey-badge text-theme-blue inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ExternalLink className="w-3 h-3 stroke-[2.5]" />
              <span>Buka sumber</span>
            </a>
          )}
        </div>

        {/* Status Section */}
        <div className="mt-5">
          <h4 className="text-sm font-extrabold text-theme-ink mb-2">Status</h4>
          <select
            value={app.mainStatus}
            onChange={(e) => handleStatusChange(e.target.value as MainStatus)}
            aria-label="Status pendaftaran"
            className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
          >
            {STAGES.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Selection Flow Section (Interactive Stepper) */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="text-sm font-extrabold text-theme-ink m-0">Alur seleksi</h4>
            <button
              onClick={() => setShowAddStage(!showAddStage)}
              className="spidey-btn px-2.5 py-1 text-xs text-theme-blue font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Tambah</span>
            </button>
          </div>

          {showAddStage && (
            <form onSubmit={handleAddStage} className="mb-3 flex items-center gap-2">
              <input
                type="text"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                placeholder="Nama tahap (misal: Case Study)..."
                className="spidey-press flex-1 text-xs px-3 py-2 text-theme-ink font-bold outline-none"
                autoFocus
              />
              <button type="submit" className="spidey-btn spidey-btn-blue px-3 py-2 text-xs">
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowAddStage(false)}
                className="spidey-btn px-2 py-2 text-xs text-theme-mute"
              >
                Batal
              </button>
            </form>
          )}

          {app.selectionStages.length > 0 ? (
            <div className="space-y-2">
              {app.selectionStages.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => handleStepClick(i)}
                  className={`spidey-press flex gap-3 items-center p-2.5 rounded-2xl cursor-pointer transition-all group ${
                    s.isCurrent ? 'ring-2 ring-theme-red' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 grid place-items-center text-xs font-extrabold ${
                      s.isCurrent
                        ? 'bg-theme-red text-white'
                        : s.isCompleted
                        ? 'bg-theme-blue text-white'
                        : 'bg-theme-card text-theme-mute'
                    }`}
                  >
                    {s.isCompleted ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-theme-ink truncate">{s.name}</div>
                    {s.isCurrent && (
                      <small className="text-theme-red font-bold text-[11px] block">
                        Sedang berjalan
                      </small>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStage(s.id);
                    }}
                    className="p-1 text-theme-mute hover:text-theme-red opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus tahap"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>
              ))}
              <small className="text-theme-mute font-semibold block mt-1">
                Ketuk tahap untuk menandai yang sedang berjalan.
              </small>
            </div>
          ) : (
            <div className="text-theme-mute text-center p-4 text-xs font-semibold">
              Belum ada alur seleksi.
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-extrabold text-theme-ink m-0">
              Requirements{' '}
              <span className="text-theme-mute font-bold">
                {completedReq}/{totalReq}
              </span>
            </h4>
            <button
              onClick={() => setShowAddReq(!showAddReq)}
              className="spidey-btn px-2.5 py-1 text-xs text-theme-blue font-bold flex items-center gap-1"
            >
              <Plus className="w-3 h-3 stroke-[2.5]" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="spidey-progress w-full mb-3">
            <div
              className={`spidey-progress-bar ${isFull ? 'spidey-progress-bar-full' : ''}`}
              style={{
                width: `${totalReq === 0 ? 0 : (completedReq / totalReq) * 100}%`,
              }}
            />
          </div>

          {showAddReq && (
            <form onSubmit={handleAddRequirement} className="mb-3 flex items-center gap-2">
              <input
                type="text"
                value={newReqLabel}
                onChange={(e) => setNewReqLabel(e.target.value)}
                placeholder="Nama syarat berkas..."
                className="spidey-press flex-1 text-xs px-3 py-2 text-theme-ink font-bold outline-none"
                autoFocus
              />
              <button type="submit" className="spidey-btn spidey-btn-blue px-3 py-2 text-xs">
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowAddReq(false)}
                className="spidey-btn px-2 py-2 text-xs text-theme-mute"
              >
                Batal
              </button>
            </form>
          )}

          {app.requirements.length > 0 ? (
            <div className="space-y-1">
              {app.requirements.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-theme-bg/60 group"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={r.isCompleted}
                      onChange={() => handleToggleRequirement(i)}
                      className="spidey-press appearance-none w-5 h-5 rounded-lg flex-shrink-0 cursor-pointer checked:bg-theme-red"
                    />
                    <span
                      className={`text-xs font-bold truncate select-none ${
                        r.isCompleted ? 'text-theme-mute line-through' : 'text-theme-ink'
                      }`}
                    >
                      {r.label}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteRequirement(r.id)}
                    className="p-1 text-theme-mute hover:text-theme-red opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus berkas"
                  >
                    <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-theme-mute text-center p-4 text-xs font-semibold">
              Belum ada requirement.
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <h4 className="text-sm font-extrabold text-theme-ink mb-2">Catatan tambahan</h4>
          <textarea
            rows={4}
            value={app.notes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Bocoran soal, kontak HR, username sosmed sumber..."
            className="spidey-press w-full text-theme-ink font-bold text-xs p-3 outline-none resize-y"
          />
        </div>

        {/* Delete Application */}
        <div className="mt-7 pt-4 border-t border-theme-ink/10 flex justify-between items-center">
          <button
            onClick={() => {
              if (window.confirm(`Hapus lowongan ${app.companyName}?`)) {
                onDelete(app.id);
                onClose();
              }
            }}
            className="spidey-btn px-4 py-2 text-xs font-extrabold text-theme-red"
          >
            Hapus lowongan
          </button>

          <button
            onClick={onClose}
            className="spidey-btn px-5 py-2 text-xs font-extrabold text-theme-ink"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
