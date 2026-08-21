export default function BeritaSidebar({ archives, recentPosts, searchDefault = '' }) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
        <h3 className="eyebrow mb-3 text-xs font-semibold" style={{ color: 'var(--ink)' }}>Cari Artikel</h3>
        <form method="GET" action="/berita" className="flex overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
          <input
            type="text"
            name="q"
            defaultValue={searchDefault}
            placeholder="Ketik kata kunci..."
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            style={{ color: 'var(--ink)' }}
          />
          <button
            type="submit"
            className="flex items-center justify-center px-3 transition-colors hover:bg-[var(--navy)] hover:text-white"
            style={{ color: 'var(--navy)', borderLeft: '1px solid var(--line)' }}
            aria-label="Cari"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>

      <div className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
        <h3 className="eyebrow mb-3 text-xs font-semibold" style={{ color: 'var(--ink)' }}>Arsip</h3>
        <ul className="flex flex-col">
          {archives.map((arc) => (
            <li key={arc.month}>
              <a
                href={`/berita?bulan=${arc.month}`}
                className="flex items-center justify-between border-b py-2 text-sm transition-colors hover:text-[var(--navy)]"
                style={{ borderColor: 'var(--line-soft)', color: 'var(--ink-soft)' }}
              >
                <span>{arc.label}</span>
                <span className="eyebrow text-[0.6rem] px-1.5 py-0.5" style={{ background: 'rgba(30,42,110,0.07)', color: 'var(--navy)' }}>{arc.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
        <h3 className="eyebrow mb-3 text-xs font-semibold" style={{ color: 'var(--ink)' }}>Artikel Terbaru</h3>
        <ul className="flex flex-col gap-4">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <a href={`/berita/${post.slug}`} className="group flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden" style={{ background: '#0d1020' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-medium leading-snug"
                    style={{ color: 'var(--ink)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {post.title}
                  </span>
                  <span className="eyebrow text-[0.6rem]" style={{ color: 'var(--ink-soft)' }}>{post.date}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
