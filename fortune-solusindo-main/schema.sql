-- ============================================================
-- Fortune Solusindo — Database Schema (PostgreSQL)
-- ============================================================

-- ------------------------------------------------------------ 
-- USERS (admin)
-- ------------------------------------------------------------
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,          -- bcrypt hash
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin: username=admin | password=samanhudi87
-- Hash di-generate dengan: php -r "echo password_hash('samanhudi87', PASSWORD_DEFAULT);"
INSERT INTO users (username, password) VALUES (
    'admin',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- ------------------------------------------------------------ 
-- HERO
-- ------------------------------------------------------------
CREATE TABLE hero (
    id                  SERIAL PRIMARY KEY,
    eyebrow             VARCHAR(255),
    heading             TEXT,
    subheading          TEXT,
    cta_primary_label   VARCHAR(100),
    cta_primary_href    VARCHAR(255),
    cta_secondary_label VARCHAR(100),
    cta_secondary_href  VARCHAR(255),
    hero_image          VARCHAR(255),
    hero_image_alt      VARCHAR(255),
    hero_image_caption  VARCHAR(255),
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hero_stats (
    id       SERIAL PRIMARY KEY,
    hero_id  INTEGER NOT NULL,
    label    VARCHAR(100),
    value    VARCHAR(100),
    sort     SMALLINT DEFAULT 0,
    FOREIGN KEY (hero_id) REFERENCES hero(id) ON DELETE CASCADE
);

INSERT INTO hero (eyebrow, heading, subheading, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, hero_image, hero_image_alt, hero_image_caption)
VALUES (
    'Sejak 23 Juli 2023 — Sidoarjo, Jawa Timur',
    'Solusi bisnis yang tercetak rapi, terkelola tepat.',
    'Fortune Solusindo menghadirkan solusi bisnis yang terintegrasi, inovatif, dan tepercaya — dari digital printing, mesin fotokopi, hingga kontrak servis yang menjaga operasional mitra tetap berjalan tanpa hambatan.',
    'Diskusikan Kebutuhan Anda', 'https://wa.me/6283833502020',
    'Lihat Layanan', '/#layanan',
    '/images/mesin-fotocopy-04.jpg',
    'Unit mesin fotokopi Laser A3+ Color Fortune Solusindo',
    'UNIT · LASER A3+ COLOR'
);

INSERT INTO hero_stats (hero_id, label, value, sort) VALUES
(1, 'Berdiri',     '23 Jul 2023',   1),
(1, 'Basis',       'Sidoarjo, Jatim', 2),
(1, 'Unit Bisnis', '3 aktif',       3);

-- ------------------------------------------------------------ 
-- ABOUT
-- ------------------------------------------------------------
CREATE TABLE about (
    id         SERIAL PRIMARY KEY,
    heading    VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE about_paragraphs (
    id       SERIAL PRIMARY KEY,
    about_id INTEGER NOT NULL,
    content  TEXT,
    sort     SMALLINT DEFAULT 0,
    FOREIGN KEY (about_id) REFERENCES about(id) ON DELETE CASCADE
);

CREATE TABLE about_tags (
    id       SERIAL PRIMARY KEY,
    about_id INTEGER NOT NULL,
    tag      VARCHAR(100),
    sort     SMALLINT DEFAULT 0,
    FOREIGN KEY (about_id) REFERENCES about(id) ON DELETE CASCADE
);

INSERT INTO about (heading) VALUES ('Tentang Kami');

INSERT INTO about_paragraphs (about_id, content, sort) VALUES
(1, 'Fortune Solusindo lahir dari sebuah visi besar untuk menghadirkan solusi bisnis yang terintegrasi, inovatif, dan tepercaya. Resmi berdiri pada tanggal <strong>23 Juli 2023</strong> di <strong>Sidoarjo, Jawa Timur</strong>, kami mengawali langkah sebagai penyedia layanan dan perangkat dokumentasi modern yang berorientasi pada kepuasan pelanggan.', 1),
(1, 'Melalui komitmen yang kuat terhadap kualitas, Fortune Solusindo tumbuh menjadi mitra strategis bagi berbagai sektor usaha, perkantoran, instansi, hingga pelaku industri kreatif.', 2);

INSERT INTO about_tags (about_id, tag, sort) VALUES
(1, 'Sektor Usaha',    1),
(1, 'Perkantoran',     2),
(1, 'Instansi',        3),
(1, 'Industri Kreatif', 4);

-- ------------------------------------------------------------ 
-- VISI MISI
-- ------------------------------------------------------------
CREATE TABLE visimisi (
    id         SERIAL PRIMARY KEY,
    vision     TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visimisi_missions (
    id          SERIAL PRIMARY KEY,
    visimisi_id INTEGER NOT NULL,
    content     TEXT,
    sort        SMALLINT DEFAULT 0,
    FOREIGN KEY (visimisi_id) REFERENCES visimisi(id) ON DELETE CASCADE
);

INSERT INTO visimisi (vision) VALUES (
    'Menjadi perusahaan konglomerasi dan penyedia solusi multi-sektor yang terkemuka, tepercaya, serta mampu memberikan nilai tambah berkelanjutan bagi masyarakat, pelanggan, dan para mitra bisnis.'
);

INSERT INTO visimisi_missions (visimisi_id, content, sort) VALUES
(1, 'Menghadirkan produk dan layanan cetak serta perawatan mesin produksi dengan teknologi terkini dan dukungan teknis prima.', 1),
(1, 'Mengembangkan jaringan kemitraan Fortune Clean & Laundry yang profesional, transparan, dan saling menguntungkan.', 2),
(1, 'Membangun dan mengelola unit bisnis baru di sektor F&B serta peternakan dengan standar kualitas tinggi yang berkelanjutan.', 3),
(1, 'Selalu berinovasi dan merespons cepat setiap dinamika kebutuhan pasar.', 4);

-- ------------------------------------------------------------ 
-- LAYANAN
-- ------------------------------------------------------------
CREATE TABLE layanan (
    id         SERIAL PRIMARY KEY,
    heading    VARCHAR(255),
    subheading TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE layanan_pillars (
    id         SERIAL PRIMARY KEY,
    layanan_id INTEGER NOT NULL,
    tag        VARCHAR(100),
    title      VARCHAR(255),
    description TEXT,
    sort       SMALLINT DEFAULT 0,
    FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE
);

CREATE TABLE layanan_pillar_brands (
    id         SERIAL PRIMARY KEY,
    pillar_id  INTEGER NOT NULL,
    brand      VARCHAR(100),
    sort       SMALLINT DEFAULT 0,
    FOREIGN KEY (pillar_id) REFERENCES layanan_pillars(id) ON DELETE CASCADE
);

CREATE TABLE layanan_gallery (
    id         SERIAL PRIMARY KEY,
    layanan_id INTEGER NOT NULL,
    src        VARCHAR(255),
    caption    VARCHAR(255),
    sort       SMALLINT DEFAULT 0,
    FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE
);

INSERT INTO layanan (heading, subheading) VALUES (
    'Layanan & Bisnis Utama',
    'Tiga pilar yang menopang operasional Fortune Solusindo sebagai penyedia solusi dokumentasi bisnis.'
);

INSERT INTO layanan_pillars (layanan_id, tag, title, description, sort) VALUES
(1, 'PRINT',      'Jasa Percetakan Digital Printing',   'Menghadirkan layanan cetak cepat dengan ketajaman warna dan kualitas premium untuk memenuhi kebutuhan promosi, bisnis, hingga personal.', 1),
(1, 'JUAL / SEWA','Penjualan & Sewa Mesin Fotokopi',    'Menyediakan solusi pengadaan perangkat pengganda dokumen, baik untuk kebutuhan beli putus maupun sistem sewa yang fleksibel dan ekonomis bagi perusahaan.', 2),
(1, 'UNIT PREMIUM','Penyediaan Mesin Laser A3+ Color',  'Menghadirkan jajaran mesin cetak digital Laser A3+ Color terbaik dari berbagai merek global ternama yang telah teruji keandalannya.', 3);

INSERT INTO layanan_pillar_brands (pillar_id, brand, sort) VALUES
(3, 'Xerox',         1),
(3, 'Canon',         2),
(3, 'Konica Minolta',3),
(3, 'Ricoh',         4);

INSERT INTO layanan_gallery (layanan_id, src, caption, sort) VALUES
(1, '/images/mesin-fotocopy-01.jpg', 'Unit Xerox di lokasi klien',    1),
(1, '/images/mesin-fotocopy-02.jpg', 'Mesin laser A3+ Color',         2),
(1, '/images/mesin-fotocopy-03.jpg', 'Instalasi di kantor korporat',  3),
(1, '/images/mesin-fotocopy-05.jpg', 'Canon imageRUNNER series',      4),
(1, '/images/mesin-fotocopy-06.jpg', 'Konica Minolta bizhub',         5),
(1, '/images/mesin-fotocopy-07.jpg', 'Ricoh IM series',               6),
(1, '/images/mesin-fotocopy-08.jpg', 'Unit sewa fleksibel',           7),
(1, '/images/mesin-fotocopy-09.jpg', 'Digital printing premium',      8);

-- ------------------------------------------------------------ 
-- SERVIS
-- ------------------------------------------------------------
CREATE TABLE servis (
    id          SERIAL PRIMARY KEY,
    heading     VARCHAR(255),
    description TEXT,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servis_regions (
    id        SERIAL PRIMARY KEY,
    servis_id INTEGER NOT NULL,
    tag       VARCHAR(100),
    color     VARCHAR(100),
    sort      SMALLINT DEFAULT 0,
    FOREIGN KEY (servis_id) REFERENCES servis(id) ON DELETE CASCADE
);

CREATE TABLE servis_region_perks (
    id        SERIAL PRIMARY KEY,
    region_id INTEGER NOT NULL,
    perk      VARCHAR(255),
    sort      SMALLINT DEFAULT 0,
    FOREIGN KEY (region_id) REFERENCES servis_regions(id) ON DELETE CASCADE
);

INSERT INTO servis (heading, description) VALUES (
    'Target Pasar & Program Kontrak Servis',
    'Kami mendedikasikan layanan untuk mendukung efisiensi operasional bisnis Anda, dengan fokus pada kerja sama kontrak servis bersama pelaku usaha digital printing untuk perawatan mesin secara berkala — didukung tim teknisi profesional dengan respons cepat dan analisis masalah yang tepat.'
);

INSERT INTO servis_regions (servis_id, tag, color, sort) VALUES
(1, 'SIDOARJO & SURABAYA', 'var(--signal-green)', 1),
(1, 'LUAR KOTA',           'var(--amber)',         2);

INSERT INTO servis_region_perks (region_id, perk, sort) VALUES
(1, 'Gratis kunjungan bulanan (perawatan rutin)', 1),
(1, 'Gratis panggilan darurat',                  2),
(2, 'Perawatan rutin dengan fasilitas yang sama', 1),
(2, 'Biaya transportasi khusus untuk panggilan darurat', 2);

-- ------------------------------------------------------------ 
-- EKSPANSI
-- ------------------------------------------------------------
CREATE TABLE ekspansi (
    id         SERIAL PRIMARY KEY,
    heading    VARCHAR(255),
    subheading TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ekspansi_timeline (
    id          SERIAL PRIMARY KEY,
    ekspansi_id INTEGER NOT NULL,
    date        VARCHAR(50),
    status      VARCHAR(50),
    color       VARCHAR(100),
    title       VARCHAR(255),
    description TEXT,
    sort        SMALLINT DEFAULT 0,
    FOREIGN KEY (ekspansi_id) REFERENCES ekspansi(id) ON DELETE CASCADE
);

INSERT INTO ekspansi (heading, subheading) VALUES (
    'Inovasi & Ekspansi Multi-Sektor',
    'Seiring perkembangan pasar yang dinamis, Fortune Solusindo berkomitmen untuk terus bergerak maju dan melakukan diversifikasi bisnis yang agresif di berbagai sektor potensial.'
);

INSERT INTO ekspansi_timeline (ekspansi_id, date, status, color, title, description, sort) VALUES
(1, '23 Jul 2023', 'BERDIRI', 'rgba(255,255,255,0.75)', 'Fortune Solusindo didirikan',
    'Mengawali langkah sebagai penyedia layanan dan perangkat dokumentasi modern di Sidoarjo, Jawa Timur.', 1),
(1, 'Des 2025', 'AKTIF', 'var(--amber)', 'Fortune Clean & Laundry',
    'Langkah awal ekspansi ke industri perawatan pakaian melalui layanan laundry koin modern di Sidoarjo yang mengutamakan kecepatan dan higienitas — dikembangkan dengan sistem kemitraan (franchise/partnership) yang terbuka bagi investor.', 2),
(1, '2026', 'WACANA', 'var(--amber)', 'Food & Beverage (F&B)',
    'Merambah industri kuliner dengan mempersiapkan lini bisnis F&B inovatif yang siap menyajikan produk berkualitas untuk memenuhi selera pasar modern.', 3),
(1, '2026', 'WACANA', 'var(--amber)', 'Agribisnis — Peternakan Sapi',
    'Ekspansi strategis ke sektor peternakan sapi yang dikelola secara profesional untuk menghasilkan komoditas unggulan bernilai ekonomi tinggi, sebagai wujud kontribusi terhadap ketahanan pangan nasional.', 4);

-- ------------------------------------------------------------ 
-- KONTAK
-- ------------------------------------------------------------
CREATE TABLE kontak (
    id         SERIAL PRIMARY KEY,
    heading    VARCHAR(255),
    subheading TEXT,
    whatsapp   VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kontak_info_pills (
    id        SERIAL PRIMARY KEY,
    kontak_id INTEGER NOT NULL,
    text      VARCHAR(255),
    type      VARCHAR(50),
    sort      SMALLINT DEFAULT 0,
    FOREIGN KEY (kontak_id) REFERENCES kontak(id) ON DELETE CASCADE
);

CREATE TABLE kontak_channels (
    id        SERIAL PRIMARY KEY,
    kontak_id INTEGER NOT NULL,
    label     VARCHAR(100),
    value     VARCHAR(255),
    href      VARCHAR(255),
    note      VARCHAR(255),
    type      VARCHAR(50),
    sort      SMALLINT DEFAULT 0,
    FOREIGN KEY (kontak_id) REFERENCES kontak(id) ON DELETE CASCADE
);

INSERT INTO kontak (heading, subheading, whatsapp) VALUES (
    'Hubungi Kami',
    'Siap membantu kebutuhan pengadaan mesin, kontrak servis berkala, maupun peluang kemitraan bisnis multi-sektor Anda.',
    '6283833502020'
);

INSERT INTO kontak_info_pills (kontak_id, text, type, sort) VALUES
(1, 'Sidoarjo, Jawa Timur',        'location', 1),
(1, 'Senin – Sabtu, 08.00 – 17.00','hours',    2),
(1, 'Respon dalam 1×24 jam',       'response', 3);

INSERT INTO kontak_channels (kontak_id, label, value, href, note, type, sort) VALUES
(1, 'WhatsApp / Telepon Admin', '0838 3350 2020',      'https://wa.me/6283833502020',                              'Respon cepat pada jam kerja',       'whatsapp',  1),
(1, 'Instagram',                '@fortune_solusindo',  'https://instagram.com/fortune_solusindo',                  'Update produk & promo terbaru',      'instagram', 2),
(1, 'Facebook',                 'Fortune Solusindo',   'https://www.facebook.com/profile.php?id=61562802491014',   'Informasi & layanan pelanggan',      'facebook',  3);

-- ------------------------------------------------------------ 
-- BERITA (artikel)
-- ------------------------------------------------------------
CREATE TABLE berita (
    id          SERIAL PRIMARY KEY,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    title       VARCHAR(255),
    date        VARCHAR(50),
    month       VARCHAR(7),
    category    VARCHAR(100),
    excerpt     TEXT,
    cover_image VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE berita_body (
    id        SERIAL PRIMARY KEY,
    berita_id INTEGER NOT NULL,
    section_id VARCHAR(100),
    heading   VARCHAR(255),
    content   TEXT,
    image     VARCHAR(255),
    sort      SMALLINT DEFAULT 0,
    FOREIGN KEY (berita_id) REFERENCES berita(id) ON DELETE CASCADE
);

INSERT INTO berita (slug, title, date, month, category, excerpt, cover_image) VALUES
('tips-memilih-mesin-fotokopi-kantor',
 'Tips Memilih Mesin Fotokopi yang Tepat untuk Kantor Anda',
 '2 Juli 2026', '2026-07', 'Panduan',
 'Memilih mesin fotokopi bukan sekadar soal harga. Pelajari faktor-faktor kunci yang wajib dipertimbangkan sebelum membeli atau menyewa.',
 '/images/mesin-fotocopy-02.jpg'),
('manfaat-sewa-mesin-fotokopi',
 'Mengapa Sewa Mesin Fotokopi Lebih Menguntungkan untuk Bisnis Skala Menengah',
 '18 Juni 2026', '2026-06', 'Bisnis',
 'Sistem sewa mesin fotokopi semakin populer di kalangan UKM dan perusahaan menengah. Ini alasannya.',
 '/images/mesin-fotocopy-03.jpg'),
('perawatan-mesin-fotokopi',
 'Panduan Perawatan Mesin Fotokopi agar Awet dan Optimal',
 '5 Juni 2026', '2026-06', 'Teknis',
 'Perawatan rutin adalah kunci umur panjang mesin fotokopi. Ikuti panduan ini untuk menjaga performa mesin Anda.',
 '/images/mesin-fotocopy-07.jpg');

INSERT INTO berita_body (berita_id, section_id, heading, content, image, sort) VALUES
(1, 'kebutuhan-volume',  '1. Kenali Kebutuhan Volume Cetak',       'Langkah pertama adalah menghitung estimasi jumlah halaman yang dicetak per bulan. Mesin entry-level cocok untuk 500–2.000 lembar/bulan, sementara mesin kelas korporat mampu menangani lebih dari 20.000 lembar tanpa penurunan kualitas. Salah memilih kapasitas akan memperpendek usia mesin secara signifikan.', '/images/mesin-fotocopy-01.jpg', 1),
(1, 'format-kertas',     '2. Pertimbangkan Format Kertas',          'Jika operasional Anda membutuhkan cetak format A3 — seperti gambar teknik, poster, atau laporan besar — pastikan mesin mendukung A3+. Mesin Laser A3+ Color dari merek seperti Xerox, Canon, dan Konica Minolta menawarkan fleksibilitas format sekaligus ketajaman warna yang konsisten.', '/images/mesin-fotocopy-02.jpg', 2),
(1, 'beli-vs-sewa',      '3. Beli Putus vs. Sistem Sewa',           'Beli putus memberikan kepemilikan penuh namun membutuhkan modal awal besar dan biaya perawatan mandiri. Sistem sewa (leasing) lebih ringan di kas, sudah termasuk servis berkala, dan memudahkan upgrade unit ketika teknologi berkembang. Fortune Solusindo menyediakan kedua opsi dengan skema yang dapat disesuaikan.', NULL, 3),
(1, 'biaya-operasional', '4. Hitung Biaya Operasional per Lembar',  'Harga mesin hanyalah sebagian dari total biaya. Toner, drum, dan biaya servis membentuk cost-per-page (CPP) yang sesungguhnya. Mesin dengan harga beli murah sering kali memiliki CPP lebih tinggi. Bandingkan CPP antar merek sebelum memutuskan.', '/images/mesin-fotocopy-05.jpg', 4),
(1, 'konektivitas',      '5. Fitur Konektivitas & Keamanan',        'Mesin modern mendukung cetak via Wi-Fi, cloud printing, dan mobile print. Untuk lingkungan korporat, fitur keamanan seperti PIN printing dan enkripsi data penting untuk mencegah kebocoran dokumen sensitif.', NULL, 5),

(2, 'efisiensi-modal',   '1. Efisiensi Modal Kerja',                'Dengan sistem sewa, perusahaan tidak perlu mengalokasikan puluhan juta rupiah sekaligus untuk pembelian aset. Modal tersebut dapat diputar untuk kebutuhan operasional yang lebih produktif seperti pemasaran atau pengembangan SDM.', '/images/mesin-fotocopy-06.jpg', 1),
(2, 'servis-terjamin',   '2. Servis & Suku Cadang Terjamin',        'Paket sewa Fortune Solusindo mencakup kunjungan teknisi berkala, penggantian suku cadang, dan respons darurat. Bisnis Anda tidak perlu khawatir mesin berhenti di tengah deadline penting.', '/images/mesin-fotocopy-03.jpg', 2),
(2, 'upgrade-mudah',     '3. Mudah Upgrade Unit',                   'Teknologi mesin cetak berkembang pesat. Dengan sewa, Anda dapat mengajukan upgrade ke unit terbaru di akhir kontrak tanpa harus menjual mesin lama terlebih dahulu.', NULL, 3),
(2, 'pajak',             '4. Keuntungan dari Sisi Pajak',           'Biaya sewa dapat dikategorikan sebagai biaya operasional yang mengurangi beban pajak penghasilan badan, berbeda dengan pembelian aset yang harus disusutkan selama beberapa tahun.', NULL, 4),

(3, 'bersihkan-kaca',    '1. Bersihkan Kaca Scanner Secara Rutin',  'Debu dan sidik jari pada kaca scanner menyebabkan garis hitam pada hasil salinan. Bersihkan dengan kain microfiber lembab (bukan basah) setiap minggu. Hindari cairan pembersih berbahan alkohol tinggi yang dapat merusak lapisan anti-reflektif.', '/images/mesin-fotocopy-07.jpg', 1),
(3, 'kertas-berkualitas','2. Gunakan Kertas Berkualitas',            'Kertas lembab atau berkualitas rendah adalah penyebab utama paper jam dan kerusakan roller. Gunakan kertas dengan gramatur 70–80 gsm yang tersimpan di tempat kering. Jangan mengisi tray melebihi kapasitas maksimum.', NULL, 2),
(3, 'toner-asli',        '3. Pakai Toner Original atau Kompatibel Bersertifikat', 'Toner palsu atau tidak kompatibel dapat merusak drum dan fuser secara permanen. Selalu gunakan toner original atau toner kompatibel yang telah mendapat sertifikasi dari produsen mesin.', '/images/mesin-fotocopy-08.jpg', 3),
(3, 'servis-berkala',    '4. Jadwalkan Servis Berkala',             'Servis preventif setiap 3–6 bulan mencakup pembersihan bagian dalam, pelumasan komponen mekanis, dan pengecekan kondisi drum serta fuser. Fortune Solusindo menyediakan program kontrak servis dengan jadwal kunjungan terjadwal.', '/images/mesin-fotocopy-09.jpg', 4),
(3, 'matikan-dengan-benar','5. Matikan Mesin dengan Benar',         'Selalu gunakan tombol power untuk mematikan mesin, bukan langsung mencabut kabel. Proses shutdown memungkinkan mesin menyelesaikan siklus pendinginan fuser dan menyimpan konfigurasi internal dengan aman.', NULL, 5);
