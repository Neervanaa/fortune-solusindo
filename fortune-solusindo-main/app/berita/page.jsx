import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeritaSidebar from '@/components/BeritaSidebar';
import { ScanBar } from '@/components/Icons';
import { getBerita, buildArchives } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Berita & Artikel — Fortune Solusindo',
  description: 'Tips, panduan, dan informasi seputar mesin fotokopi, digital printing, dan solusi bisnis dari Fortune Solusindo.',
};

const CAT_COLORS = { Panduan: 'var(--navy)', Bisnis: 'var(--signal-green)', Teknis: 'var(--signal-red)' };

export default async function BeritaListPage({ searchParams }) {
  const q = (searchParams?.q || '').trim();
  const bulan = (searchParams?.bulan || '').trim();

  const articles = await getBerita();

  const filtered = articles.filter((a) => {
    if (bulan && (a.month || '') !== bulan) return false;
    if (q) {
      const ql = q.toLowerCase();
      const inTitle = (a.title || '').toLowerCase().includes(ql);
      const inExcerpt = (a.excerpt || '').toLowerCase().includes(ql);
      if (!inTitle && !inExcerpt) return false;
    }
    return true;
  });

  const archives = buildArchives(articles);
  const recentPosts = articles.slice(0, 3);
  const bulanLabel = archives.find((a) => a.month === bulan)?.label;

  return (
    <>
      <Navbar active="berita" />
      <main style={{ background: 'var(--paper)' }}>
        <div className="border-b" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
          <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
            <ScanBar />
            <h1 className="mt-4 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--ink)' }}>Berita &amp; Artikel</h1>
            <p className="mt-2 max-w-lg text-sm" style={{ color: 'var(--ink-soft)' }}>
              Tips, panduan teknis, dan wawasan bisnis seputar solusi dokumentasi dari Fortune Solusindo.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
            <div>
              {(q || bulan) && (
                <div className="mb-6 flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                    {filtered.length} artikel ditemukan
                    {q && (
                      <> untuk &ldquo;<strong style={{ color: 'var(--ink)' }}>{q}</strong>&rdquo;</>
                    )}
                    {bulan && bulanLabel && (
                      <> pada <strong style={{ color: 'var(--ink)' }}>{bulanLabel}</strong></>
                    )}
                  </span>
                  <a href="/berita" className="text-xs underline" style={{ color: 'var(--navy)' }}>Reset</a>
                </div>
              )}

              {filtered.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Tidak ada artikel yang cocok.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {filtered.map((article) => {
                    const catColor = CAT_COLORS[article.category] || 'var(--navy)';
                    return (
                      <a
                        key={article.slug}
                        href={`/berita/${article.slug}`}
                        className="group flex flex-col border bg-white transition-shadow hover:shadow-md sm:flex-row"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48" style={{ background: '#0d1020' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'transform .5s' }}
                          />
                          <div className="absolute left-0 top-0 h-1 w-full" style={{ background: catColor }}></div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="eyebrow text-[0.65rem]" style={{ color: catColor }}>{article.category}</span>
                              <span className="eyebrow text-[0.65rem]" style={{ color: 'var(--ink-soft)' }}>· {article.date}</span>
                            </div>
                            <h2 className="text-base font-semibold leading-snug" style={{ color: 'var(--ink)' }}>{article.title}</h2>
                            <p
                              className="mt-2 text-sm leading-relaxed"
                              style={{ color: 'var(--ink-soft)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                            >
                              {article.excerpt}
                            </p>
                          </div>
                          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--navy)' }}>
                            Baca selengkapnya
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <BeritaSidebar archives={archives} recentPosts={recentPosts} searchDefault={q} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
