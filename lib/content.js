import { rows, row } from './db';

export async function getHero() {
  const h = await row('SELECT * FROM hero LIMIT 1');
  if (!h) return null;
  const stats = await rows('SELECT label,value FROM hero_stats WHERE hero_id=? ORDER BY sort', [h.id]);
  return {
    eyebrow: h.eyebrow,
    heading: h.heading,
    subheading: h.subheading,
    ctaPrimary: { label: h.cta_primary_label, href: h.cta_primary_href },
    ctaSecondary: { label: h.cta_secondary_label, href: h.cta_secondary_href },
    heroImage: h.hero_image,
    heroImageAlt: h.hero_image_alt,
    heroImageCaption: h.hero_image_caption,
    stats,
  };
}

export async function getAbout() {
  const a = await row('SELECT * FROM about LIMIT 1');
  if (!a) return null;
  const paras = await rows('SELECT content FROM about_paragraphs WHERE about_id=? ORDER BY sort', [a.id]);
  const tags = await rows('SELECT tag FROM about_tags WHERE about_id=? ORDER BY sort', [a.id]);
  return {
    heading: a.heading,
    paragraphs: paras.map((p) => p.content),
    tags: tags.map((t) => t.tag),
  };
}

export async function getVisiMisi() {
  const v = await row('SELECT * FROM visimisi LIMIT 1');
  if (!v) return null;
  const missions = await rows('SELECT content FROM visimisi_missions WHERE visimisi_id=? ORDER BY sort', [v.id]);
  return { vision: v.vision, missions: missions.map((m) => m.content) };
}

export async function getLayanan() {
  const l = await row('SELECT * FROM layanan LIMIT 1');
  if (!l) return null;
  const pillarRows = await rows('SELECT * FROM layanan_pillars WHERE layanan_id=? ORDER BY sort', [l.id]);
  const pillars = [];
  for (const p of pillarRows) {
    const brands = await rows('SELECT brand FROM layanan_pillar_brands WHERE pillar_id=? ORDER BY sort', [p.id]);
    pillars.push({ tag: p.tag, title: p.title, desc: p.description, brands: brands.map((b) => b.brand) });
  }
  const gallery = await rows('SELECT src,caption FROM layanan_gallery WHERE layanan_id=? ORDER BY sort', [l.id]);
  return { heading: l.heading, subheading: l.subheading, pillars, gallery };
}

export async function getServis() {
  const s = await row('SELECT * FROM servis LIMIT 1');
  if (!s) return null;
  const regionRows = await rows('SELECT * FROM servis_regions WHERE servis_id=? ORDER BY sort', [s.id]);
  const regions = [];
  for (const r of regionRows) {
    const perks = await rows('SELECT perk FROM servis_region_perks WHERE region_id=? ORDER BY sort', [r.id]);
    regions.push({ tag: r.tag, color: r.color, perks: perks.map((p) => p.perk) });
  }
  return { heading: s.heading, description: s.description, regions };
}

export async function getEkspansi() {
  const e = await row('SELECT * FROM ekspansi LIMIT 1');
  if (!e) return null;
  // FIX: backtick (`) adalah sintaks MySQL, Postgres pakai double-quote (").
  // "desc" juga reserved keyword di Postgres, jadi wajib di-quote sebagai alias.
  const timeline = await rows(
    'SELECT date,status,color,title,description as "desc" FROM ekspansi_timeline WHERE ekspansi_id=? ORDER BY sort',
    [e.id]
  );
  return { heading: e.heading, subheading: e.subheading, timeline };
}

export async function getKontak() {
  const k = await row('SELECT * FROM kontak LIMIT 1');
  if (!k) return null;
  const infoPills = await rows('SELECT text,type FROM kontak_info_pills WHERE kontak_id=? ORDER BY sort', [k.id]);
  const channels = await rows(
    'SELECT label,value,href,note,type FROM kontak_channels WHERE kontak_id=? ORDER BY sort',
    [k.id]
  );
  return {
    heading: k.heading,
    subheading: k.subheading,
    whatsapp: k.whatsapp,
    infoPills,
    channels,
  };
}

export async function getBerita() {
  // FIX: alias camelCase tanpa quote akan di-lowercase-kan Postgres
  // (coverImage -> coverimage). Harus di-quote agar case-nya tetap.
  return rows(
    'SELECT slug,title,date,month,category,excerpt,cover_image as "coverImage" FROM berita ORDER BY id DESC'
  );
}

export async function getBeritaBySlug(slug) {
  const b = await row('SELECT * FROM berita WHERE slug=? LIMIT 1', [slug]);
  if (!b) return null;
  const body = await rows(
    'SELECT section_id as id, heading, content, image FROM berita_body WHERE berita_id=? ORDER BY sort',
    [b.id]
  );
  return {
    slug: b.slug,
    title: b.title,
    date: b.date,
    month: b.month,
    category: b.category,
    excerpt: b.excerpt,
    coverImage: b.cover_image,
    body,
  };
}

const MONTHS_ID = {
  '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
  '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
  '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember',
};

export function buildArchives(articles) {
  const map = {};
  for (const a of articles) {
    const m = a.month || '';
    if (!m) continue;
    if (!map[m]) {
      const [y, mo] = m.split('-');
      map[m] = { label: `${MONTHS_ID[mo] || mo} ${y}`, month: m, count: 0 };
    }
    map[m].count++;
  }
  return Object.values(map).sort((a, b) => (a.month < b.month ? 1 : -1));
}
