import { Icon } from './Icons';

const NAV = [
  { label: 'Tentang Kami', href: '/#tentang' },
  { label: 'Bisnis Utama', href: '/#layanan' },
  { label: 'Program Layanan', href: '/#program-servis' },
  { label: 'Ekspansi', href: '/#ekspansi' },
  { label: 'Visi & Misi', href: '/#visi-misi' },
  { label: 'Kontak', href: '/#kontak' },
];

const SOCIALS = [
  { label: 'WhatsApp', href: 'https://wa.me/6283833502020', type: 'whatsapp' },
  { label: 'Instagram', href: 'https://instagram.com/fortune_solusindo', type: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61562802491014', type: 'facebook' },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--line)', background: '#fff' }}>
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-fortune.jpg" alt="Fortune Solusindo" style={{ height: '2rem', width: 'auto' }} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Solusi terpadu pengadaan mesin fotokopi, servis berkala, dan ekspansi bisnis multi-sektor di Sidoarjo, Jawa Timur.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.type}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-transparent hover:bg-[var(--navy)] hover:text-white"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                >
                  <Icon type={s.type} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Navigasi</p>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm transition-colors hover:underline" style={{ color: 'var(--ink-soft)' }}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Kontak</p>
            <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-soft)' }}>
              <li className="flex items-start gap-2">
                <Icon type="location" className="mt-0.5 h-4 w-4 shrink-0" />
                Sidoarjo, Jawa Timur
              </li>
              <li className="flex items-center gap-2">
                <Icon type="phone" className="h-4 w-4 shrink-0" />
                <a href="https://wa.me/6283833502020" className="hover:underline">0838 3350 2020</a>
              </li>
              <li className="flex items-center gap-2">
                <Icon type="instagram" className="h-4 w-4 shrink-0" />
                @fortune_solusindo
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 md:flex-row md:px-10">
          <p className="font-mono-label text-xs" style={{ color: 'var(--ink-soft)' }}>
            &copy; {new Date().getFullYear()} Fortune Solusindo. All rights reserved.
          </p>
          <p className="font-mono-label text-xs" style={{ color: 'var(--ink-soft)' }}>
            Sidoarjo, Jawa Timur — Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
