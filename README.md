# Fortune Solusindo — Next.js (migrasi dari PHP untuk Vercel)

Proyek ini adalah hasil migrasi penuh dari website PHP + MySQL kamu (Rumahweb) ke
**Next.js 14 (App Router)**, supaya bisa di-deploy di **Vercel** (Vercel tidak mendukung
PHP sebagai runtime, jadi seluruh logic sudah ditulis ulang dalam JavaScript/Next.js).

Semua fungsi dari versi PHP dipertahankan:
- Halaman publik (Hero, Tentang, Layanan, Program Servis, Ekspansi, Visi-Misi, Kontak, Berita)
- Dashboard admin untuk edit semua section + kelola berita
- Login admin
- Upload gambar

## 1. Struktur penting

```
app/                 → halaman & API routes (pengganti .php)
  page.jsx            → homepage (pengganti index.php)
  berita/              → list & detail artikel
  admin/               → login + dashboard admin
  api/                 → content, auth, upload (pengganti api/*.php)
lib/                  → koneksi DB, query helper, session
components/           → Navbar, Footer, komponen admin, dll
schema.sql            → skema database (SAMA PERSIS dengan yang kamu pakai sekarang)
public/images/         → gambar statis (logo, dll — hasil upload baru akan disimpan di Vercel Blob)
```

## 2. Database — WAJIB pakai MySQL yang bisa diakses dari internet

Vercel menjalankan kode sebagai serverless function, jadi database **harus MySQL yang
reachable dari internet** (bukan localhost). Rumahweb biasanya hanya mengizinkan koneksi
dari IP tertentu, jadi kamu perlu pindahkan database juga. Rekomendasi (semua kompatibel
langsung dengan `schema.sql`, tidak perlu ubah apa pun):

- **Railway** (MySQL) — termudah, ada free trial
- **Aiven for MySQL** — ada free tier
- **PlanetScale** — MySQL-compatible (Vitess), skala besar

Langkah:
1. Buat database MySQL baru di salah satu provider di atas.
2. Import `schema.sql` ke database tersebut (lewat phpMyAdmin/Adminer bawaan provider, atau `mysql -h HOST -u USER -p DBNAME < schema.sql`).
3. Kalau kamu ingin memindahkan **data yang sudah ada** (bukan cuma struktur kosong), export data dari database Rumahweb kamu sekarang (`mysqldump --no-create-info --skip-triggers namadb > data.sql` lewat phpMyAdmin "Export" juga bisa), lalu import ke database baru.
4. Catat host, port, nama db, user, password — ini akan jadi environment variables.

## 3. Environment Variables

Salin `.env.example` menjadi `.env.local` untuk development lokal, dan isi juga di
**Vercel → Project Settings → Environment Variables** untuk production:

| Variable | Keterangan |
|---|---|
| `DB_HOST` | Host MySQL kamu |
| `DB_PORT` | Biasanya 3306 |
| `DB_NAME` | Nama database |
| `DB_USER` | Username database |
| `DB_PASS` | Password database |
| `DB_SSL` | `true` jika provider mewajibkan SSL (Railway/PlanetScale/Aiven biasanya ya) |
| `SESSION_SECRET` | String acak panjang untuk sesi login admin. Generate: `openssl rand -base64 48` |
| `BLOB_READ_WRITE_TOKEN` | Token untuk upload gambar (lihat langkah 4) |

## 4. Setup upload gambar (Vercel Blob)

Karena Vercel tidak punya folder upload permanen seperti hosting PHP biasa, upload gambar
admin (hero, galeri, cover berita, dll) disimpan di **Vercel Blob** (storage bawaan Vercel).

1. Di dashboard Vercel: buka project → tab **Storage** → **Create Database** → pilih **Blob**.
2. Setelah dibuat, Vercel otomatis menambahkan `BLOB_READ_WRITE_TOKEN` ke environment
   variables project kamu — tidak perlu diisi manual di production.
3. Untuk development lokal, buka store tersebut → tab **.env.local** → salin tokennya ke
   file `.env.local` kamu.

Gambar lama yang sudah ada di folder `images/` (logo, foto lama, dll) sudah aku salin ke
`public/images/` — ini akan tetap tampil otomatis tanpa perlu upload ulang. Hanya gambar
**baru** yang diupload lewat admin nanti akan tersimpan di Vercel Blob.

## 5. Login admin

Password admin di database kamu sudah pakai format bcrypt PHP (`password_hash()`), dan ini
kompatibel langsung dengan Next.js (pakai `bcryptjs`) — jadi **username & password admin
yang lama tetap bisa dipakai**, tidak perlu reset.

Kalau suatu saat perlu reset/ganti password admin, jalankan:
```bash
node scripts/seed.mjs password-baru-kamu
```
Script ini akan mencetak perintah SQL `UPDATE`/`INSERT` yang tinggal kamu jalankan di
database.

## 6. Jalankan di lokal (opsional, untuk testing sebelum deploy)

```bash
npm install
cp .env.example .env.local   # lalu isi semua variabelnya
npm run dev
```
Buka `http://localhost:3000` untuk situs publik, dan `http://localhost:3000/admin` untuk
login admin.

## 7. Deploy ke Vercel

1. Push folder ini ke repository GitHub (atau upload langsung lewat Vercel CLI).
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo tersebut.
   Vercel otomatis mendeteksi ini sebagai project Next.js, tidak perlu konfigurasi build khusus.
3. Sebelum klik Deploy, isi semua **Environment Variables** dari langkah 3 di atas.
4. Setelah deploy pertama sukses, buat Blob store (langkah 4) — lalu **redeploy** sekali
   lagi supaya token blob-nya terpakai.
5. Selesai — arahkan domain kamu (misalnya lewat DNS di provider domain) ke Vercel sesuai
   instruksi yang muncul di tab **Domains** pada project Vercel kamu.

## Catatan lain

- `npm audit` mungkin menampilkan beberapa peringatan kerentanan minor pada versi Next.js
  14 — ini aman untuk pemakaian normal, tapi kalau mau paling aman, bisa upgrade ke Next.js
  versi terbaru nanti (butuh sedikit penyesuaian, bisa dibantu kalau diperlukan).
- Semua desain (warna, font, layout) sudah 1:1 mengikuti CSS asli kamu (`assets/globals.css`
  disalin langsung ke `app/globals.css`), jadi tampilan situs seharusnya identik dengan versi
  PHP-nya.
