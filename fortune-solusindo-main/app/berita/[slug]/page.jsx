import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeritaSidebar from '@/components/BeritaSidebar';
import { ScanBar } from '@/components/Icons';
import { getBerita, getBeritaBySlug, buildArchives } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const article = await getBeritaBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — Fortune Solusindo`,
    description: article.excerpt || '',
  };
}

export default async function BeritaDetailPage({ params }) {
  const article = await getBeritaBySlug(params.slug);
  if (!article) notFound();

  const articles = await getBerita();
  const recentPosts = articles.filter((a) => a.slug !== params.slug).slice(0, 3);
  const archives = buildArchives(articles);

  return (
    <>
      <Navbar active="berita" />
      <main style={{ background: 'var(--paper)' }}>
        <div className="border-b" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
          <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">
            <nav className="eyebrow mb-4 flex items-center gap-1.5 text-[0.65rem]" style={{ color: 'var(--ink-soft)' }}>
              <a href="/" className="hover:underline">Beranda</a>
              <span>/</span>
              <a href="/berita" className="hover:underline">Berita</a>
              <span>/</span>
              <span style={{ color: 'var(--ink)' }}>{article.category}</span>
            </nav>
            <ScanBar />
            <h1 className="mt-3 max-w-2xl text-2xl font-semibold leading-snug md:text-3xl" style={{ color: 'var(--ink)' }}>
              {article.title}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <span className="eyebrow text-[0.65rem]" style={{ color: 'var(--navy)' }}>{article.category}</span>
              <span style={{ color: 'var(--line)' }}>|</span>
              <span className="eyebrow text-[0.65rem]" style={{ color: 'var(--ink-soft)' }}>{article.date}</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_260px]">
            <article>
              <a href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors hover:text-[var(--navy)]" style={{ color: 'var(--ink-soft)' }}>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M10 6H2M5 3L2 6l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kembali ke semua artikel
              </a>

              <div className="relative mb-8 w-full overflow-hidden" style={{ aspectRatio: '16/7', background: '#0d1020' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} loading="eager" />
              </div>

              <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{article.excerpt}</p>

              <div className="flex flex-col gap-10">
                {(article.body || []).map((section) => (
                  <section id={section.id} key={section.id} style={{ scrollMarginTop: '7rem' }}>
                    <h2 className="mb-3 text-lg font-semibold" style={{ color: 'var(--ink)' }}>{section.heading}</h2>
                    <div className="h-0.5 w-10 mb-4" style={{ background: 'var(--navy)' }}></div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{section.content}</p>
                    {section.image && (
                      <div className="relative mt-5 w-full overflow-hidden" style={{ aspectRatio: '16/8', background: '#0d1020' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={section.image} alt={section.heading} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>

            <BeritaSidebar archives={archives} recentPosts={recentPosts} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
