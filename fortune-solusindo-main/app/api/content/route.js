import { NextResponse } from 'next/server';
import { rows, row, run, db } from '@/lib/db';
import { isLoggedIn } from '@/lib/session';
import {
  getHero, getAbout, getVisiMisi, getLayanan, getServis, getEkspansi, getKontak,
  getBerita, getBeritaBySlug,
} from '@/lib/content';

export const dynamic = 'force-dynamic';

function err(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request) {
  const section = request.nextUrl.searchParams.get('section') || '';

  switch (section) {
    case 'hero': {
      const data = await getHero();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'about': {
      const data = await getAbout();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'visimisi': {
      const data = await getVisiMisi();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'layanan': {
      const data = await getLayanan();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'servis': {
      const data = await getServis();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'ekspansi': {
      const data = await getEkspansi();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'kontak': {
      const data = await getKontak();
      return data ? NextResponse.json(data) : err('Data tidak ditemukan', 404);
    }
    case 'berita': {
      const slug = request.nextUrl.searchParams.get('slug') || '';
      if (slug) {
        const article = await getBeritaBySlug(slug);
        return article ? NextResponse.json(article) : err('Artikel tidak ditemukan', 404);
      }
      return NextResponse.json(await getBerita());
    }
    default:
      return err('Section tidak ditemukan', 404);
  }
}

export async function POST(request) {
  if (!(await isLoggedIn())) return err('Unauthorized', 401);

  const section = request.nextUrl.searchParams.get('section') || '';
  const body = await request.json().catch(() => null);
  if (body === null) return err('Data tidak valid', 400);

  switch (section) {
    case 'hero': {
      const h = await row('SELECT id FROM hero LIMIT 1');
      if (h) {
        await run(
          `UPDATE hero SET eyebrow=?,heading=?,subheading=?,cta_primary_label=?,cta_primary_href=?,
           cta_secondary_label=?,cta_secondary_href=?,hero_image=?,hero_image_alt=?,hero_image_caption=? WHERE id=?`,
          [
            body.eyebrow, body.heading, body.subheading,
            body.ctaPrimary?.label, body.ctaPrimary?.href,
            body.ctaSecondary?.label, body.ctaSecondary?.href,
            body.heroImage, body.heroImageAlt, body.heroImageCaption,
            h.id,
          ]
        );
        await run('DELETE FROM hero_stats WHERE hero_id=?', [h.id]);
        for (let i = 0; i < (body.stats || []).length; i++) {
          const s = body.stats[i];
          await run('INSERT INTO hero_stats (hero_id,label,value,sort) VALUES (?,?,?,?)', [h.id, s.label, s.value, i + 1]);
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'about': {
      const a = await row('SELECT id FROM about LIMIT 1');
      if (a) {
        await run('UPDATE about SET heading=? WHERE id=?', [body.heading, a.id]);
        await run('DELETE FROM about_paragraphs WHERE about_id=?', [a.id]);
        for (let i = 0; i < (body.paragraphs || []).length; i++) {
          await run('INSERT INTO about_paragraphs (about_id,content,sort) VALUES (?,?,?)', [a.id, body.paragraphs[i], i + 1]);
        }
        await run('DELETE FROM about_tags WHERE about_id=?', [a.id]);
        for (let i = 0; i < (body.tags || []).length; i++) {
          await run('INSERT INTO about_tags (about_id,tag,sort) VALUES (?,?,?)', [a.id, body.tags[i], i + 1]);
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'visimisi': {
      const v = await row('SELECT id FROM visimisi LIMIT 1');
      if (v) {
        await run('UPDATE visimisi SET vision=? WHERE id=?', [body.vision, v.id]);
        await run('DELETE FROM visimisi_missions WHERE visimisi_id=?', [v.id]);
        for (let i = 0; i < (body.missions || []).length; i++) {
          await run('INSERT INTO visimisi_missions (visimisi_id,content,sort) VALUES (?,?,?)', [v.id, body.missions[i], i + 1]);
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'layanan': {
      const l = await row('SELECT id FROM layanan LIMIT 1');
      if (l) {
        await run('UPDATE layanan SET heading=?,subheading=? WHERE id=?', [body.heading, body.subheading, l.id]);
        await run('DELETE FROM layanan_pillars WHERE layanan_id=?', [l.id]);
        for (let i = 0; i < (body.pillars || []).length; i++) {
          const p = body.pillars[i];
          const result = await run(
            'INSERT INTO layanan_pillars (layanan_id,tag,title,description,sort) VALUES (?,?,?,?,?) RETURNING id',
            [l.id, p.tag, p.title, p.desc, i + 1]
          );
          const pid = result.insertId;
          for (let j = 0; j < (p.brands || []).length; j++) {
            await run('INSERT INTO layanan_pillar_brands (pillar_id,brand,sort) VALUES (?,?,?)', [pid, p.brands[j], j + 1]);
          }
        }
        await run('DELETE FROM layanan_gallery WHERE layanan_id=?', [l.id]);
        for (let i = 0; i < (body.gallery || []).length; i++) {
          const g = body.gallery[i];
          await run('INSERT INTO layanan_gallery (layanan_id,src,caption,sort) VALUES (?,?,?,?)', [l.id, g.src, g.caption, i + 1]);
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'servis': {
      const s = await row('SELECT id FROM servis LIMIT 1');
      if (s) {
        await run('UPDATE servis SET heading=?,description=? WHERE id=?', [body.heading, body.description, s.id]);
        await run('DELETE FROM servis_regions WHERE servis_id=?', [s.id]);
        for (let i = 0; i < (body.regions || []).length; i++) {
          const r = body.regions[i];
          const result = await run('INSERT INTO servis_regions (servis_id,tag,color,sort) VALUES (?,?,?,?) RETURNING id', [s.id, r.tag, r.color, i + 1]);
          const rid = result.insertId;
          for (let j = 0; j < (r.perks || []).length; j++) {
            await run('INSERT INTO servis_region_perks (region_id,perk,sort) VALUES (?,?,?)', [rid, r.perks[j], j + 1]);
          }
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'ekspansi': {
      const e = await row('SELECT id FROM ekspansi LIMIT 1');
      if (e) {
        await run('UPDATE ekspansi SET heading=?,subheading=? WHERE id=?', [body.heading, body.subheading, e.id]);
        await run('DELETE FROM ekspansi_timeline WHERE ekspansi_id=?', [e.id]);
        for (let i = 0; i < (body.timeline || []).length; i++) {
          const t = body.timeline[i];
          await run(
            'INSERT INTO ekspansi_timeline (ekspansi_id,date,status,color,title,description,sort) VALUES (?,?,?,?,?,?,?)',
            [e.id, t.date, t.status, t.color, t.title, t.desc, i + 1]
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'kontak': {
      const k = await row('SELECT id FROM kontak LIMIT 1');
      if (k) {
        await run('UPDATE kontak SET heading=?,subheading=?,whatsapp=? WHERE id=?', [body.heading, body.subheading, body.whatsapp, k.id]);
        await run('DELETE FROM kontak_info_pills WHERE kontak_id=?', [k.id]);
        for (let i = 0; i < (body.infoPills || []).length; i++) {
          const p = body.infoPills[i];
          await run('INSERT INTO kontak_info_pills (kontak_id,text,type,sort) VALUES (?,?,?,?)', [k.id, p.text, p.type, i + 1]);
        }
        await run('DELETE FROM kontak_channels WHERE kontak_id=?', [k.id]);
        for (let i = 0; i < (body.channels || []).length; i++) {
          const ch = body.channels[i];
          await run(
            'INSERT INTO kontak_channels (kontak_id,label,value,href,note,type,sort) VALUES (?,?,?,?,?,?,?)',
            [k.id, ch.label, ch.value, ch.href, ch.note, ch.type, i + 1]
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    case 'berita': {
      // body can be a single article object (has slug) or an array (full list)
      const articles = body.slug !== undefined ? [body] : body;

      const existing = await rows('SELECT id,slug FROM berita');
      const existMap = {};
      for (const e of existing) existMap[e.slug] = e.id;

      const newSlugs = articles.map((a) => a.slug);
      for (const slug of Object.keys(existMap)) {
        if (!newSlugs.includes(slug)) {
          await run('DELETE FROM berita_body WHERE berita_id=?', [existMap[slug]]);
          await run('DELETE FROM berita WHERE id=?', [existMap[slug]]);
        }
      }

      for (const a of articles) {
        let bid;
        if (existMap[a.slug]) {
          bid = existMap[a.slug];
          await run(
            'UPDATE berita SET title=?,date=?,month=?,category=?,excerpt=?,cover_image=? WHERE id=?',
            [a.title, a.date, a.month, a.category, a.excerpt, a.coverImage, bid]
          );
        } else {
          const result = await run(
            'INSERT INTO berita (slug,title,date,month,category,excerpt,cover_image) VALUES (?,?,?,?,?,?,?) RETURNING id',
            [a.slug, a.title, a.date, a.month, a.category, a.excerpt, a.coverImage]
          );
          bid = result.insertId;
        }
        await run('DELETE FROM berita_body WHERE berita_id=?', [bid]);
        for (let j = 0; j < (a.body || []).length; j++) {
          const sec = a.body[j];
          await run(
            'INSERT INTO berita_body (berita_id,section_id,heading,content,image,sort) VALUES (?,?,?,?,?,?)',
            [bid, sec.id, sec.heading, sec.content, sec.image || null, j + 1]
          );
        }
      }
      return NextResponse.json({ success: true });
    }

    default:
      return err('Section tidak ditemukan', 404);
  }
}
