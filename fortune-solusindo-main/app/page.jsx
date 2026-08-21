import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GallerySwiper from '@/components/GallerySwiper';
import { ScanBar, SpecCardFrame, Icon, InfoIcon, ChannelIcon } from '@/components/Icons';
import { getHero, getAbout, getLayanan, getServis, getEkspansi, getVisiMisi, getKontak } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [h, a, l, s, ex, vm, k] = await Promise.all([
    getHero(), getAbout(), getLayanan(), getServis(), getEkspansi(), getVisiMisi(), getKontak(),
  ]);

  if (!h) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p style={{ color: 'var(--ink-soft)' }}>
          Belum ada data. Pastikan database sudah diisi dengan <code>schema.sql</code> dan environment variable database sudah benar.
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar active="home" />
      <main>
        {/* ===== HERO ===== */}
        <section id="top" className="relative overflow-hidden border-b" style={{ borderColor: 'var(--line)' }}>
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:px-10 md:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex items-center gap-3">
                <ScanBar size="lg" />
                <span className="eyebrow">{h.eyebrow}</span>
              </div>

              <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] md:text-6xl" style={{ color: 'var(--ink)' }}>
                {(h.heading || '').split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed md:text-lg" style={{ color: 'var(--ink-soft)' }}>
                {h.subheading}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={h.ctaPrimary?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: 'var(--navy)' }}
                >
                  {h.ctaPrimary?.label}
                </a>
                <a
                  href={h.ctaSecondary?.href}
                  className="inline-flex items-center gap-2 border px-6 py-3 text-sm font-semibold transition-colors hover:bg-white"
                  style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                >
                  {h.ctaSecondary?.label}
                </a>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t pt-6" style={{ borderColor: 'var(--line)' }}>
                {(h.stats || []).map((stat, i) => (
                  <div key={i}>
                    <dt className="eyebrow">{stat.label}</dt>
                    <dd className="mt-1 font-mono-label text-sm" style={{ color: 'var(--ink)' }}>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative flex items-center justify-center py-6">
              <div className="spec-card relative w-full max-w-sm p-3">
                <SpecCardFrame />
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.heroImage} alt={h.heroImageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="font-mono-label text-[0.65rem]" style={{ color: 'var(--ink-soft)' }}>{h.heroImageCaption}</span>
                  <ScanBar size="sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section id="tentang" className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <ScanBar />
              <h2 className="mt-5 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--ink)' }}>{a?.heading || 'Tentang Kami'}</h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed md:text-lg" style={{ color: 'var(--ink-soft)' }}>
              {(a?.paragraphs || []).map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <div className="grid grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4" style={{ borderColor: 'var(--line)' }}>
                {(a?.tags || []).map((tag, i) => (
                  <span key={i} className="font-mono-label text-xs" style={{ color: 'var(--navy)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== LAYANAN / CORE BUSINESS ===== */}
        <section id="layanan" className="border-t" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
          <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
            <div className="mb-10">
              <ScanBar />
              <h2 className="mt-4 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--ink)' }}>{l?.heading}</h2>
              <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--ink-soft)' }}>{l?.subheading}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {(l?.pillars || []).map((p, i) => (
                <div className="spec-card relative flex flex-col p-5" key={i}>
                  <SpecCardFrame />
                  <span className="font-mono-label text-xs" style={{ color: 'var(--signal-red)' }}>{p.tag}</span>
                  <h3 className="mt-2 text-base font-semibold" style={{ color: 'var(--ink)' }}>{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{p.desc}</p>
                  {p.brands?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-3" style={{ borderColor: 'var(--line)' }}>
                      {p.brands.map((b, j) => (
                        <span key={j} className="font-mono-label border px-2 py-0.5 text-[0.6rem]" style={{ borderColor: 'var(--line)', color: 'var(--navy)' }}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {l?.gallery?.length > 0 && <GallerySwiper gallery={l.gallery} />}
          </div>
        </section>

        {/* ===== PROGRAM SERVIS ===== */}
        <section id="program-servis" className="border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <div>
                <ScanBar />
                <h2 className="mt-5 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--ink)' }}>{s?.heading}</h2>
                <p className="mt-5 text-sm leading-relaxed md:text-base" style={{ color: 'var(--ink-soft)' }}>{s?.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {(s?.regions || []).map((r, i) => (
                  <div className="spec-card relative flex flex-col p-7" key={i}>
                    <SpecCardFrame />
                    <span className="inline-block w-fit font-mono-label text-xs px-2 py-1" style={{ background: r.color, color: '#fff' }}>{r.tag}</span>
                    <ul className="mt-5 space-y-3">
                      {(r.perks || []).map((perk, j) => (
                        <li key={j} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }}></span>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== EKSPANSI ===== */}
        <section id="ekspansi" className="border-t" style={{ borderColor: 'var(--line-on-dark)', background: 'var(--navy-deep)' }}>
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
            <div className="mb-14">
              <ScanBar />
              <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">{ex?.heading}</h2>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: 'rgba(255,255,255,0.65)' }}>{ex?.subheading}</p>
            </div>

            <ol className="relative border-l pl-8" style={{ borderColor: 'var(--line-on-dark)' }}>
              {(ex?.timeline || []).map((item, i) => (
                <li className="relative pb-14 last:pb-0" key={i}>
                  <span className="absolute top-1 h-2.5 w-2.5 rounded-full" style={{ background: item.color, left: 'calc(-2rem - 5px)' }} aria-hidden="true"></span>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono-label text-xs" style={{ color: item.color }}>{item.date}</span>
                    <span className="font-mono-label text-[0.65rem] px-2 py-0.5" style={{ border: `1px solid ${item.color}`, color: item.color }}>{item.status}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{item.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===== VISI MISI ===== */}
        <section id="visi-misi" className="border-t" style={{ borderColor: 'var(--line)', background: 'var(--paper-card)' }}>
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <ScanBar />
                <span className="eyebrow mt-5 block">Visi</span>
                <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl" style={{ color: 'var(--ink)' }}>{vm?.vision}</h2>
              </div>
              <div>
                <span className="eyebrow block">Misi</span>
                <ol className="mt-4 space-y-5 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                  {(vm?.missions || []).map((m, i) => (
                    <li className="flex gap-4" key={i}>
                      <span className="font-mono-label text-sm shrink-0" style={{ color: 'var(--signal-red)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-sm leading-relaxed md:text-base" style={{ color: 'var(--ink-soft)' }}>{m}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ===== KONTAK ===== */}
        <section id="kontak" className="border-t" style={{ borderColor: 'var(--line)' }}>
          <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
            <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
              <div>
                <ScanBar />
                <h2 className="mt-5 text-3xl font-semibold md:text-4xl" style={{ color: 'var(--ink)' }}>{k?.heading}</h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed md:text-base" style={{ color: 'var(--ink-soft)' }}>{k?.subheading}</p>

                <ul className="mt-8 space-y-3">
                  {(k?.infoPills || []).map((pill, i) => (
                    <li className="flex items-center gap-3" key={i}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm" style={{ background: 'var(--line-soft)' }}>
                        <span style={{ color: 'var(--navy)' }}><InfoIcon type={pill.type} /></span>
                      </span>
                      <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>{pill.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${k?.whatsapp || '6283833502020'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: 'var(--navy)' }}
                >
                  <Icon type="whatsapp" className="h-4 w-4" />
                  Chat via WhatsApp
                </a>
              </div>

              <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
                {(k?.channels || []).map((ch, i) => (
                  <a
                    key={i}
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 border-t py-5 first:border-t last:border-b"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors group-hover:text-white" style={{ background: 'var(--line-soft)', color: 'var(--navy)' }}>
                        <ChannelIcon type={ch.type} />
                      </span>
                      <span>
                        <span className="eyebrow block">{ch.label}</span>
                        <span className="mt-0.5 block text-base font-semibold" style={{ color: 'var(--ink)' }}>{ch.value}</span>
                        <span className="mt-0.5 block text-xs" style={{ color: 'var(--ink-soft)' }}>{ch.note}</span>
                      </span>
                    </div>
                    <span className="font-mono-label text-sm transition-transform group-hover:translate-x-1" style={{ color: 'var(--navy)' }}>→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
