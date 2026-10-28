import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
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

  const [stages, setStages] = useState<string[]>(['Seleksi Administrasi', 'Online Test', 'Interview']);
  const [newStageInput, setNewStageInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['CV ATS', 'Transkrip Nilai', 'Surat Rekomendasi']);
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
      setLocationCity('Jakarta Selatan');
      setSourceUrl('');
      setDeadlineDate(defaultDeadline);
      setMainStatus('wishlist');
      setNotes('');
      setStages(['Seleksi Administrasi', 'Online Test', 'Interview']);
      setRequirements(['CV ATS', 'Transkrip Nilai', 'Surat Rekomendasi']);
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
      alert('Mohon isi nama perusahaan, posisi, dan batas akhir pendaftaran.');
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
      locationCity: locationCity.trim() || '-',
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
    <div className="fixed inset-0 z-50 overflow-y-auto grid place-items-center p-4">
      {/* Scrim Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#080c28]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Clay Modal Form */}
      <div className="relative w-full max-w-[560px] spidey-clay p-6 sm:p-7 max-h-[92vh] overflow-y-auto z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-extrabold text-2xl sm:text-3xl text-theme-ink tracking-tight leading-tight">
              {isEditing ? 'Ubah lowongan' : 'Tambah lowongan'}
            </h2>
            <div className="text-theme-mute text-xs font-bold mt-1">
              Catat info lowongan incaranmu dari MagangHub, LinkedIn, atau sosmed.
            </div>
          </div>
          <button onClick={onClose} className="spidey-btn p-1.5 text-theme-mute hover:text-theme-ink">
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Templates Picker (for quick populate) */}
        {!isEditing && (
          <div className="spidey-press p-3 rounded-2xl mb-4">
            <div className="text-xs font-extrabold text-theme-blue flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi Cepat Alur & Berkas dari Template:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(TEMPLATES) as Array<keyof typeof TEMPLATES>).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => applyTemplate(key)}
                  className="spidey-btn px-2.5 py-1 text-xs font-bold text-theme-ink hover:text-theme-blue"
                >
                  {TEMPLATES[key].label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-theme-mute font-bold mb-1.5">
              Perusahaan <span className="text-theme-red">*</span>
            </label>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="misal: Tokopedia, Telkom, Shopee"
              className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block text-theme-mute font-bold mb-1.5">
              Posisi <span className="text-theme-red">*</span>
            </label>
            <input
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="misal: Frontend Engineer Intern"
              className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-mute font-bold mb-1.5">Kota</label>
              <input
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="Jakarta Selatan"
                className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-theme-mute font-bold mb-1.5">Mode kerja</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="WFO">WFO</option>
                <option value="WFH">WFH</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-theme-mute font-bold mb-1.5">
                Deadline <span className="text-theme-red">*</span>
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-theme-mute font-bold mb-1.5">Status awal</label>
              <select
                value={mainStatus}
                onChange={(e) => setMainStatus(e.target.value as MainStatus)}
                className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none cursor-pointer"
              >
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offering_rejected">Offering / Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-theme-mute font-bold mb-1.5">Link sumber</label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className="spidey-press w-full text-theme-ink font-bold text-sm px-3.5 py-2.5 outline-none"
            />
          </div>

          {/* Stages List */}
          <div>
            <label className="block text-theme-mute font-bold mb-1.5">Alur tahapan seleksi</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {stages.map((stg, i) => (
                <span
                  key={i}
                  className="spidey-badge flex items-center gap-1.5 text-theme-ink font-bold py-1 px-2.5"
                >
                  <span>{stg}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStage(i)}
                    className="text-theme-mute hover:text-theme-red"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
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
                className="spidey-press flex-1 text-xs px-3 py-2 text-theme-ink font-bold outline-none"
              />
              <button
                type="button"
                onClick={handleAddStage}
                className="spidey-btn px-3 py-1 text-xs font-bold"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Requirements List */}
          <div>
            <label className="block text-theme-mute font-bold mb-1.5">Syarat berkas dokumen</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {requirements.map((req, i) => (
                <span
                  key={i}
                  className="spidey-badge flex items-center gap-1.5 text-theme-blue font-bold py-1 px-2.5"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(i)}
                    className="text-theme-mute hover:text-theme-red"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tambah berkas (misal: Portofolio)..."
                value={newReqInput}
                onChange={(e) => setNewReqInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                className="spidey-press flex-1 text-xs px-3 py-2 text-theme-ink font-bold outline-none"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                className="spidey-btn px-3 py-1 text-xs font-bold"
              >
                Tambah
              </button>
            </div>
          </div>

          <div>
            <label className="block text-theme-mute font-bold mb-1.5">Catatan tambahan</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kontak HR, bocoran materi soal, dll..."
              className="spidey-press w-full text-theme-ink font-bold text-xs p-3 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="spidey-btn px-4 py-2.5 text-xs font-bold text-theme-mute hover:text-theme-ink"
            >
              Batal
            </button>
            <button
              type="submit"
              className="spidey-btn spidey-btn-red px-6 py-2.5 text-xs font-extrabold"
            >
              {isEditing ? 'Simpan perubahan' : 'Simpan lowongan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
