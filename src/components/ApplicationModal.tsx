import React, { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { Application, WorkMode, MainStatus, SelectionStage, RequirementItem } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: Application) => void;
  initialData?: Application | null;
}

const TEMPLATES = {
  maganghub: {
    label: 'MagangHub Kemnaker',
    stages: ['Administrasi MagangHub', 'Tes Logika & Kebangsaan', 'Wawancara User', 'Offering'],
    requirements: [
      'CV ATS Format Terbaru',
      'Transkrip Nilai Lengkap',
      'Surat Rekomendasi Fakultas / Dekan',
      'Surat SPTJM Bermaterai',
      'KTP & Kartu Mahasiswa',
    ],
  },
  bumn: {
    label: 'BUMN / Instansi',
    stages: ['Seleksi Berkas', 'Tes Kemampuan Dasar (TKD) & AKHLAK', 'Tes Bahasa Inggris', 'Wawancara & MCU'],
    requirements: [
      'Curriculum Vitae',
      'Transkrip Nilai (IPK min 3.00)',
      'Surat Keterangan Mahasiswa Aktif',
      'Surat Pengantar Kampus',
    ],
  },
  tech_startup: {
    label: 'Tech / Startup',
    stages: ['Resume Screening', 'Take-Home Coding/Design Test', 'Technical & Culture Interview', 'Offering'],
    requirements: [
      'CV 1 Halaman',
      'Portfolio Live Link (GitHub / Behance)',
      'Cover Letter Singkat',
    ],
  },
};

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [locationCity, setLocationCity] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [mainStatus, setMainStatus] = useState<MainStatus>('wishlist');
  const [notes, setNotes] = useState('');

  const [stages, setStages] = useState<string[]>(['CV Screening', 'Interview User']);
  const [newStageInput, setNewStageInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([
    'CV ATS',
    'Transkrip Nilai',
    'Surat Pengantar Kampus',
  ]);
  const [newReqInput, setNewReqInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName);
      setPosition(initialData.position);
      setWorkMode(initialData.workMode);
      setLocationCity(initialData.locationCity);
      setSourceUrl(initialData.sourceUrl || '');
      setDeadlineDate(initialData.deadlineDate);
      setMainStatus(initialData.mainStatus);
      setNotes(initialData.notes || '');
      setStages(initialData.selectionStages.map((s) => s.name));
      setRequirements(initialData.requirements.map((r) => r.label));
    } else {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const defaultDeadline = future.toISOString().split('T')[0];

      setCompanyName('');
      setPosition('');
      setWorkMode('Hybrid');
      setLocationCity('Jakarta');
      setSourceUrl('');
      setDeadlineDate(defaultDeadline);
      setMainStatus('wishlist');
      setNotes('');
      setStages(['Administrasi MagangHub', 'Tes Online', 'Wawancara User', 'Offering']);
      setRequirements(['CV ATS', 'Transkrip Nilai', 'Surat Rekomendasi Kampus']);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const tpl = TEMPLATES[key];
    setStages(tpl.stages);
    setRequirements(tpl.requirements);
  };

  const handleAddStage = () => {
    if (newStageInput.trim()) {
      setStages([...stages, newStageInput.trim()]);
      setNewStageInput('');
    }
  };

  const handleRemoveStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    if (newReqInput.trim()) {
      setRequirements([...requirements, newReqInput.trim()]);
      setNewReqInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim() || !deadlineDate) {
      alert('Mohon isi nama perusahaan, posisi, dan tanggal deadline.');
      return;
    }

    const now = new Date().toISOString();

    const formattedStages: SelectionStage[] = stages.map((name, idx) => {
      const existing = initialData?.selectionStages.find((s) => s.name === name);
      return {
        id: existing?.id || `stage-${Date.now()}-${idx}`,
        name,
        isCompleted: existing ? existing.isCompleted : false,
        isCurrent: existing ? existing.isCurrent : idx === 0,
      };
    });

    const formattedRequirements: RequirementItem[] = requirements.map((label, idx) => {
      const existing = initialData?.requirements.find((r) => r.label === label);
      return {
        id: existing?.id || `req-${Date.now()}-${idx}`,
        label,
        isCompleted: existing ? existing.isCompleted : false,
      };
    });

    const appToSave: Application = {
      id: initialData?.id || `app-${Date.now()}`,
      companyName: companyName.trim(),
      position: position.trim(),
      workMode,
      locationCity: locationCity.trim() || 'Jakarta',
      sourceUrl: sourceUrl.trim() || undefined,
      deadlineDate,
      mainStatus,
      selectionStages: formattedStages,
      requirements: formattedRequirements,
      notes: notes.trim() || undefined,
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
    };

    onSave(appToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop (Solid Dim, No Blur) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 transition-opacity animate-in fade-in"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b-2 border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-spidey-ink tracking-tight">
                {isEditing ? 'Ubah Informasi Lowongan' : 'Catat Lowongan Magang Baru'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isEditing
                  ? 'Perbarui detail tahapan, berkas, atau informasi perusahaan'
                  : 'Tambahkan target magang dari MagangHub, LinkedIn, X, atau IG'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="clay-btn-secondary p-2 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Quick Template Picker (for new entries) */}
            {!isEditing && (
              <div className="bg-spidey-blue-light/50 p-3.5 rounded-xl border-2 border-spidey-blue-border mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-spidey-blue-dark mb-2">
                  <Target className="w-4 h-4 text-spidey-blue stroke-[2.5]" />
                  <span>Isi Cepat Alur & Berkas dari Template:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((key) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => applyTemplate(key)}
                      className="clay-btn-secondary px-3 py-1 text-xs font-bold text-spidey-blue hover:text-spidey-blue-dark"
                    >
                      {TEMPLATES[key].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Row 1: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Nama Perusahaan <span className="text-spidey-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: PT Telkom Indonesia"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Posisi Magang <span className="text-spidey-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="misal: UI/UX Designer Intern"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
                />
              </div>
            </div>

            {/* Row 2: Work Mode & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Mode Kerja
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold cursor-pointer"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="WFO">WFO (Work From Office)</option>
                  <option value="WFH">WFH (Work From Home / Remote)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Kota / Wilayah Penempatan
                </label>
                <input
                  type="text"
                  placeholder="misal: Jakarta Selatan atau Bandung"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
                />
              </div>
            </div>

            {/* Row 3: Deadline & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Batas Akhir / Deadline <span className="text-spidey-red">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Status Saat Ini
                </label>
                <select
                  value={mainStatus}
                  onChange={(e) => setMainStatus(e.target.value as MainStatus)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold cursor-pointer"
                >
                  <option value="wishlist">Wishlist / Belum Daftar</option>
                  <option value="applied">Applied / Administrasi</option>
                  <option value="assessment">Assessment / Tes</option>
                  <option value="interview">Interview</option>
                  <option value="offering_rejected">Offering / Done</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Tautan Sumber (Web / LinkedIn / Instagram)
              </label>
              <input
                type="url"
                placeholder="https://maganghub.kemnaker.go.id/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
              />
            </div>

            {/* Stages Manager */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Alur Tahapan Seleksi
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {stages.map((stg, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border-2 border-slate-300"
                  >
                    <span>{stg}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(i)}
                      className="text-slate-400 hover:text-spidey-red"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah tahap baru..."
                  value={newStageInput}
                  onChange={(e) => setNewStageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStage();
                    }
                  }}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="clay-btn-secondary px-3 py-1.5 text-xs text-slate-700"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Requirements Manager */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Syarat / Berkas Dokumen
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {requirements.map((req, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border-2 border-emerald-300"
                  >
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(i)}
                      className="text-emerald-500 hover:text-spidey-red"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah syarat berkas..."
                  value={newReqInput}
                  onChange={(e) => setNewReqInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="clay-btn-secondary px-3 py-1.5 text-xs text-slate-700"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Catatan Awal
              </label>
              <textarea
                rows={2}
                placeholder="Catatan tambahan misal kontak alumni atau sumber info..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-spidey-blue font-medium"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="clay-btn-secondary px-4 py-2 text-xs text-slate-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="clay-btn-primary px-5 py-2 text-xs text-yellow-300 font-extrabold"
              >
                {isEditing ? 'Simpan Perubahan' : 'Tambahkan Lowongan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
