# Kenali Bakatmu — Web

Project React (Vite) yang menggabungkan tiga sesi tes jadi satu alur:

```
Sesi 1 (kepribadian) → Sesi 2 (mata pelajaran & fakultas) → Sesi 3 (gaya belajar) → Hasil Gabungan
```

## Struktur project

```
kenali-bakatmu/
├── index.html              # entry HTML yang dipakai Vite
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx             # mount React ke #root
    ├── App.jsx              # orchestrator: atur urutan sesi & simpan hasil
    └── sessions/
        ├── Sesi1Quiz.jsx
        ├── Sesi2Quiz.jsx
        └── Sesi3Quiz.jsx
```

Tiap file di `sessions/` tetap komponen mandiri (punya state & gaya visual
sendiri). `App.jsx` hanya mengatur kapan tiap sesi tampil, dan menangkap
hasilnya lewat prop `onComplete` yang sudah ditambahkan ke masing-masing
komponen:

```jsx
<Sesi1Quiz onComplete={(data) => { /* data = hasil sesi 1 */ }} />
<Sesi2Quiz onComplete={(data) => { /* data = hasil sesi 2 */ }} />
<Sesi3Quiz onComplete={(data) => { /* data = hasil sesi 3 */ }} />
```

Karena pola propnya sama, **menambah Sesi 4 nanti tinggal**:
1. Taruh file komponennya di `src/sessions/Sesi4xxx.jsx`, tambahkan prop `onComplete`.
2. Tambahkan `"sesi4"` ke array `STAGES` di `App.jsx`.
3. Tambahkan blok `{stage === "sesi4" && <Sesi4xxx onComplete={...} />}`.

## Menjalankan di komputer (development)

Butuh [Node.js](https://nodejs.org) versi 18 ke atas.

```bash
npm install
npm run dev
```

Lalu buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Build untuk hosting (production)

```bash
npm run build
```

Perintah ini menghasilkan folder `dist/` berisi file HTML/CSS/JS statis siap
upload ke hosting mana pun — tidak butuh Node.js lagi di sisi server.

## Cara hosting (pilih salah satu, semuanya gratis untuk mulai)

### 1. Vercel (paling gampang, otomatis dari GitHub)
1. Push folder ini ke repo GitHub.
2. Buka [vercel.com](https://vercel.com) → New Project → import repo tersebut.
3. Vercel otomatis mendeteksi Vite — biarkan setelan default, klik Deploy.
4. Setiap kali push ke GitHub, situs otomatis ter-update.

### 2. Netlify
1. Jalankan `npm run build` di komputer.
2. Buka [app.netlify.com/drop](https://app.netlify.com/drop) lalu seret folder `dist/` ke halaman itu.
3. Selesai — dapat link langsung. (Atau hubungkan repo GitHub untuk auto-deploy seperti Vercel.)

### 3. GitHub Pages
1. `npm run build`
2. Upload isi folder `dist/` ke branch `gh-pages`, atau pakai action seperti
   `peaceiris/actions-gh-pages` di GitHub Actions.
3. Aktifkan GitHub Pages di Settings → Pages, arahkan ke branch `gh-pages`.

### 4. Hosting biasa (cPanel / shared hosting)
1. `npm run build`
2. Upload **seluruh isi** folder `dist/` ke `public_html` (atau folder root web) lewat FTP/File Manager.

## Catatan

- Semua font di-load lewat Google Fonts (`@import` di dalam tiap komponen) —
  perlu koneksi internet saat web dibuka.
- Tidak ada backend/database; semua state (jawaban & skor) hanya tersimpan
  di memori browser selama sesi berlangsung. Kalau halaman di-refresh,
  progres tes akan reset.
- Ikon pakai [lucide-react](https://lucide.dev), grafik radar di Sesi 3 pakai
  [Recharts](https://recharts.org) — keduanya sudah didaftarkan di
  `package.json`.
