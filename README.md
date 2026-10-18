# Helios Finance — Manajemen Keuangan Pribadi

Full-stack SPA (Single Page Application) untuk manajemen keuangan pribadi, dibangun mengikuti
spesifikasi `@promt.md` dan tata letak visual 100% mengacu pada referensi desain `@ref-ui.jpg`
(gaya "Helios Investments" — dark mode ultra-gelap dengan aksen dusty mauve / smoky plum).

## ✦ Teknologi

- **React 19 + Vite** — SPA modern dengan HMR
- **Tailwind CSS v4** — styling utility-first
- **Lucide React** — ikon
- **Recharts** — grafik area Arus Kas Bulanan
- **Supabase** (`@supabase/supabase-js`) — Auth email/password + database `transactions` + realtime

## ✦ Fitur

- **Login Email & Password** bertema gelap (via Supabase Auth)
- **CRUD transaksi real-time** pada tabel `transactions` (tambah lewat modal, hapus saat hover)
- **Total Saldo** dihitung otomatis dari pemasukan − pengeluaran
- **Transaksi Terakhir** dengan filter `Semua / Pemasukan / Pengeluaran` + pencarian real-time
- **Alokasi Anggaran 2×2** (Makan, Transport, Kebutuhan, Hiburan) dengan indikator sisa/lebih kuota
- **Grafik Arus Kas Bulanan** (Recharts AreaChart) dengan filter `1D 1W 1M 6M 1Y`,
  tooltip melayang, dot bercahaya, dan garis putus-putus saat hover
- **Fallback dummy data** otomatis bila database masih kosong, agar tampilan tetap hidup
- **Mode Demo** — tanpa konfigurasi Supabase, aplikasi tetap berjalan penuh dengan data lokal

## ✦ Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

### Menghubungkan Supabase (opsional — tanpa ini aplikasi jalan di Mode Demo)

1. Buat project gratis di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan seluruh isi file [`supabase/schema.sql`](supabase/schema.sql).
3. Salin `.env.example` menjadi `.env`, lalu isi:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxxxxxx
   ```
   (didapat dari **Project Settings → API**)
4. Restart `npm run dev`. Halaman login akan muncul; daftar akun baru lalu masuk.

## ✦ Struktur Project

```
├── index.html
├── vite.config.js
├── .env.example
├── supabase/
│   └── schema.sql          # tabel transactions + RLS + realtime
└── src/
    ├── App.jsx             # canvas + routing auth/dashboard
    ├── lib/
    │   ├── supabase.js     # klien Supabase & deteksi konfigurasi
    │   ├── constants.js    # kategori, dompet, kuota anggaran
    │   ├── stats.js        # agregasi total, anggaran, data grafik
    │   ├── dummy.js        # data contoh fallback
    │   └── format.js       # format Rupiah, persen, waktu
    ├── hooks/
    │   ├── useAuth.js
    │   └── useTransactions.js   # fetch + realtime + CRUD
    └── components/         # Sidebar, Header, kartu-kartu bento, modal, chart
```

## ✦ Palet Warna

| Peran | Hex |
| --- | --- |
| Canvas luar | `#0B090C` (ambient glow `#2A1829`) |
| Container | gradient `#1D171F` → `#120E14` |
| Sidebar / kartu | `#0E0C10` |
| Sub-kartu 2×2 | `#161219` |
| Teks utama | `#F4EFF6` |
| Teks highlight | `#C89BBF` |
| Teks sekunder | `#7A7080` |
| Positif | `#4E9F76` |
| Negatif | `#C95B68` |
| Aksen pill/glow | `#9E7698` / `#593E55` / `#A97C9E` |
