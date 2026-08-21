'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/#tentang', label: 'Tentang' },
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#program-servis', label: 'Program Servis' },
  { href: '/#ekspansi', label: 'Ekspansi' },
  { href: '/#kontak', label: 'Kontak' },
  { href: '/berita', label: 'Berita' },
];

export default function Navbar({ active = 'home' }) {
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 border-b bg-white transition-shadow duration-200"
      style={{ borderColor: 'var(--line)', boxShadow: shadow ? '0 1px 3px #0000001a,0 1px 2px -1px #0000001a' : '' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <a href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-fortune.jpg" alt="Fortune Solusindo" style={{ height: '2rem', width: 'auto' }} className="md:h-9" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const isBerita = l.href === '/berita';
            const isActive = isBerita && active === 'berita';
            return (
              <a
                key={l.href}
                href={l.href}
                className="group relative eyebrow pb-0.5 transition-colors hover:text-[var(--navy)]"
                style={{ color: isActive ? 'var(--navy)' : undefined }}
              >
                {l.label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left transition-transform duration-200 group-hover:scale-x-100"
                  style={{ background: 'var(--navy)', transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                ></span>
              </a>
            );
          })}
        </nav>

        <a
          href="https://wa.me/6283833502020"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-none border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--navy)] hover:text-white md:inline-flex"
          style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
        >
          Hubungi Admin
        </a>

        <button
          id="hamburger"
          className="inline-flex flex-col gap-1.5 p-2 md:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ham-line block h-0.5 w-6 transition-transform duration-200" style={{ background: 'var(--ink)' }}></span>
          <span className="ham-line block h-0.5 w-6 transition-opacity duration-200" style={{ background: 'var(--ink)' }}></span>
          <span className="ham-line block h-0.5 w-4 transition-transform duration-200" style={{ background: 'var(--ink)' }}></span>
        </button>
      </div>

      <div className="overflow-hidden transition-all duration-300 md:hidden" style={{ maxHeight: open ? '24rem' : '0' }}>
        <div className="border-t" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <nav className="flex flex-col px-6 py-4">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="border-b py-3 text-sm font-medium transition-colors hover:text-[var(--navy)]" style={{ borderColor: 'var(--line-soft)' }}>
                {l.label}
              </a>
            ))}
            <a
              href="https://wa.me/6283833502020"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-center rounded-none px-4 py-3 text-sm font-semibold text-white"
              style={{ background: 'var(--navy)' }}
            >
              Hubungi Admin via WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
