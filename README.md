# MagangHub Tracker 🎯

Aplikasi web minimalis untuk mencatat, memantau, dan mengelola daftar pendaftaran magang (khususnya ekosistem Maganghub dan informasi awal dari media sosial). Menggantikan tabel spreadsheet yang kaku dengan antarmuka **Kanban & Tabel** modern, Bento Summary strip, dan laci detail interaktif (*slide-over drawer*).

---

## ✨ Fitur Utama (MVP Scope)

### 1. Dual View Mode (Tabel & Kanban Board)
- **Table View:** Tampilan padat yang merangkum nama perusahaan, posisi, badge mode kerja (`WFO`, `Hybrid`, `WFH`), countdown sisa hari deadline, tahap saat ini, progress kelengkapan berkas (`3/5 Berkas`), dan aksi cepat.
- **Kanban View:** Papan visual dengan 5 kolom status (`Wishlist / Belum Daftar`, `Applied / Administrasi`, `Assessment / Tes`, `Interview`, `Offering / Rejected`). Mendukung *drag-and-drop* native HTML5 dan pemindah status cepat (*quick status switcher*).

### 2. Bento Top Bar (Summary Metrics Strip)
4 kartu ringkasan bergaya *tactile clay* dengan micro-indicator:
1. **Total Incaran:** Jumlah total perusahaan yang tersimpan.
2. **Deadline Terdekat:** Lowongan aktif dengan batas akhir pendaftaran $\le$ 3 hari.
3. **On-Going Process:** Jumlah lowongan yang berada pada tahap Assessment / Tes & Wawancara.
4. **Ready to Submit:** Lowongan yang seluruh persyaratan berkasnya sudah 100% lengkap.

### 3. Interactive Detail Drawer (Slide-over Panel)
Klik pada baris tabel atau kartu kanban untuk membuka laci detail di sisi kanan:
- **Header:** Nama perusahaan, posisi, badge mode kerja + kota, dan link sumber eksternal (MagangHub, LinkedIn, X, Instagram).
- **Alur Seleksi (Interactive Stepper):** Urutan tahapan seleksi spesifik per perusahaan dengan penanda tahap aktif (*current stage*), kemampuan menambah/menghapus tahap, dan mencentang tahap yang sudah selesai.
- **Requirements Checklist:** Daftar syarat dokumen dengan checklist interaktif dan kalkulasi *progress bar* persentase realtime.
- **Catatan Tambahan:** Area teks bebas dengan penyimpanan otomatis untuk catatan bocoran soal, kontak alumni/HR, atau sumber info.

### 4. Pencarian, Filter & Pengurutan
- **Pencarian Cepat:** Mencari berdasarkan nama perusahaan, posisi, atau kota penempatan.
- **Filter:** Filter berdasarkan Mode Kerja (`Semua`, `WFO`, `Hybrid`, `WFH`) dan Status Pendaftaran.
- **Pengurutan:** Urutkan berdasarkan **Deadline Terdekat** (default), Deadline Terjauh, atau Baru Ditambahkan.

### 5. Cadangan & Template Cepat
- **Template Sekali Klik:** Template bawaan untuk *MagangHub Kemnaker*, *BUMN / Instansi*, dan *Tech / Startup* saat mencatat lowongan baru.
- **Backup & Restore JSON:** Export dan import data secara lokal tanpa perlu registrasi atau database eksternal.
- **Penyimpanan Lokal:** Menggunakan browser `localStorage` sehingga data tersimpan aman dan privat di perangkat Anda.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) dengan palet *tactile clay* & *Plus Jakarta Sans*
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage:** Browser `localStorage` + JSON Import/Export

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Instal dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan (dev server):**
   ```bash
   npm run dev
   ```

3. **Uji coba (Verification Check):**
   ```bash
   npm test
   ```

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

