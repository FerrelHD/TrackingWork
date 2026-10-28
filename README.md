# MagangHub Tracker

Aplikasi web minimalis untuk mencatat, memantau, dan mengelola daftar pendaftaran magang (khususnya ekosistem Maganghub dan informasi awal dari media sosial). Menggantikan tabel spreadsheet yang kaku dengan antarmuka Dual View (Tabel & Kanban Board) bertema Spidey Claymorphism, Bento Summary strip, dan laci detail interaktif (*slide-over drawer*).

---

## Fitur Utama

### 1. Dual View Mode (Tabel & Kanban Board)
- **Table View:** Tampilan ringkasan padat yang merangkum nama perusahaan, posisi, badge mode kerja (`WFO`, `Hybrid`, `WFH`), countdown sisa hari deadline, tahap saat ini, progress kelengkapan berkas, dan aksi cepat.
- **Kanban View:** Papan visual dengan 5 kolom status (`Wishlist`, `Applied`, `Assessment`, `Interview`, `Offering / Rejected`). Mendukung *drag-and-drop* native HTML5, pemindah status cepat (*quick switcher*), dan navigasi *horizontal snap scroll* yang nyaman di perangkat mobile/tablet.

### 2. Bento Top Bar (Summary Metrics Strip)
4 kartu metrik bergaya tanah liat (*tactile clay*) dengan ikon kontekstual dan efek denyut *Spider-Sense*:
1. **Total Incaran:** Jumlah seluruh lowongan incaran yang tercatat.
2. **Deadline Terdekat:** Lowongan aktif dengan batas akhir pendaftaran <= 3 hari (berdenyut Spider-Sense saat mendekati batas akhir).
3. **On-Going Process:** Jumlah lowongan yang sedang berada pada tahap Assessment / Tes atau Interview.
4. **Ready to Submit:** Lowongan yang persyaratan berkasnya sudah 100% lengkap dan siap dikirim.

### 3. Interactive Detail Drawer (Slide-over Panel)
Klik pada baris tabel atau kartu kanban untuk membuka laci detail di sisi kanan:
- **Header:** Nama perusahaan, posisi, badge mode kerja + kota, dan link sumber eksternal.
- **Alur Seleksi (Interactive Stepper):** Urutan tahapan seleksi spesifik per perusahaan dengan penanda tahap aktif (*current stage*), kemampuan menambah/menghapus tahap, dan menandai tahap yang sudah selesai.
- **Requirements Checklist:** Daftar syarat dokumen dengan checklist interaktif dan kalkulasi persentase kelengkapan realtime.
- **Catatan Tambahan:** Area teks bebas untuk mencatat informasi kontak HR, kisi-kisi tes, atau catatan penting lainnya.

### 4. Pencarian, Filter & Pengurutan
- **Pencarian Cepat:** Mencari berdasarkan nama perusahaan, posisi, atau kota penempatan.
- **Filter Mode Kerja:** Filter berdasarkan `Semua`, `WFO`, `Hybrid`, atau `WFH`.
- **Filter Status:** Filter berdasarkan status tahapan lamaran.
- **Pengurutan:** Urutkan berdasarkan **Deadline Terdekat** (default), Deadline Terjauh, atau Baru Ditambahkan.

### 5. Cadangan & Template Cepat
- **Template Sekali Klik:** Template bawaan untuk *MagangHub Kemnaker*, *BUMN / Instansi*, dan *Tech / Startup*.
- **Backup & Restore JSON:** Export dan import data secara lokal tanpa perlu registrasi atau database eksternal.
- **Penyimpanan Lokal:** Menggunakan browser `localStorage` sehingga seluruh data tersimpan privat di perangkat Anda.

---

## Desain & Estetika (Spidey Claymorphism)

- **Tipografi:** Kombinasi font *Bangers* untuk judul komik dengan text-shadow merah keras dan *Nunito* untuk keterbacaan bodi teks antarmuka.
- **Sistem Bayangan:** Variabel CSS berlapis (`--shadow-raised`, `--shadow-pressed`, `--shadow-card`, `--shadow-btn`) yang menghasilkan efek permukaan tanah liat 3D timbul dan tertekan.
- **Mode Gelap & Terang:** Mendukung pergantian tema dengan bayangan pekat dan highlight biru-navy redup pada mode gelap.
- **Aksesibilitas:** Menghormati pengaturan `prefers-reduced-motion` untuk kenyamanan visual.

---

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Semantic Claymorphism CSS Variables
- **Icons:** Lucide React
- **Storage:** Browser `localStorage` + JSON Import/Export

---

## Menjalankan Proyek Secara Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/FerrelHD/TrackingWork.git
   cd TrackingWork
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Uji coba & verifikasi:**
   ```bash
   npm test
   ```

5. **Build untuk produksi:**
   ```bash
   npm run build
   ```
