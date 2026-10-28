import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  FileText, 
  ListChecks, 
  GitCommit,
  Calendar
} from 'lucide-react';
import { Application, MainStatus, SelectionStage, RequirementItem } from '../types';
import { calculateRemainingDays, formatRemainingDays, formatDisplayDate } from '../utils/date';

interface DetailDrawerProps {
  application: Application | null;
  onClose: () => void;
  onSave: (updated: Application) => void;
  onDelete: (id: string) => void;
}

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!app) return null;

  const remainingDays = calculateRemainingDays(app.deadlineDate);
  const countdown = formatRemainingDays(remainingDays);
  const totalReq = app.requirements?.length || 0;
  const completedReq = app.requirements?.filter((r) => r.isCompleted).length || 0;
  const progressPercent = totalReq === 0 ? 0 : Math.round((completedReq / totalReq) * 100);

  // Status Updater
  const handleStatusChange = (status: MainStatus) => {
    const updated = { ...app, mainStatus: status, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  // Stepper handlers
  const handleSetCurrentStage = (stageId: string) => {
    const updatedStages = app.selectionStages.map((stage) => {
      if (stage.id === stageId) {
        return { ...stage, isCurrent: true };
      }
      return { ...stage, isCurrent: false };
    });
    const updated = { ...app, selectionStages: updatedStages, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  const handleToggleStageCompleted = (stageId: string) => {
    const updatedStages = app.selectionStages.map((stage) => {
      if (stage.id === stageId) {
        return { ...stage, isCompleted: !stage.isCompleted };
      }
      return stage;
    });
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
  const handleToggleRequirement = (reqId: string) => {
    const updatedReqs = app.requirements.map((req) => {
      if (req.id === reqId) {
        return { ...req, isCompleted: !req.isCompleted };
      }
      return req;
    });
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

  // Notes handler
  const handleNotesChange = (text: string) => {
    const updated = { ...app, notes: text, updatedAt: new Date().toISOString() };
    setApp(updated);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop (Solid Dim, No Blur) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l-4 border-slate-300 flex flex-col h-full transform transition-all ease-out duration-300">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b-2 border-slate-200 bg-slate-50">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-spidey-blue bg-spidey-blue-light border-2 border-spidey-blue-border px-2.5 py-0.5 rounded-lg">
                    {app.workMode}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                    {app.locationCity}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-spidey-ink tracking-tight leading-snug">
                  {app.companyName}
                </h2>
                <p className="text-sm font-bold text-slate-600 mt-0.5">
                  {app.position}
                </p>

                {app.sourceUrl && (
                  <div className="mt-2.5 flex items-center">
                    <a
                      href={app.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="clay-btn-secondary inline-flex items-center gap-1.5 text-xs px-3 py-1 text-spidey-blue hover:text-spidey-blue-dark"
                    >
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>Buka Tautan Sumber Lowongan</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="clay-btn-secondary p-2 text-slate-500 hover:text-slate-900"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Status Bar & Deadline */}
            <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t-2 border-slate-200">
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Status Saat Ini
                </span>
                <select
                  value={app.mainStatus}
                  onChange={(e) => handleStatusChange(e.target.value as MainStatus)}
                  aria-label="Status pendaftaran"
                  className="w-full text-xs font-bold bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-spidey-blue cursor-pointer shadow-2xs"
                >
                  <option value="wishlist">Wishlist / Belum Daftar</option>
                  <option value="applied">Applied / Administrasi</option>
                  <option value="assessment">Assessment / Tes</option>
                  <option value="interview">Interview</option>
                  <option value="offering_rejected">Offering / Done</option>
                </select>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                  Tenggat Pendaftaran
                </span>
                <div className="flex items-center justify-between bg-white border-2 border-slate-300 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 stroke-[2.2]" />
                    <span>{formatDisplayDate(app.deadlineDate)}</span>
                  </div>
                  <span
                    className={`font-extrabold flex items-center gap-1 ${
                      countdown.status === 'urgent'
                        ? 'text-spidey-red'
                        : countdown.status === 'warning'
                        ? 'text-spidey-amber'
                        : 'text-slate-600'
                    }`}
                  >
                    <Clock className="w-3 h-3 stroke-[2.2]" />
                    {countdown.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Body (Scrollable Content) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Section 1: Alur Seleksi (Interactive Stepper) */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-[0_3px_0_0_#CBD5E1]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-100">
                <div className="flex items-center space-x-2">
                  <GitCommit className="w-4 h-4 text-spidey-blue stroke-[2.5]" />
                  <h3 className="text-sm font-extrabold text-spidey-ink tracking-tight">
                    Alur Seleksi Perusahaan
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddStage(!showAddStage)}
                  className="clay-btn-secondary px-2.5 py-1 text-xs text-spidey-blue flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tambah Tahap</span>
                </button>
              </div>

              {/* Add Stage Inline Form */}
              {showAddStage && (
                <form onSubmit={handleAddStage} className="mb-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Nama tahap (misal: Case Study Interview)..."
                    className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-spidey-blue font-semibold"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="clay-btn-primary px-3 py-1.5 text-xs"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStage(false)}
                    className="clay-btn-secondary px-2 py-1.5 text-xs text-slate-600"
                  >
                    Batal
                  </button>
                </form>
              )}

              {/* Stepper List */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-slate-300">
                {app.selectionStages.map((stage, idx) => (
                  <div key={stage.id} className="relative group">
                    {/* Stepper Indicator Dot */}
                    <button
                      onClick={() => handleToggleStageCompleted(stage.id)}
                      className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        stage.isCompleted
                          ? 'bg-emerald-600 text-white shadow-[0_2px_0_0_#059669]'
                          : stage.isCurrent
                          ? 'bg-spidey-blue text-white ring-4 ring-spidey-blue-border shadow-[0_2px_0_0_#1E40AF]'
                          : 'bg-white border-2 border-slate-300 hover:border-slate-500'
                      }`}
                      title={stage.isCompleted ? 'Tahap ini selesai' : 'Klik untuk tandai selesai'}
                    >
                      {stage.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      ) : stage.isCurrent ? (
                        <Circle className="w-2.5 h-2.5 fill-current" />
                      ) : (
                        <span className="text-[10px] text-slate-600 font-extrabold">{idx + 1}</span>
                      )}
                    </button>

                    {/* Stage Details */}
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              stage.isCurrent
                                ? 'text-spidey-blue'
                                : stage.isCompleted
                                ? 'text-slate-500 line-through'
                                : 'text-slate-800'
                            }`}
                          >
                            {stage.name}
                          </span>
                          {stage.isCurrent && (
                            <span className="text-[10px] font-extrabold bg-spidey-blue-light text-spidey-blue-dark px-2 py-0.5 rounded-md border border-spidey-blue-border">
                              Tahap Aktif
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!stage.isCurrent && (
                          <button
                            onClick={() => handleSetCurrentStage(stage.id)}
                            className="clay-btn-secondary text-[11px] px-2 py-0.5 text-slate-700 hover:text-spidey-blue"
                          >
                            Jadikan Aktif
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteStage(stage.id)}
                          className="p-1 text-slate-400 hover:text-spidey-red rounded-lg"
                          title="Hapus tahap"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {app.selectionStages.length === 0 && (
                  <div className="text-xs text-slate-500 italic font-medium">
                    Belum ada alur tahapan seleksi. Tambahkan tahapan seleksi pertama di atas.
                  </div>
                )}
              </div>
            </section>

            {/* Section 2: Requirements Checklist */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-[0_3px_0_0_#CBD5E1]">
              <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-100">
                <div className="flex items-center space-x-2">
                  <ListChecks className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  <h3 className="text-sm font-extrabold text-spidey-ink tracking-tight">
                    Requirements Checklist
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddReq(!showAddReq)}
                  className="clay-btn-secondary px-2.5 py-1 text-xs text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tambah Syarat</span>
                </button>
              </div>

              {/* Progress Summary */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Kelengkapan Berkas</span>
                  <span className={progressPercent === 100 ? 'text-emerald-700' : 'text-slate-800'}>
                    {completedReq} dari {totalReq} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      progressPercent === 100 ? 'bg-emerald-600' : 'bg-spidey-blue'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {progressPercent === 100 && totalReq > 0 && (
                  <div className="mt-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border-2 border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 stroke-[2.5]" />
                    <span>Semua berkas siap. Anda dapat segera mengirimkan lamaran ini.</span>
                  </div>
                )}
              </div>

              {/* Add Requirement Inline Form */}
              {showAddReq && (
                <form onSubmit={handleAddRequirement} className="mb-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={newReqLabel}
                    onChange={(e) => setNewReqLabel(e.target.value)}
                    placeholder="Nama syarat dokumen (misal: Surat Pengantar Kampus)..."
                    className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 font-semibold"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="clay-btn-primary px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-700 shadow-[0_3px_0_0_#047857]"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddReq(false)}
                    className="clay-btn-secondary px-2 py-1.5 text-xs text-slate-600"
                  >
                    Batal
                  </button>
                </form>
              )}

              {/* Checklist Items */}
              <div className="space-y-2">
                {app.requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors group"
                  >
                    <label className="flex items-center space-x-2.5 flex-1 cursor-pointer min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={req.isCompleted}
                        onChange={() => handleToggleRequirement(req.id)}
                        className="w-4 h-4 rounded text-spidey-blue focus:ring-spidey-blue border-2 border-slate-300 cursor-pointer"
                      />
                      <span
                        className={`text-xs select-none truncate font-bold ${
                          req.isCompleted
                            ? 'line-through text-slate-400 font-normal'
                            : 'text-slate-800'
                        }`}
                      >
                        {req.label}
                      </span>
                    </label>

                    <button
                      onClick={() => handleDeleteRequirement(req.id)}
                      className="p-1 text-slate-400 hover:text-spidey-red rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus berkas"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                    </button>
                  </div>
                ))}

                {app.requirements.length === 0 && (
                  <div className="text-xs text-slate-500 italic font-medium">
                    Belum ada syarat berkas. Klik 'Tambah Syarat' di atas.
                  </div>
                )}
              </div>
            </section>

            {/* Section 3: Catatan Tambahan */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-[0_3px_0_0_#CBD5E1]">
              <div className="flex items-center space-x-2 mb-2 pb-1 border-b border-slate-100">
                <FileText className="w-4 h-4 text-spidey-blue stroke-[2.5]" />
                <h3 className="text-sm font-extrabold text-spidey-ink tracking-tight">
                  Catatan Tambahan
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold mb-2">
                Simpan kisi-kisi tes, kontak alumni/HR, atau catatan penting lainnya:
              </p>
              <textarea
                rows={4}
                value={app.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Tulis catatan di sini... otomatis tersimpan."
                className="w-full text-xs p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue text-slate-800 font-medium leading-relaxed"
              />
            </section>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 sm:p-5 border-t-2 border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                if (window.confirm(`Hapus lowongan ${app.companyName}?`)) {
                  onDelete(app.id);
                  onClose();
                }
              }}
              className="clay-btn-secondary flex items-center space-x-1.5 text-xs px-3 py-2 text-spidey-red hover:border-spidey-red"
            >
              <Trash2 className="w-4 h-4 stroke-[2.2]" />
              <span>Hapus Lowongan</span>
            </button>

            <button
              onClick={onClose}
              className="clay-btn-secondary px-5 py-2 text-xs font-bold text-slate-800"
            >
              Tutup Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
